import "server-only";

// Documentação oficial: https://docs.asaas.com
// Sandbox: https://api-sandbox.asaas.com/v3   |   Produção: https://api.asaas.com/v3
// IMPORTANTE: se a Asaas mudar algum endpoint no futuro, confira sempre a doc oficial
// antes de alterar isto aqui — não adivinhe.

const ASAAS_API_URL =
  process.env.ASAAS_API_URL ?? "https://api-sandbox.asaas.com/v3";
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

export class AsaasError extends Error {
  status: number;
  raw: unknown;
  constructor(message: string, status: number, raw: unknown) {
    super(message);
    this.name = "AsaasError";
    this.status = status;
    this.raw = raw;
  }
}

async function asaasFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!ASAAS_API_KEY) {
    throw new Error(
      "ASAAS_API_KEY não configurada nas variáveis de ambiente."
    );
  }

  const res = await fetch(`${ASAAS_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "EGTech/1.0 (Next.js)",
      // A Asaas usa o header "access_token" — NÃO usa "Authorization: Bearer".
      access_token: ASAAS_API_KEY,
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.errors?.[0]?.description ?? `Erro na API do Asaas (HTTP ${res.status})`;
    throw new AsaasError(message, res.status, data);
  }

  return data as T;
}

// ---------- Clientes ----------

export type AsaasCustomerInput = {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  externalReference?: string; // usamos o id do usuário local
};

export async function criarClienteAsaas(input: AsaasCustomerInput) {
  return asaasFetch<{ id: string }>("/customers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ---------- Cobrança com cartão de crédito (checkout transparente) ----------
// Enviamos os dados do cartão direto na criação da cobrança: a Asaas tenta
// autorizar na hora e responde HTTP 200 (aprovado) ou HTTP 400 (recusado).
// O cliente nunca é redirecionado pra tela da Asaas.

export type CreditCardInput = {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
};

export type CreditCardHolderInfoInput = {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  addressComplement?: string;
  phone?: string;
};

export type CriarCobrancaCartaoInput = {
  customer: string; // id do cliente no Asaas
  value: number; // em reais (ex: 199.90)
  description: string;
  externalReference: string; // id do pedido local
  installmentCount?: number;
  installmentValue?: number;
  creditCard: CreditCardInput;
  creditCardHolderInfo: CreditCardHolderInfoInput;
  remoteIp: string;
};

export type AsaasPayment = {
  id: string;
  status: string; // CONFIRMED, RECEIVED, PENDING, OVERDUE, ...
  value: number;
  invoiceUrl?: string;
};

export async function criarCobrancaCartao(input: CriarCobrancaCartaoInput) {
  const hoje = new Date().toISOString().slice(0, 10);

  return asaasFetch<AsaasPayment>("/payments", {
    method: "POST",
    body: JSON.stringify({
      customer: input.customer,
      billingType: "CREDIT_CARD",
      value: input.value,
      dueDate: hoje,
      description: input.description,
      externalReference: input.externalReference,
      installmentCount: input.installmentCount,
      installmentValue: input.installmentValue,
      creditCard: input.creditCard,
      creditCardHolderInfo: input.creditCardHolderInfo,
      remoteIp: input.remoteIp,
    }),
  });
}

// ---------- Cobrança via PIX ----------

export async function criarCobrancaPix(input: {
  customer: string;
  value: number;
  description: string;
  externalReference: string;
}) {
  const hoje = new Date().toISOString().slice(0, 10);

  return asaasFetch<AsaasPayment>("/payments", {
    method: "POST",
    body: JSON.stringify({
      customer: input.customer,
      billingType: "PIX",
      value: input.value,
      dueDate: hoje,
      description: input.description,
      externalReference: input.externalReference,
    }),
  });
}

export async function buscarQrCodePix(paymentId: string) {
  return asaasFetch<{
    encodedImage: string; // imagem em base64
    payload: string; // código "copia e cola"
    expirationDate: string;
  }>(`/payments/${paymentId}/pixQrCode`, { method: "GET" });
}
