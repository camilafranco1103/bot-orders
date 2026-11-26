import Link from "next/link";
import { Suspense } from "react";
import { Etiqueta } from "@/components/etiqueta";
import { Tarjeta } from "@/components/tarjeta";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { idSchema } from "@/lib/schemas";
import { requireUser } from "@/server/auth/require-user";
import { ordenCategorias } from "@/server/carta/categorias";

export default function CartaPage({ searchParams }: PageProps<"/panel/carta">) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-titulo text-3xl font-semibold">Carta y stock</h1>
        <Link
          href="/panel/carta/categorias"
          className="border-borde-fuerte bg-superficie hover:bg-barra flex min-h-11 items-center rounded-[10px] border px-4 text-[15px] font-bold"
        >
          Categorías
        </Link>
      </div>
      <Suspense fallback={<p>Cargando…</p>}>
        <Carta searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// El filtro viaja en la dirección (?categoria=2): se puede compartir y funciona "atrás".
async function Carta({ searchParams }: Pick<PageProps<"/panel/carta">, "searchParams">) {
  await requireUser();
  const filtro = idSchema.safeParse((await searchParams).categoria);

  const categorias = await prisma.category.findMany({ orderBy: ordenCategorias });
  const elegida = categorias.find((c) => filtro.success && c.id === filtro.data);

  const productos = await prisma.product.findMany({
    where: elegida ? { categoryId: elegida.id } : undefined,
    include: { category: true },
    orderBy: [{ category: { position: "asc" } }, { category: { name: "asc" } }, { name: "asc" }],
  });

  const chips = [
    { href: "/panel/carta", nombre: "Todo", activo: !elegida },
    ...categorias.map((c) => ({
      href: `/panel/carta?categoria=${c.id}`,
      nombre: c.name,
      activo: c.id === elegida?.id,
    })),
  ];

  return (
    <>
      <nav aria-label="Filtrar por categoría">
        <ul className="flex flex-wrap gap-2">
          {chips.map(({ href, nombre, activo }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={activo ? "true" : undefined}
                className={`flex min-h-11 items-center rounded-full border px-4 text-sm font-bold ${
                  activo
                    ? "bg-primario border-primario text-superficie"
                    : "border-borde-fuerte bg-superficie"
                }`}
              >
                {nombre}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {productos.length === 0 && <p>No hay productos en esta categoría.</p>}
      <ul className="flex flex-col gap-3">
        {productos.map((producto) => (
          <li key={producto.id}>
            <Tarjeta className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold">{producto.name}</p>
                <p className="text-texto-suave text-sm">
                  {producto.category.name} · {formatPrice(producto.priceCents)}
                </p>
              </div>
              {!producto.available && <Etiqueta texto="Sin stock" tono="alerta" />}
            </Tarjeta>
          </li>
        ))}
      </ul>
    </>
  );
}
