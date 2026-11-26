import { Suspense } from "react";
import { requireUser } from "@/server/auth/require-user";
import { logout } from "./actions";

// Pantalla provisoria: el panel real se arma en el Sprint 2.
export default function PanelPage() {
  return (
    <main className="flex flex-col items-start gap-4 p-6">
      <h1 className="font-titulo text-3xl font-semibold">Panel</h1>
      {/* Lo que depende de la sesión se carga en cada visita; el resto ya está armado. */}
      <Suspense fallback={<p>Cargando…</p>}>
        <Greeting />
      </Suspense>
      <form action={logout}>
        <button
          type="submit"
          className="border-borde-fuerte bg-superficie focus-visible:outline-primario min-h-11 rounded-[10px] border px-4 font-bold focus-visible:outline-2"
        >
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}

async function Greeting() {
  const user = await requireUser();
  return <p>Hola, {user.name}.</p>;
}
