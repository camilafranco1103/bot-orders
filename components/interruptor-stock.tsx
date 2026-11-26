import type { ComponentProps } from "react";

type InterruptorStockProps = Omit<ComponentProps<"button">, "children"> & {
  hayStock: boolean;
  producto: string; // para que un lector de pantalla diga de qué producto es
};

/** Interruptor "hay / no hay". Solo muestra el estado: quien lo usa decide qué hacer al tocarlo. */
export function InterruptorStock({ hayStock, producto, ...props }: InterruptorStockProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={hayStock}
      aria-label={`Stock de ${producto}`}
      className="focus-visible:outline-primario inline-flex min-h-11 items-center gap-2 rounded-lg focus-visible:outline-2 disabled:opacity-60"
      {...props}
    >
      <span
        className={`text-[13px] font-bold ${hayStock ? "text-primario-oscuro" : "text-alerta-texto"}`}
      >
        {hayStock ? "Hay stock" : "Sin stock"}
      </span>
      <span
        aria-hidden="true"
        className={`flex h-7 w-12 items-center rounded-full p-0.5 transition-colors ${hayStock ? "bg-primario" : "bg-apagado"}`}
      >
        <span
          className={`bg-superficie size-6 rounded-full transition-transform ${hayStock ? "translate-x-5" : ""}`}
        />
      </span>
    </button>
  );
}
