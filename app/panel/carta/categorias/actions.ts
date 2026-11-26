"use server";

import { revalidatePath } from "next/cache";
import { idSchema, nombreCategoriaSchema } from "@/lib/schemas";
import { requirePermission } from "@/server/auth/require-permission";
import {
  borrarCategoria,
  crearCategoria,
  moverCategoria,
  renombrarCategoria,
} from "@/server/carta/categorias";

export type EstadoFormulario = { error?: string };

// Actualiza las pantallas que muestran categorías.
function terminar(error: string | undefined): EstadoFormulario {
  if (!error) revalidatePath("/panel/carta", "layout");
  return { error };
}

export async function crear(_: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  const user = await requirePermission("altaYBajaCategorias");
  const nombre = nombreCategoriaSchema.safeParse(datos.get("nombre"));
  if (!nombre.success) return { error: nombre.error.issues[0].message };

  return terminar(await crearCategoria(user.id, nombre.data));
}

export async function renombrar(_: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  const user = await requirePermission("editarFichas");
  const id = idSchema.parse(datos.get("id"));
  const nombre = nombreCategoriaSchema.safeParse(datos.get("nombre"));
  if (!nombre.success) return { error: nombre.error.issues[0].message };

  return terminar(await renombrarCategoria(user.id, id, nombre.data));
}

export async function reordenar(datos: FormData) {
  const user = await requirePermission("editarFichas");
  const id = idSchema.parse(datos.get("id"));
  const direccion = datos.get("direccion") === "arriba" ? "arriba" : "abajo";

  terminar(await moverCategoria(user.id, id, direccion));
}

export async function borrar(_: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  const user = await requirePermission("altaYBajaCategorias");
  return terminar(await borrarCategoria(user.id, idSchema.parse(datos.get("id"))));
}
