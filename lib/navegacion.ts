import type { Role } from "../generated/prisma/enums";
import { puede, type Permiso } from "./permisos";

type Seccion = {
  href: string;
  nombre: string;
  corto: string;
  icono: string;
  permiso?: Permiso; // si falta, la ve todo el equipo
};

/** Secciones del panel. La barra lateral y la inferior salen de esta única lista. */
const secciones: Seccion[] = [
  { href: "/panel", nombre: "Pedidos", corto: "Pedidos", icono: "pedidos" },
  { href: "/panel/carta", nombre: "Carta y stock", corto: "Carta", icono: "carta" },
  { href: "/panel/derivados", nombre: "Derivados", corto: "Derivados", icono: "derivados" },
  { href: "/panel/horarios", nombre: "Horarios", corto: "Horarios", icono: "horarios" },
  { href: "/panel/registro", nombre: "Registro de cambios", corto: "Registro", icono: "registro" },
  {
    href: "/panel/usuarios",
    nombre: "Usuarios",
    corto: "Usuarios",
    icono: "usuarios",
    permiso: "gestionarUsuarios",
  },
];

/** Secciones que puede ver un rol. Sin rol (todavía cargando) solo las comunes. */
export function seccionesPara(rol?: Role): Seccion[] {
  return secciones.filter(({ permiso }) => !permiso || (rol !== undefined && puede(rol, permiso)));
}

/** Indica si una sección es la que se está viendo (incluye sus subpáginas). */
export function estaActiva(href: string, ruta: string): boolean {
  // "/panel" es el comienzo de todas las rutas, así que solo vale si coincide exacto.
  if (href === "/panel") return ruta === href;
  return ruta === href || ruta.startsWith(`${href}/`);
}
