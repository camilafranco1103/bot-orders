"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/generated/prisma/enums";
import { estaActiva, seccionesPara } from "@/lib/navegacion";

/** El ícono se usa como máscara para que tome el color del texto. */
function Icono({ nombre }: { nombre: string }) {
  return (
    <span
      aria-hidden="true"
      className="size-5 shrink-0 bg-current"
      style={{ mask: `url(/icons/${nombre}.svg) center / contain no-repeat` }}
    />
  );
}

/** Menú de la barra lateral (escritorio). */
export function NavegacionLateral({ rol }: { rol?: Role }) {
  const ruta = usePathname();

  return (
    <nav aria-label="Secciones del panel">
      <ul className="flex flex-col gap-1">
        {seccionesPara(rol).map(({ href, nombre, icono }) => {
          const activa = estaActiva(href, ruta);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activa ? "page" : undefined}
                className={`focus-visible:outline-primario flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-[15px] focus-visible:outline-2 ${
                  activa
                    ? "bg-primario-suave text-primario-oscuro font-bold"
                    : "text-texto hover:bg-barra"
                }`}
              >
                <Icono nombre={icono} />
                {nombre}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Barra fija abajo (celular). */
export function NavegacionInferior({ rol }: { rol?: Role }) {
  const ruta = usePathname();

  return (
    <nav
      aria-label="Secciones del panel"
      className="border-borde bg-superficie fixed inset-x-0 bottom-0 border-t pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid auto-cols-fr grid-flow-col">
        {seccionesPara(rol).map(({ href, corto, icono }) => {
          const activa = estaActiva(href, ruta);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activa ? "page" : undefined}
                className={`focus-visible:outline-primario flex min-h-15 min-w-0 flex-col items-center justify-center gap-1 text-xs focus-visible:-outline-offset-2 ${
                  activa ? "bg-primario-suave text-primario-oscuro font-bold" : "text-texto-suave"
                }`}
              >
                <Icono nombre={icono} />
                {corto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
