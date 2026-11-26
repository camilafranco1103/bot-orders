/** Secciones del panel. La barra lateral y la inferior salen de esta única lista. */
export const secciones = [
  { href: "/panel", nombre: "Pedidos", corto: "Pedidos", icono: "pedidos" },
  { href: "/panel/carta", nombre: "Carta y stock", corto: "Carta", icono: "carta" },
  { href: "/panel/derivados", nombre: "Derivados", corto: "Derivados", icono: "derivados" },
  { href: "/panel/horarios", nombre: "Horarios", corto: "Horarios", icono: "horarios" },
  { href: "/panel/registro", nombre: "Registro de cambios", corto: "Registro", icono: "registro" },
] as const;

/** Indica si una sección es la que se está viendo (incluye sus subpáginas). */
export function estaActiva(href: string, ruta: string): boolean {
  // "/panel" es el comienzo de todas las rutas, así que solo vale si coincide exacto.
  if (href === "/panel") return ruta === href;
  return ruta === href || ruta.startsWith(`${href}/`);
}
