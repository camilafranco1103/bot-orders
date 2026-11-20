import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL }),
});

// Datos de ejemplo. Es idempotente: se puede correr varias veces sin duplicar (upsert).
const catalog = [
  {
    category: "Empanadas",
    products: [
      { name: "Empanada de carne", priceCents: 250000 },
      { name: "Empanada de jamón y queso", priceCents: 240000 },
    ],
  },
  {
    category: "Tartas",
    products: [
      { name: "Tarta de verdura", priceCents: 1800000 },
      { name: "Tarta de jamón y queso", priceCents: 1900000 },
    ],
  },
  {
    category: "Pastas",
    products: [{ name: "Ñoquis de papa", priceCents: 1500000 }],
  },
];

async function main() {
  for (const { category, products } of catalog) {
    const cat = await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });
    for (const p of products) {
      const existing = await prisma.product.findFirst({
        where: { name: p.name, categoryId: cat.id },
      });
      if (!existing) await prisma.product.create({ data: { ...p, categoryId: cat.id } });
    }
  }
  console.log("Seed listo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
