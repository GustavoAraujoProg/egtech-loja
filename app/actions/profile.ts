"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2, "Nome muito curto."),
  phone: z.string().trim().optional(),
  cpfCnpj: z.string().trim().optional(),
});

export type ActionResult = { error?: string; success?: boolean };

export async function updateProfile(input: {
  name: string;
  phone?: string;
  cpfCnpj?: string;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Você precisa estar logado." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      cpfCnpj: parsed.data.cpfCnpj || null,
    },
  });

  revalidatePath("/meu-perfil");
  revalidatePath("/minha-conta");
  return { success: true };
}
