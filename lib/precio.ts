const formato = /^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$/; // 1500 · 1.500 · 1.500,50
const maximo = 10_000_000_00; // $ 10.000.000 en centavos

/** Convierte un precio escrito en pesos a centavos. Devuelve null si no es válido. */
export function leerPrecio(texto: string): number | null {
  const limpio = texto.replace(/[$\s]/g, "");
  if (!formato.test(limpio)) return null;

  const centavos = Math.round(Number(limpio.replaceAll(".", "").replace(",", ".")) * 100);
  return centavos > 0 && centavos <= maximo ? centavos : null;
}

/** Texto con el que se completa el campo al editar. Ej.: 150050 → "1500,50". */
export function precioParaCampo(centavos: number): string {
  const pesos = centavos / 100;
  return Number.isInteger(pesos) ? String(pesos) : pesos.toFixed(2).replace(".", ",");
}
