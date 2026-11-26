/** Logo y nombre del local. */
export function Marca() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="bg-primario text-superficie font-titulo flex size-9 items-center justify-center rounded-[10px] text-lg font-semibold"
      >
        R
      </span>
      <div className="leading-snug">
        <p className="text-[13px] font-bold">Rotisería Sin TACC</p>
        <p className="text-texto-suave text-xs">Panel del equipo</p>
      </div>
    </div>
  );
}
