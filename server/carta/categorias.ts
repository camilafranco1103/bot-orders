import { mover, type Direccion } from "../../lib/orden";
import { prisma } from "../../lib/prisma";
import { recordChange } from "../audit/record-change";

/** Orden en que se muestran las categorías en toda la app. */
export const ordenCategorias = [{ position: "asc" as const }, { name: "asc" as const }];

// Cada función devuelve un mensaje de error para mostrar, o undefined si salió bien.
// El control de permisos se hace antes, en la Server Action.

const repetida = "Ya existe una categoría con ese nombre.";
const inexistente = "Esa categoría ya no existe.";

const conMismoNombre = (name: string, excepto?: number) => ({
  name: { equals: name, mode: "insensitive" as const },
  ...(excepto && { id: { not: excepto } }),
});

export function crearCategoria(userId: number, name: string) {
  return prisma.$transaction(async (tx) => {
    if (await tx.category.findFirst({ where: conMismoNombre(name) })) return repetida;

    const ultima = await tx.category.aggregate({ _max: { position: true } });
    const after = await tx.category.create({
      data: { name, position: (ultima._max.position ?? -1) + 1 },
    });
    await recordChange(tx, { userId, entity: "Category", entityId: after.id, before: null, after });
  });
}

export function renombrarCategoria(userId: number, id: number, name: string) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.category.findUnique({ where: { id } });
    if (!before) return inexistente;
    if (await tx.category.findFirst({ where: conMismoNombre(name, id) })) return repetida;

    const after = await tx.category.update({ where: { id }, data: { name } });
    await recordChange(tx, { userId, entity: "Category", entityId: id, before, after });
  });
}

export function moverCategoria(userId: number, id: number, direccion: Direccion) {
  return prisma.$transaction(async (tx) => {
    const actuales = await tx.category.findMany({ orderBy: ordenCategorias });
    const orden = mover(
      actuales.map((c) => c.id),
      id,
      direccion,
    );

    for (const [position, categoriaId] of orden.entries()) {
      const before = actuales.find((c) => c.id === categoriaId)!;
      if (before.position === position) continue;
      const after = await tx.category.update({ where: { id: categoriaId }, data: { position } });
      await recordChange(tx, {
        userId,
        entity: "Category",
        entityId: categoriaId,
        before,
        after,
      });
    }
    return undefined;
  });
}

export function borrarCategoria(userId: number, id: number) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.category.findUnique({ where: { id } });
    if (!before) return inexistente;
    if ((await tx.product.count({ where: { categoryId: id } })) > 0) {
      return "No se puede borrar: todavía tiene productos.";
    }

    await tx.category.delete({ where: { id } });
    await recordChange(tx, { userId, entity: "Category", entityId: id, before, after: null });
  });
}
