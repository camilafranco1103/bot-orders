"use client";

import { useActionState, useLayoutEffect, useState } from "react";
import { Boton } from "@/components/boton";
import { Tarjeta } from "@/components/tarjeta";
import { guardar, type EstadoProducto, type ValoresProducto } from "./actions";

const claseCampo =
  "border-borde-fuerte bg-superficie focus-visible:outline-primario min-h-11 w-full rounded-[10px] border px-3.5 py-2 text-base focus-visible:outline-2";

const fichas = [
  { campo: "ingredients", titulo: "Ingredientes", ayuda: "Ej.: harina de arroz, carne, huevo." },
  { campo: "allergens", titulo: "Alérgenos", ayuda: "Si no tiene, escribí «No contiene»." },
  {
    campo: "crossContamination",
    titulo: "Contaminación cruzada",
    ayuda: "Cómo se elabora y se separa. Completalo solo con información confirmada.",
  },
] as const;

const inicial: EstadoProducto = {};

type Props = {
  id?: number; // sin id, es un producto nuevo
  categorias: { id: number; name: string }[];
  valores: ValoresProducto;
  puedeCambiarPrecio: boolean;
  precioActual?: string;
};

export function FormularioProducto(props: Props) {
  // Next guarda la pantalla al navegar a otra. Cambiar `version` al salir hace que
  // el formulario empiece de cero la próxima vez, con los datos guardados.
  const [version, setVersion] = useState(0);
  useLayoutEffect(() => () => setVersion((v) => v + 1), []);

  return <Campos key={version} {...props} />;
}

function Campos({ id, categorias, valores, puedeCambiarPrecio, precioActual }: Props) {
  const [estado, accion, enviando] = useActionState(guardar, inicial);
  // Después de un error se muestra lo que se había escrito.
  const actuales = estado.valores ?? valores;

  return (
    <Tarjeta>
      <form action={accion} className="flex flex-col gap-4">
        {id && <input type="hidden" name="id" value={id} />}

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-bold">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={80}
            defaultValue={actuales.name}
            className={claseCampo}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="categoryId" className="text-sm font-bold">
            Categoría
          </label>
          {/* El `key` hace que la lista tome el valor elegido después de un error. */}
          <select
            key={estado.intento}
            id="categoryId"
            name="categoryId"
            required
            defaultValue={actuales.categoryId ?? ""}
            className={claseCampo}
          >
            <option value="" disabled>
              Elegí una categoría
            </option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
        </div>

        {puedeCambiarPrecio ? (
          <div className="flex flex-col gap-1">
            <label htmlFor="precio" className="text-sm font-bold">
              Precio en pesos
            </label>
            <input
              id="precio"
              name="precio"
              required
              inputMode="decimal"
              placeholder="1500"
              defaultValue={actuales.precio}
              className={claseCampo}
            />
          </div>
        ) : (
          <p className="text-sm">
            <span className="font-bold">Precio:</span> {precioActual} (solo lo cambia el dueño)
          </p>
        )}

        {fichas.map(({ campo, titulo, ayuda }) => (
          <div key={campo} className="flex flex-col gap-1">
            <label htmlFor={campo} className="text-sm font-bold">
              {titulo}
            </label>
            <p id={`${campo}-ayuda`} className="text-texto-suave text-sm">
              {ayuda}
            </p>
            <textarea
              id={campo}
              name={campo}
              rows={3}
              maxLength={500}
              aria-describedby={`${campo}-ayuda`}
              defaultValue={actuales[campo]}
              className={claseCampo}
            />
          </div>
        ))}

        <p className="bg-primario-suave text-primario-oscuro rounded-[10px] p-3 text-sm">
          Si dejás un dato vacío, el bot no responde sobre eso y le pasa la consulta a una persona.
        </p>

        {estado.error && (
          <p role="alert" className="bg-alerta-suave text-alerta-texto rounded-[10px] p-3 text-sm">
            {estado.error}
          </p>
        )}

        <Boton type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar"}
        </Boton>
      </form>
    </Tarjeta>
  );
}
