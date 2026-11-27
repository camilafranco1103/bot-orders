"use client";

import { useActionState } from "react";
import { Boton } from "@/components/boton";
import { borrar, type EstadoProducto } from "./actions";

const inicial: EstadoProducto = {};

export function BorrarProducto({ id, nombre }: { id: number; nombre: string }) {
  const [estado, accion, borrando] = useActionState(borrar, inicial);

  return (
    <form
      action={accion}
      onSubmit={(evento) => {
        if (!confirm(`¿Borrar el producto ${nombre}?`)) evento.preventDefault();
      }}
      className="flex flex-col gap-2"
    >
      <input type="hidden" name="id" value={id} />
      {estado.error && (
        <p role="alert" className="bg-alerta-suave text-alerta-texto rounded-[10px] p-3 text-sm">
          {estado.error}
        </p>
      )}
      <Boton type="submit" variante="alerta" disabled={borrando} className="self-start">
        Borrar producto
      </Boton>
    </form>
  );
}
