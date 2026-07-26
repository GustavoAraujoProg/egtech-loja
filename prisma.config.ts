import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// No Prisma 7, a URL de conexão usada pelo CLI (migrate, studio, etc.)
// fica aqui, não mais dentro do schema.prisma.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
