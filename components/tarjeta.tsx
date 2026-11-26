import type { ComponentProps } from "react";

/** Contenedor base del panel. */
export function Tarjeta({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div className={`border-borde bg-superficie rounded-2xl border p-4 ${className}`} {...props} />
  );
}
