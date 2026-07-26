import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Evita criar várias conexões com o banco durante o hot-reload do "next dev".
// Em produção (Vercel), cada instância serverless cria a sua própria.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// A partir do Prisma 7, a conexão com o banco precisa passar por um
// "driver adapter" — não dá mais só pra colocar a DATABASE_URL no schema.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
