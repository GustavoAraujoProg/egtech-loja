import "server-only";
import { prisma } from "@/lib/prisma";

export async function getProductsByCategory(category: string) {
  return prisma.product.findMany({
    where: { category, active: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function searchProducts(query: string) {
  const q = query.trim();
  if (!q) return [];
  return prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function getAllActiveProducts() {
  return prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
}
