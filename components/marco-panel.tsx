import { Suspense, type ReactNode } from "react";
import { Marca } from "./marca";
import { NavegacionInferior, NavegacionLateral } from "./navegacion";
import { SelloSinTacc } from "./sello-sin-tacc";

type MarcoPanelProps = {
  salir: ReactNode; // botón para cerrar sesión
  children: ReactNode; // la pantalla que se está viendo
};

/** Estructura común del panel: barra lateral en escritorio, barras arriba y abajo en celular. */
export function MarcoPanel({ salir, children }: MarcoPanelProps) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="border-borde bg-superficie sticky top-0 hidden h-screen w-62 shrink-0 flex-col justify-between overflow-y-auto border-r px-4 py-6 md:flex">
        <div className="flex flex-col items-start gap-5">
          <Marca />
          <SelloSinTacc />
          <div className="w-full">
            <Suspense>
              <NavegacionLateral />
            </Suspense>
          </div>
        </div>
        {salir}
      </aside>

      <header className="border-borde bg-superficie flex items-center justify-between gap-3 border-b px-4 py-3 md:hidden">
        <Marca />
        {salir}
      </header>

      {/* El espacio de abajo evita que la barra inferior tape el contenido en el celular. */}
      <main className="min-w-0 flex-1 p-4 pb-24 md:p-8">{children}</main>

      <Suspense>
        <NavegacionInferior />
      </Suspense>
    </div>
  );
}
