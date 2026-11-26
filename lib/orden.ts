export type Direccion = "arriba" | "abajo";

/** Devuelve una copia de la lista con `id` corrido un lugar. En los bordes no cambia. */
export function mover<T>(lista: T[], id: T, direccion: Direccion): T[] {
  const desde = lista.indexOf(id);
  const hasta = desde + (direccion === "arriba" ? -1 : 1);
  if (desde < 0 || hasta < 0 || hasta >= lista.length) return lista;

  const copia = [...lista];
  [copia[desde], copia[hasta]] = [copia[hasta], copia[desde]];
  return copia;
}
