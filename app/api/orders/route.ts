import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { ProdutoCompleto } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  criarClienteAsaas,
  criarCobrancaCartao,
  criarCobrancaPix,
  buscarQrCodePix,
  AsaasError,
} from "@/lib/asaas";

export const dynamic = "force-dynamic";

const enderecoSchema = z.object({
  cep: z.string().min(8),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
});

const itemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const cartaoSchema = z.object({
  holderName: z.string().min(1),
  number: z.string().min(13),
  expiryMonth: z.string().min(1).max(2),
  expiryYear: z.string().min(2),
  ccv: z.string().min(3).max(4),
});

const bodySchema = z.object({
  items: z.array(itemSchema).min(1),
  address: enderecoSchema,
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido."),
  phone: z.string().min(8, "Telefone inválido."),
  paymentMethod: z.enum(["CREDIT_CARD", "PIX"]),
  card: cartaoSchema.optional(),
});

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Você precisa entrar na sua conta." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }
  const { items, address, cpfCnpj, phone, paymentMethod, card } = parsed.data;

  if (paymentMethod === "CREDIT_CARD" && !card) {
    return NextResponse.json({ error: "Dados do cartão ausentes." }, { status: 400 });
  }

  // 1. Busca os produtos reais no banco (nunca confia em preço vindo do cliente)
  const productIds = items.map((i) => i.productId);
  const produtos = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const produtosPorId = new Map<string, ProdutoCompleto>(produtos.map((p: ProdutoCompleto) => [p.id, p]));

  for (const item of items) {
    const produto = produtosPorId.get(item.productId);
    if (!produto || !produto.active) {
      return NextResponse.json(
        { error: "Um dos produtos do carrinho não está mais disponível." },
        { status: 400 }
      );
    }
    if (produto.stock < item.quantity) {
      return NextResponse.json(
        { error: `Estoque insuficiente para "${produto.name}".` },
        { status: 400 }
      );
    }
  }

  const totalCents = items.reduce((soma, item) => {
    const produto = produtosPorId.get(item.productId)!;
    return soma + produto.priceCents * item.quantity;
  }, 0);

  if (totalCents <= 0) {
    return NextResponse.json({ error: "Carrinho vazio ou inválido." }, { status: 400 });
  }

  // 2. Garante que o usuário tem um cliente correspondente no Asaas
  let asaasCustomerId = user.asaasCustomerId;
  try {
    if (!asaasCustomerId) {
      const cliente = await criarClienteAsaas({
        name: user.name,
        email: user.email,
        cpfCnpj,
        phone,
        externalReference: user.id,
      });
      asaasCustomerId = cliente.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { asaasCustomerId, cpfCnpj, phone },
      });
    }
  } catch (error) {
    console.error("[Asaas] Falha ao criar/registrar cliente:", error);
    const msg = error instanceof AsaasError ? error.message : "Falha ao registrar cliente no Asaas.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // 3. Salva o endereço e cria o pedido (status PENDING)
  await prisma.address.create({ data: { userId: user.id, ...address } });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "PENDING",
      paymentMethod,
      totalCents,
      asaasCustomerId,
      addressSnapshot: address,
      items: {
        create: items.map((item) => {
          const produto = produtosPorId.get(item.productId)!;
          return {
            productId: produto.id,
            productName: produto.name,
            quantity: item.quantity,
            unitPriceCents: produto.priceCents,
          };
        }),
      },
    },
  });

  const descricao = `Pedido EGTech #${order.id.slice(-8)}`;

  // 4. Dispara a cobrança no Asaas
  try {
    if (paymentMethod === "CREDIT_CARD" && card) {
      const pagamento = await criarCobrancaCartao({
        customer: asaasCustomerId,
        value: totalCents / 100,
        description: descricao,
        externalReference: order.id,
        remoteIp: getClientIp(request),
        creditCard: card,
        creditCardHolderInfo: {
          name: card.holderName,
          email: user.email,
          cpfCnpj,
          postalCode: address.cep,
          addressNumber: address.number,
          addressComplement: address.complement,
          phone,
        },
      });

      // Cartão aprovado na hora: baixa o estoque
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: "CONFIRMED",
            asaasPaymentId: pagamento.id,
          },
        }),
        ...items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        ),
      ]);

      return NextResponse.json({ orderId: order.id, status: "CONFIRMED" });
    }

    if (paymentMethod === "PIX") {
      const pagamento = await criarCobrancaPix({
        customer: asaasCustomerId,
        value: totalCents / 100,
        description: descricao,
        externalReference: order.id,
      });
      const qrCode = await buscarQrCodePix(pagamento.id);

      await prisma.order.update({
        where: { id: order.id },
        data: {
          asaasPaymentId: pagamento.id,
          pixQrCodeImage: qrCode.encodedImage,
          pixCopiaECola: qrCode.payload,
          pixExpiration: new Date(qrCode.expirationDate),
        },
      });

      return NextResponse.json({
        orderId: order.id,
        status: "PENDING",
        pix: {
          qrCodeImage: qrCode.encodedImage,
          copiaECola: qrCode.payload,
          expiration: qrCode.expirationDate,
        },
      });
    }

    return NextResponse.json({ error: "Forma de pagamento inválida." }, { status: 400 });
  } catch (error) {
    // Cartão recusado ou erro do Asaas: guarda o motivo e devolve pro cliente tentar de novo
    console.error("[Asaas] Falha ao criar cobrança:", error);
    const msg =
      error instanceof AsaasError ? error.message : "Não foi possível processar o pagamento.";
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "DECLINED", declineReason: msg },
    });
    return NextResponse.json({ orderId: order.id, status: "DECLINED", error: msg }, { status: 200 });
  }
}
