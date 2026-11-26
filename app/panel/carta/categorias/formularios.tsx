"use client";

import { useActionState } from "react";
import { Boton } from "@/components/boton";
import { Tarjeta } from "@/components/tarjeta";
import { borrar, crear, renombrar, reordenar, type EstadoFormulario } from "./actions";

const claseInput =
  "border-borde-fuerte bg-superficie focus-visible:outline-primario min-h-11 min-w-0 flex-1 rounded-[10px] border px-3.5 text-base focus-visible:outline-2";

const inicial: EstadoFormulario = {};

function MensajeError({ texto }: { texto?: string }) {
  if (!texto) return null;
  return (
    <p role="alert" className="bg-alerta-suave text-alerta-texto rounded-[10px] p-3 text-sm">
      {texto}
    </p>
  );
}

export function NuevaCategoria() {
  const [estado, accion, enviando] = useActionState(crear, inicial);

  return (
    <Tarjeta>
      <form action={accion} className="flex flex-col gap-2">
        <label htmlFor="nueva" className="text-sm font-bold">
          Nueva categoría
        </label>
        <div className="flex gap-2">
          <input id="nueva" name="nombre" required maxLength={40} className={claseInput} />
          <Boton type="submit" disabled={enviando}>
            Agregar
          </Boton>
        </div>
        <MensajeError texto={estado.error} />
      </form>
    </Tarjeta>
  );
}

type FilaCategoriaProps = {
  id: number;
  nombre: string;
  productos: number;
  primera: boolean;
  ultima: boolean;
  puedeBorrar: boolean;
};

export function FilaCategoria({
  id,
  nombre,
  productos,
  primera,
  ultima,
  puedeBorrar,
}: FilaCategoriaProps) {
  const [cambio, accionRenombrar, guardando] = useActionState(renombrar, inicial);
  const [baja, accionBorrar, borrando] = useActionState(borrar, inicial);

  return (
    <Tarjeta className="flex flex-col gap-3">
      <form action={accionRenombrar} className="flex gap-2">
        <input type="hidden" name="id" value={id} />
        <label htmlFor={`categoria-${id}`} className="sr-only">
          Nombre de la categoría
        </label>
        {/* `key` vuelve a crear el campo cuando cambia el nombre guardado. */}
        <input
          key={nombre}
          id={`categoria-${id}`}
          name="nombre"
          defaultValue={nombre}
          required
          maxLength={40}
          className={claseInput}
        />
        <Boton type="submit" variante="secundario" disabled={guardando}>
          Guardar
        </Boton>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <p className="text-texto-suave mr-auto text-sm">
          {productos === 1 ? "1 producto" : `${productos} productos`}
        </p>
        <form action={reordenar} className="flex gap-2">
          <input type="hidden" name="id" value={id} />
          <Boton
            type="submit"
            name="direccion"
            value="arriba"
            variante="secundario"
            disabled={primera}
            aria-label={`Subir ${nombre}`}
          >
            ↑
          </Boton>
          <Boton
            type="submit"
            name="direccion"
            value="abajo"
            variante="secundario"
            disabled={ultima}
            aria-label={`Bajar ${nombre}`}
          >
            ↓
          </Boton>
        </form>
        {puedeBorrar && productos === 0 && (
          <form
            action={accionBorrar}
            onSubmit={(evento) => {
              if (!confirm(`¿Borrar la categoría ${nombre}?`)) evento.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={id} />
            <Boton type="submit" variante="alerta" disabled={borrando}>
              Borrar
            </Boton>
          </form>
        )}
      </div>

      <MensajeError texto={cambio.error ?? baja.error} />
    </Tarjeta>
  );
}
