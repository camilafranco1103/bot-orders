import { z } from "zod";
import { datosFaltantes, type FichaProducto } from "./producto";
import { idSchema } from "./schemas";

// `.catch` usa ese valor si el dato de la dirección es inválido, en vez de dar error.
const filtrosSchema = z.object({
  q: z.string().trim().max(80).catch(""),
  categoria: idSchema.optional().catch(undefined),
  estado: z.enum(["sin-stock", "faltan-datos"]).optional().catch(undefined),
});

export type Filtros = z.infer<typeof filtrosSchema>;

export const leerFiltros = (parametros: unknown): Filtros => filtrosSchema.parse(parametros);

/** Arma la dirección de la carta con esos filtros. Los vacíos no se incluyen. */
export function hrefCarta({ q, categoria, estado }: Filtros): string {
  const parametros = new URLSearchParams();
  if (q) parametros.set("q", q);
  if (categoria) parametros.set("categoria", String(categoria));
  if (estado) parametros.set("estado", estado);
  const texto = parametros.toString();
  return texto ? `/panel/carta?${texto}` : "/panel/carta";
}

// Minúsculas y sin tildes: "jamon" encuentra "Jamón".
const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

type Filtrable = FichaProducto & { name: string; categoryId: number; available: boolean };

export function filtrarProductos<T extends Filtrable>(
  productos: T[],
  { q, categoria, estado }: Filtros,
): T[] {
  return productos.filter(
    (producto) =>
      normalizar(producto.name).includes(normalizar(q)) &&
      (!categoria || producto.categoryId === categoria) &&
      (estado !== "sin-stock" || !producto.available) &&
      (estado !== "faltan-datos" || datosFaltantes(producto).length > 0),
  );
}
