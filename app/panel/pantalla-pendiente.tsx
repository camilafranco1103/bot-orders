import { Suspense } from "react";
import { Tarjeta } from "@/components/tarjeta";
import type { Permiso } from "@/lib/permisos";
import { requirePermission } from "@/server/auth/require-permission";
import { requireUser } from "@/server/auth/require-user";

/** Pantalla provisoria de una sección que todavía no se construyó. */
type PantallaPendienteProps = {
  titulo: string;
  permiso?: Permiso; // para secciones restringidas a un rol
};

export function PantallaPendiente({ titulo, permiso }: PantallaPendienteProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-titulo text-3xl font-semibold">{titulo}</h1>
      <Suspense fallback={<p>Cargando…</p>}>
        <Aviso permiso={permiso} />
      </Suspense>
    </div>
  );
}

async function Aviso({ permiso }: { permiso?: Permiso }) {
  await (permiso ? requirePermission(permiso) : requireUser());
  return (
    <Tarjeta className="max-w-md">
      <p className="text-texto-suave">Esta sección está en construcción.</p>
    </Tarjeta>
  );
}
