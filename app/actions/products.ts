"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug muito curto.")
    .regex(/^[a-z0-9-]+$/, "Use só letras minúsculas, números e hífen (ex: fone-max)."),
  name: z.string().trim().min(2, "Nome muito curto."),
  category: z.enum(["celular", "fones", "drones"], { error: "Categoria inválida." }),
  description: z.string().trim().min(1, "Descrição obrigatória."),
  priceCents: z.number().int().nonnegative(),
  oldPriceCents: z.number().int().nonnegative().nullable().optional(),
  imageUrl: z.string().trim().url("URL de imagem inválida."),
  images: z.array(z.string().trim().url()).default([]),
  stock: z.number().int().nonnegative(),
  active: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ActionResult = { error?: string };

async function checarAdmin(): Promise<ActionResult | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Acesso restrito ao administrador." };
  }
  return null;
}

function revalidarTudo(category: string, slug?: string) {
  revalidatePath("/admin/produtos");
  revalidatePath(`/${category}`);
  revalidatePath("/pesquisa");
  if (slug) revalidatePath(`/produto/${slug}`);
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  const negado = await checarAdmin();
  if (negado) return negado;

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const data = parsed.data;

  const existente = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existente) return { error: "Já existe um produto com esse slug." };

  await prisma.product.create({ data });
  revalidarTudo(data.category, data.slug);
  return {};
}

export async function updateProduct(id: string, input: ProductInput): Promise<ActionResult> {
  const negado = await checarAdmin();
  if (negado) return negado;

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const data = parsed.data;

  const conflito = await prisma.product.findFirst({ where: { slug: data.slug, NOT: { id } } });
  if (conflito) return { error: "Já existe outro produto com esse slug." };

  await prisma.product.update({ where: { id }, data });
  revalidarTudo(data.category, data.slug);
  return {};
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const negado = await checarAdmin();
  if (negado) return negado;

  const produto = await prisma.product.findUnique({ where: { id } });
  if (!produto) return {};

  await prisma.product.delete({ where: { id } });
  revalidarTudo(produto.category);
  return {};
}

export async function toggleProductActive(id: string, active: boolean): Promise<ActionResult> {
  const negado = await checarAdmin();
  if (negado) return negado;

  const produto = await prisma.product.update({ where: { id }, data: { active } });
  revalidarTudo(produto.category, produto.slug);
  return {};
}
