"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { idSchema } from "@/lib/schemas";
import { requirePermission } from "@/server/auth/require-permission";
import { cambiarStockProducto } from "@/server/carta/productos";

// Lo que llega del navegador se valida siempre, aunque TypeScript diga qué tipo es.
const datosSchema = z.object({ id: idSchema, hayStock: z.boolean() });

export async function cambiarStock(id: number, hayStock: boolean): Promise<{ error?: string }> {
  const user = await requirePermission("cambiarStock");
  const datos = datosSchema.parse({ id, hayStock });

  const error = await cambiarStockProducto(user.id, datos.id, datos.hayStock);
  // También si falló: la lista tiene que mostrar lo que realmente hay en la base.
  revalidatePath("/panel/carta", "layout");
  return { error };
}
