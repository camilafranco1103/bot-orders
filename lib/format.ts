/** Convierte minutos desde las 00:00 en una hora legible. Ej.: 690 → "11:30". */
export function formatTime(minutes: number): string {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const rest = String(minutes % 60).padStart(2, "0");
  return `${hours}:${rest}`;
}

const pesos = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

/** Muestra un precio guardado en centavos. Ej.: 250000 → "$ 2.500,00". */
export function formatPrice(cents: number): string {
  return pesos.format(cents / 100);
}
