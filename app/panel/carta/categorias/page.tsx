import Link from "next/link";
import { Suspense } from "react";
import { puede } from "@/lib/permisos";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/server/auth/require-permission";
import { ordenCategorias } from "@/server/carta/categorias";
import { FilaCategoria, NuevaCategoria } from "./formularios";

export default function CategoriasPage() {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Link
        href="/panel/carta"
        className="text-primario-oscuro flex min-h-11 items-center self-start font-bold"
      >
        ← Volver a la carta
      </Link>
      <h1 className="font-titulo text-3xl font-semibold">Categorías</h1>
      <Suspense fallback={<p>Cargando…</p>}>
        <Lista />
      </Suspense>
    </div>
  );
}

async function Lista() {
  const user = await requirePermission("editarFichas");
  const categorias = await prisma.category.findMany({
    orderBy: ordenCategorias,
    include: { _count: { select: { products: true } } },
  });
  const puedeAdministrar = puede(user.role, "altaYBajaCategorias");

  return (
    <>
      {puedeAdministrar && <NuevaCategoria />}
      {categorias.length === 0 && <p>Todavía no hay categorías.</p>}
      <ul className="flex flex-col gap-3">
        {categorias.map((categoria, indice) => (
          <li key={categoria.id}>
            <FilaCategoria
              id={categoria.id}
              nombre={categoria.name}
              productos={categoria._count.products}
              primera={indice === 0}
              ultima={indice === categorias.length - 1}
              puedeBorrar={puedeAdministrar}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
