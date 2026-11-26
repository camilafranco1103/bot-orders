import { redirect } from "next/navigation";
import { puede, type Permiso } from "../../lib/permisos";
import { requireUser } from "./require-user";

/**
 * Chequeo de rol en el servidor. Se llama en cada página y en cada Server Action
 * restringida: ocultar un botón no impide que alguien mande el pedido a mano.
 */
export async function requirePermission(permiso: Permiso) {
  const user = await requireUser();
  if (!puede(user.role, permiso)) redirect("/panel");
  return user;
}
