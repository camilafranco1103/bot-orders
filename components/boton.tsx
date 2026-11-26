import type { ComponentProps } from "react";

const variantes = {
  primario: "bg-primario text-superficie border-primario hover:bg-primario-oscuro",
  secundario: "bg-superficie text-texto border-borde-fuerte hover:bg-barra",
  alerta: "bg-superficie text-alerta-texto border-alerta hover:bg-alerta-suave",
};

// Todo lo que acepta un <button> (onClick, disabled, type…) más nuestra "variante".
type BotonProps = ComponentProps<"button"> & { variante?: keyof typeof variantes };

export function Boton({
  variante = "primario",
  type = "button",
  className = "",
  ...props
}: BotonProps) {
  return (
    <button
      type={type}
      className={`focus-visible:outline-primario min-h-11 rounded-[10px] border px-4 text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 ${variantes[variante]} ${className}`}
      {...props}
    />
  );
}
