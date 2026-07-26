import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Configure esta URL no painel do Asaas em Integrações > Webhooks:
//   https://SEUDOMINIO.com/api/webhooks/asaas
// e coloque o mesmo valor de ASAAS_WEBHOOK_TOKEN como "Token de autenticação".
// Eventos recomendados: PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE,
// PAYMENT_REFUNDED, PAYMENT_REPROVED_BY_RISK_ANALYSIS

type AsaasWebhookBody = {
  event: string;
  payment?: {
    id: string;
    status: string;
    externalReference?: string;
  };
};

export async function POST(request: NextRequest) {
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
  const receivedToken = request.headers.get("asaas-access-token");

  if (expectedToken) {
    if (receivedToken !== expectedToken) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }
  } else {
    console.warn(
      "ASAAS_WEBHOOK_TOKEN não configurado — o webhook está aceitando requisições sem validar a origem. Configure essa variável antes de ir para produção."
    );
  }

  const body = (await request.json().catch(() => null)) as AsaasWebhookBody | null;
  if (!body?.event || !body.payment) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const { event, payment } = body;
  const orderId = payment.externalReference;
  if (!orderId) {
    // Evento sem relação com um pedido nosso (ex: cobrança avulsa criada manualmente no painel)
    return NextResponse.json({ ok: true });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ ok: true });
  }

  switch (event) {
    case "PAYMENT_CONFIRMED": {
      if (order.status === "PENDING") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "CONFIRMED", asaasPaymentId: payment.id },
        });
      }
      break;
    }

    case "PAYMENT_RECEIVED": {
      // Idempotência: só baixa estoque se ainda não tinha sido baixado.
      if (order.status !== "PAID") {
        const jaBaixouEstoque = order.paymentMethod === "CREDIT_CARD";
        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: { status: "PAID", asaasPaymentId: payment.id },
          }),
          ...(jaBaixouEstoque
            ? []
            : order.items.map((item: { productId: string; quantity: number }) =>
                prisma.product.update({
                  where: { id: item.productId },
                  data: { stock: { decrement: item.quantity } },
                })
              )),
        ]);
      }
      break;
    }

    case "PAYMENT_REPROVED_BY_RISK_ANALYSIS": {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "DECLINED", declineReason: "Recusado pela análise de risco do Asaas." },
      });
      break;
    }

    case "PAYMENT_OVERDUE": {
      if (order.status === "PENDING") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "CANCELED", declineReason: "Cobrança expirou sem pagamento." },
        });
      }
      break;
    }

    case "PAYMENT_REFUNDED": {
      const jaTinhaBaixadoEstoque = order.status === "PAID" || order.paymentMethod === "CREDIT_CARD";
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: "REFUNDED" },
        }),
        ...(jaTinhaBaixadoEstoque
          ? order.items.map((item: { productId: string; quantity: number }) =>
              prisma.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } },
              })
            )
          : []),
      ]);
      break;
    }

    default:
      // Outros eventos (PAYMENT_CREATED, PAYMENT_UPDATED, etc.) não exigem ação hoje.
      break;
  }

  return NextResponse.json({ ok: true });
}
