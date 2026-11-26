import { Suspense } from "react";
import { Tarjeta } from "@/components/tarjeta";
import { requireUser } from "@/server/auth/require-user";

/** Pantalla provisoria de una sección que todavía no se construyó. */
export function PantallaPendiente({ titulo }: { titulo: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-titulo text-3xl font-semibold">{titulo}</h1>
      <Suspense fallback={<p>Cargando…</p>}>
        <Aviso />
      </Suspense>
    </div>
  );
}

async function Aviso() {
  await requireUser();
  return (
    <Tarjeta className="max-w-md">
      <p className="text-texto-suave">Esta sección está en construcción.</p>
    </Tarjeta>
  );
}
