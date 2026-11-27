/** Datos de la ficha que el bot necesita para responder. Vacío significa "falta". */
export type FichaProducto = {
  ingredients: string | null;
  allergens: string | null;
  crossContamination: string | null;
};

const obligatorios: [keyof FichaProducto, string][] = [
  ["ingredients", "ingredientes"],
  ["allergens", "alérgenos"],
  ["crossContamination", "contaminación cruzada"],
];

/** Devuelve el nombre de cada dato sin completar. Lista vacía: la ficha está completa. */
export function datosFaltantes(producto: FichaProducto): string[] {
  return obligatorios.filter(([campo]) => !producto[campo]?.trim()).map(([, nombre]) => nombre);
}
