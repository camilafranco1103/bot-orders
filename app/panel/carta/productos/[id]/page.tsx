import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { puede } from "@/lib/permisos";
import { precioParaCampo } from "@/lib/precio";
import { prisma } from "@/lib/prisma";
import { idSchema } from "@/lib/schemas";
import { requirePermission } from "@/server/auth/require-permission";
import { ordenCategorias } from "@/server/carta/categorias";
import { FormularioProducto } from "../formulario";
import { MarcoProducto } from "../marco";

// La carpeta [id] es un segmento variable: /panel/carta/productos/7 llega como id "7".
export default function ProductoPage({ params }: PageProps<"/panel/carta/productos/[id]">) {
  return (
    <MarcoProducto titulo="Editar producto">
      <Editar params={params} />
    </MarcoProducto>
  );
}

async function Editar({ params }: Pick<PageProps<"/panel/carta/productos/[id]">, "params">) {
  const user = await requirePermission("editarFichas");
  const id = idSchema.safeParse((await params).id);
  if (!id.success) notFound();

  const [producto, categorias] = await Promise.all([
    prisma.product.findUnique({ where: { id: id.data } }),
    prisma.category.findMany({ orderBy: ordenCategorias }),
  ]);
  if (!producto) notFound();

  return (
    <FormularioProducto
      key={producto.id}
      id={producto.id}
      categorias={categorias}
      puedeCambiarPrecio={puede(user.role, "cambiarPrecios")}
      precioActual={formatPrice(producto.priceCents)}
      valores={{
        name: producto.name,
        categoryId: String(producto.categoryId),
        precio: precioParaCampo(producto.priceCents),
        ingredients: producto.ingredients ?? "",
        allergens: producto.allergens ?? "",
        crossContamination: producto.crossContamination ?? "",
      }}
    />
  );
}
