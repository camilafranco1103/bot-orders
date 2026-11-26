import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 no lee la URL desde schema.prisma: va acá.
// Las migraciones usan la conexión DIRECTA (DIRECT_URL), no el pooler de Supabase.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
