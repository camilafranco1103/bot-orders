import Image from "next/image";

/** Sello propio de cocina sin TACC. No es el logo oficial. */
export function SelloSinTacc() {
  return (
    <p className="bg-trigo-suave text-trigo-texto inline-flex items-center gap-1 rounded-full py-1 pr-2.5 pl-2 text-xs font-bold">
      <Image src="/icons/brote.svg" alt="" width={16} height={16} />
      Sin TACC
    </p>
  );
}
