const tonos = {
  neutro: "bg-neutro-suave text-texto",
  alerta: "bg-alerta-suave text-alerta-texto",
};

type EtiquetaProps = {
  texto: string;
  tono?: keyof typeof tonos; // solo se aceptan las claves de `tonos`
};

export function Etiqueta({ texto, tono = "neutro" }: EtiquetaProps) {
  return <span className={`rounded-md px-2 py-1 text-xs font-bold ${tonos[tono]}`}>{texto}</span>;
}
