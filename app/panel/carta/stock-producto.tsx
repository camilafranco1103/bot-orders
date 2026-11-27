"use client";

import { unstable_rethrow } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { InterruptorStock } from "@/components/interruptor-stock";
import { cambiarStock } from "./actions";

type Props = { id: number; nombre: string; hayStock: boolean };

export function StockProducto({ id, nombre, hayStock }: Props) {
  // `mostrado` es el valor guardado, salvo mientras se está guardando un cambio.
  const [mostrado, mostrarYa] = useOptimistic(hayStock);
  const [guardando, iniciar] = useTransition();
  const [error, setError] = useState<string>();

  function alternar() {
    const deseado = !mostrado;
    iniciar(async () => {
      mostrarYa(deseado); // cambia en pantalla sin esperar al servidor
      setError(undefined);
      try {
        setError((await cambiarStock(id, deseado)).error);
      } catch (falla) {
        unstable_rethrow(falla); // las redirecciones de Next (ej.: al login) siguen su curso
        setError("No se pudo guardar. Revisá la conexión y probá de nuevo.");
      }
      // Al terminar, el interruptor vuelve a mostrar lo guardado.
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <InterruptorStock
        hayStock={mostrado}
        producto={nombre}
        disabled={guardando}
        onClick={alternar}
      />
      {error && (
        <p role="alert" className="text-alerta-texto text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
