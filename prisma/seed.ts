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

// Fichas de ejemplo (ficticias). Los productos que no figuran acá quedan sin datos
// a propósito, para probar que el bot derive a una persona.
const details = [
  {
    name: "Empanada de carne",
    ingredients: "Premezcla sin TACC, carne vacuna, cebolla, huevo y condimentos",
    allergens: "Huevo",
    crossContamination: "Se elabora en una cocina exclusiva sin TACC.",
  },
  {
    name: "Empanada de jamón y queso",
    ingredients: "Premezcla sin TACC, jamón cocido y queso muzzarella",
    allergens: "Leche",
    crossContamination: "Se elabora en una cocina exclusiva sin TACC.",
    available: false,
  },
];

// Horarios de ejemplo en minutos desde las 00:00, de martes (2) a sábado (6).
const slots = [
  { type: "ATTENTION", opensAt: 11 * 60, closesAt: 15 * 60 },
  { type: "ATTENTION", opensAt: 19 * 60, closesAt: 23 * 60 },
  { type: "ORDERS", opensAt: 11 * 60, closesAt: 14 * 60 + 30 },
  { type: "ORDERS", opensAt: 19 * 60, closesAt: 22 * 60 + 30 },
] as const;

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
  // Solo completa fichas vacías: no pisa lo que se haya editado después.
  for (const { name, ...data } of details) {
    await prisma.product.updateMany({ where: { name, ingredients: null }, data });
  }

  // Si falta la empanada de jamón y queso, se ofrece la de carne.
  const missing = await prisma.product.findFirstOrThrow({
    where: { name: "Empanada de jamón y queso" },
  });
  const replacement = await prisma.product.findFirstOrThrow({
    where: { name: "Empanada de carne" },
  });
  const pair = { productId: missing.id, substituteId: replacement.id };
  await prisma.substitute.upsert({
    where: { productId_substituteId: pair },
    update: {},
    create: pair,
  });

  for (let weekday = 2; weekday <= 6; weekday++) {
    for (const slot of slots) {
      await prisma.schedule.upsert({
        where: {
          type_weekday_opensAt: { type: slot.type, weekday, opensAt: slot.opensAt },
        },
        update: {},
        create: { ...slot, weekday },
      });
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
