"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { puede } from "@/lib/permisos";
import { leerPrecio } from "@/lib/precio";
import { idSchema, productoSchema } from "@/lib/schemas";
import { requirePermission } from "@/server/auth/require-permission";
import { crearProducto, editarProducto } from "@/server/carta/productos";

const campos = [
  "name",
  "categoryId",
  "precio",
  "ingredients",
  "allergens",
  "crossContamination",
] as const;

export type ValoresProducto = Partial<Record<(typeof campos)[number], string>>;
// `valores`: lo que se había escrito, para no perderlo si hay un error.
export type EstadoProducto = { error?: string; valores?: ValoresProducto; intento?: number };

const leerValores = (datos: FormData): ValoresProducto =>
  Object.fromEntries(campos.map((campo) => [campo, String(datos.get(campo) ?? "")]));

const precioInvalido = "Escribí un precio válido. Ej.: 1500 o 1.500,50.";

function volverALaCarta(): never {
  revalidatePath("/panel/carta", "layout");
  redirect("/panel/carta");
}

/** Crea el producto, o lo edita si el formulario trae un id. */
export async function guardar(previo: EstadoProducto, datos: FormData): Promise<EstadoProducto> {
  const id = datos.has("id") ? idSchema.parse(datos.get("id")) : undefined;
  const user = await requirePermission(id ? "editarFichas" : "altaYBajaProductos");

  const valores = leerValores(datos);
  const fallo = (error: string) => ({ error, valores, intento: (previo.intento ?? 0) + 1 });

  const ficha = productoSchema.safeParse(valores);
  if (!ficha.success) return fallo(ficha.error.issues[0].message);

  // Sin permiso de precios, lo que venga en ese campo se ignora.
  let priceCents: number | undefined;
  if (puede(user.role, "cambiarPrecios")) {
    priceCents = leerPrecio(valores.precio ?? "") ?? undefined;
    if (priceCents === undefined) return fallo(precioInvalido);
  }

  let error: string | undefined;
  if (id) {
    error = await editarProducto(user.id, id, { ...ficha.data, priceCents });
  } else {
    if (priceCents === undefined) return fallo(precioInvalido);
    error = await crearProducto(user.id, { ...ficha.data, priceCents });
  }
  if (error) return fallo(error);

  volverALaCarta();
}
