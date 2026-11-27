import Link from "next/link";
import { Suspense, type ReactNode } from "react";

/** Encabezado común de las pantallas de producto. */
export function MarcoProducto({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Link
        href="/panel/carta"
        className="text-primario-oscuro flex min-h-11 items-center self-start font-bold"
      >
        ← Volver a la carta
      </Link>
      <h1 className="font-titulo text-3xl font-semibold">{titulo}</h1>
      <Suspense fallback={<p>Cargando…</p>}>{children}</Suspense>
    </div>
  );
}
