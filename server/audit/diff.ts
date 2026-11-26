/** Campos que nunca se copian al registro: se anota que cambiaron, no su contenido. */
const secretos = new Set(["passwordHash"]);
/** Campos que cambian solos y no dicen nada sobre lo que hizo una persona. */
const ignorados = new Set(["createdAt", "updatedAt"]);

type Valor = string | number | boolean | null | Valor[] | { [clave: string]: Valor };
export type Registro = Record<string, unknown>;
export type Valores = Record<string, Valor>;

// Pasa cualquier dato a algo que se pueda guardar como JSON (las fechas quedan como texto).
const aJson = (dato: unknown): Valor => JSON.parse(JSON.stringify(dato ?? null));

function limpiar(registro: Registro, claves = Object.keys(registro)): Valores {
  return Object.fromEntries(
    claves
      .filter((clave) => !ignorados.has(clave))
      .map((clave) => [clave, secretos.has(clave) ? "[oculto]" : aJson(registro[clave])]),
  );
}

/**
 * Prepara qué guardar de un cambio. Sin `antes` es un alta; sin `despues`, una baja.
 * En una modificación quedan solo los campos que cambiaron; si no cambió nada, devuelve null.
 */
export function describirCambio(antes: Registro | null, despues: Registro | null) {
  if (!antes && !despues) return null;
  if (!antes) return { action: "create" as const, newValue: limpiar(despues!) };
  if (!despues) return { action: "delete" as const, oldValue: limpiar(antes) };

  // Solo se miran los campos presentes en `despues`: permite pasar una actualización parcial.
  const cambiados = Object.keys(despues).filter(
    (clave) =>
      despues[clave] !== undefined &&
      JSON.stringify(aJson(antes[clave])) !== JSON.stringify(aJson(despues[clave])),
  );
  const relevantes = cambiados.filter((clave) => !ignorados.has(clave));
  if (relevantes.length === 0) return null;

  return {
    action: "update" as const,
    oldValue: limpiar(antes, relevantes),
    newValue: limpiar(despues, relevantes),
  };
}
