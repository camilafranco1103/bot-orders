import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/server/auth/require-permission";
import { ordenCategorias } from "@/server/carta/categorias";
import { FormularioProducto } from "../formulario";
import { MarcoProducto } from "../marco";

export default function NuevoProductoPage() {
  return (
    <MarcoProducto titulo="Nuevo producto">
      <Nuevo />
    </MarcoProducto>
  );
}

async function Nuevo() {
  await requirePermission("altaYBajaProductos");
  const categorias = await prisma.category.findMany({ orderBy: ordenCategorias });

  if (categorias.length === 0) {
    return (
      <p>
        Primero{" "}
        <Link href="/panel/carta/categorias" className="font-bold underline">
          creá una categoría
        </Link>
        .
      </p>
    );
  }

  return <FormularioProducto categorias={categorias} valores={{}} puedeCambiarPrecio />;
}
