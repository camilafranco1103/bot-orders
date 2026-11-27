import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { Boton } from "@/components/boton";
import { Etiqueta } from "@/components/etiqueta";
import { Tarjeta } from "@/components/tarjeta";
import { filtrarProductos, hrefCarta, leerFiltros } from "@/lib/filtros-carta";
import { formatPrice } from "@/lib/format";
import { puede } from "@/lib/permisos";
import { prisma } from "@/lib/prisma";
import { datosFaltantes } from "@/lib/producto";
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

type Chip = { href: string; nombre: string; activo: boolean };

function Chips({ titulo, chips }: { titulo: string; chips: Chip[] }) {
  return (
    <nav aria-label={titulo}>
      <ul className="flex flex-wrap gap-2">
        {chips.map(({ href, nombre, activo }) => (
          <li key={nombre}>
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
  );
}

// Los filtros viajan en la dirección (?categoria=2): se pueden compartir y funciona "atrás".
async function Carta({ searchParams }: Pick<PageProps<"/panel/carta">, "searchParams">) {
  const user = await requireUser();
  const filtros = leerFiltros(await searchParams);

  const [categorias, todos] = await Promise.all([
    prisma.category.findMany({ orderBy: ordenCategorias }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ category: { position: "asc" } }, { category: { name: "asc" } }, { name: "asc" }],
    }),
  ]);
  const productos = filtrarProductos(todos, filtros);

  const chipsCategoria = [{ id: undefined, name: "Todo" }, ...categorias].map((c) => ({
    href: hrefCarta({ ...filtros, categoria: c.id }),
    nombre: c.name,
    activo: filtros.categoria === c.id,
  }));
  const estados = [
    { valor: undefined, nombre: "Todos" },
    { valor: "sin-stock" as const, nombre: "Sin stock" },
    { valor: "faltan-datos" as const, nombre: "Faltan datos" },
  ];
  const chipsEstado = estados.map(({ valor, nombre }) => ({
    href: hrefCarta({ ...filtros, estado: valor }),
    nombre,
    activo: filtros.estado === valor,
  }));

  return (
    <>
      {puede(user.role, "altaYBajaProductos") && (
        <Link
          href="/panel/carta/productos/nuevo"
          className="bg-primario text-superficie hover:bg-primario-oscuro flex min-h-11 items-center self-start rounded-[10px] px-4 text-[15px] font-bold"
        >
          Nuevo producto
        </Link>
      )}

      {/* <Form> de Next: al enviarlo cambia la dirección sin recargar la página. */}
      <Form action="/panel/carta" className="flex gap-2">
        {filtros.categoria && <input type="hidden" name="categoria" value={filtros.categoria} />}
        {filtros.estado && <input type="hidden" name="estado" value={filtros.estado} />}
        <label htmlFor="busqueda" className="sr-only">
          Buscar producto
        </label>
        <input
          key={filtros.q}
          id="busqueda"
          name="q"
          type="search"
          defaultValue={filtros.q}
          maxLength={80}
          placeholder="Buscar producto"
          className="border-borde-fuerte bg-superficie focus-visible:outline-primario min-h-11 min-w-0 flex-1 rounded-[10px] border px-3.5 text-base focus-visible:outline-2"
        />
        <Boton type="submit">Buscar</Boton>
      </Form>

      <Chips titulo="Filtrar por categoría" chips={chipsCategoria} />
      <Chips titulo="Filtrar por estado" chips={chipsEstado} />

      {productos.length === 0 && <p>No hay productos con esos filtros.</p>}
      <ul className="flex flex-col gap-3">
        {productos.map((producto) => {
          const faltan = datosFaltantes(producto);
          return (
            <li key={producto.id}>
              <Tarjeta className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link
                    href={`/panel/carta/productos/${producto.id}`}
                    className="text-primario-oscuro flex min-h-11 items-center font-bold underline"
                  >
                    {producto.name}
                  </Link>
                  <p className="text-texto-suave text-sm">
                    {producto.category.name} · {formatPrice(producto.priceCents)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {faltan.length > 0 && (
                    <Etiqueta texto={`Faltan datos: ${faltan.join(", ")}`} tono="aviso" />
                  )}
                  {!producto.available && <Etiqueta texto="Sin stock" tono="alerta" />}
                </div>
              </Tarjeta>
            </li>
          );
        })}
      </ul>
    </>
  );
}
