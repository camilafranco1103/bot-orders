import type { z } from "zod";
import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { productoSchema } from "../../lib/schemas";
import { recordChange } from "../audit/record-change";

export type Ficha = z.infer<typeof productoSchema>;

// Cada función devuelve un mensaje de error para mostrar, o undefined si salió bien.
// El control de permisos se hace antes, en la Server Action.

const repetido = "Ya existe un producto con ese nombre.";
const sinCategoria = "Esa categoría ya no existe.";
const inexistente = "Ese producto ya no existe.";

// Dos productos con el mismo nombre confundirían al bot y a quien atiende.
async function validar(tx: Prisma.TransactionClient, ficha: Ficha, excepto?: number) {
  const mismo = await tx.product.findFirst({
    where: {
      name: { equals: ficha.name, mode: "insensitive" },
      ...(excepto && { id: { not: excepto } }),
    },
  });
  if (mismo) return repetido;
  if (!(await tx.category.findUnique({ where: { id: ficha.categoryId } }))) return sinCategoria;
}

export function crearProducto(userId: number, datos: Ficha & { priceCents: number }) {
  return prisma.$transaction(async (tx) => {
    const error = await validar(tx, datos);
    if (error) return error;

    const after = await tx.product.create({ data: datos });
    await recordChange(tx, { userId, entity: "Product", entityId: after.id, before: null, after });
  });
}

/** Recibe el valor deseado (no "invertir"): repetir el pedido no cambia el resultado. */
export function cambiarStockProducto(userId: number, id: number, available: boolean) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.product.findUnique({ where: { id } });
    if (!before) return inexistente;
    if (before.available === available) return;

    const after = await tx.product.update({ where: { id }, data: { available } });
    await recordChange(tx, { userId, entity: "Product", entityId: id, before, after });
  });
}

export function borrarProducto(userId: number, id: number) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.product.findUnique({ where: { id } });
    if (!before) return inexistente;
    if ((await tx.orderItem.count({ where: { productId: id } })) > 0) {
      return "No se puede borrar: aparece en pedidos. Marcalo sin stock.";
    }

    // La base borra solos los reemplazos que lo mencionan: también se anotan.
    const reemplazos = await tx.substitute.findMany({
      where: { OR: [{ productId: id }, { substituteId: id }] },
    });
    for (const reemplazo of reemplazos) {
      await recordChange(tx, {
        userId,
        entity: "Substitute",
        entityId: `${reemplazo.productId}-${reemplazo.substituteId}`,
        before: reemplazo,
        after: null,
      });
    }

    await tx.product.delete({ where: { id } });
    await recordChange(tx, { userId, entity: "Product", entityId: id, before, after: null });
  });
}

/** Sin `priceCents`, el precio queda como estaba. */
export function editarProducto(userId: number, id: number, datos: Ficha & { priceCents?: number }) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.product.findUnique({ where: { id } });
    if (!before) return inexistente;
    const error = await validar(tx, datos, id);
    if (error) return error;

    const after = await tx.product.update({ where: { id }, data: datos });
    await recordChange(tx, { userId, entity: "Product", entityId: id, before, after });
  });
}
