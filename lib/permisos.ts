// `import type` trae solo el tipo: nada de Prisma llega al navegador.
import type { Role } from "../generated/prisma/enums";

const compartidos = ["editarFichas", "cambiarStock", "gestionarPedidos"] as const;
const soloDuenio = [
  "gestionarUsuarios",
  "cambiarPrecios",
  "altaYBajaProductos",
  "altaYBajaCategorias",
] as const;

export type Permiso = (typeof compartidos)[number] | (typeof soloDuenio)[number];

/** Única definición de qué puede hacer cada rol. */
const permisosPorRol: Record<Role, readonly Permiso[]> = {
  OWNER: [...compartidos, ...soloDuenio],
  EMPLOYEE: compartidos,
};

export function puede(rol: Role, permiso: Permiso): boolean {
  return permisosPorRol[rol].includes(permiso);
}
