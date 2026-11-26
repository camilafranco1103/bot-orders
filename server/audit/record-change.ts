import type { Prisma } from "../../generated/prisma/client";
import { describirCambio, type Registro } from "./diff";

type Cambio = {
  userId: number | null; // null: lo hizo el sistema (por ejemplo, un pedido que venció)
  entity: "Product" | "Category" | "Substitute" | "Schedule" | "Order" | "User";
  entityId: string | number;
  before: Registro | null;
  after: Registro | null;
};

/**
 * Anota un cambio en el registro. Recibe la transacción (`tx`) en la que se hace el
 * cambio, así se guardan los dos o ninguno:
 *
 *   await prisma.$transaction(async (tx) => {
 *     const after = await tx.product.update({ ... });
 *     await recordChange(tx, { userId, entity: "Product", entityId: after.id, before, after });
 *   });
 */
export async function recordChange(
  tx: Prisma.TransactionClient,
  { userId, entity, entityId, before, after }: Cambio,
) {
  const cambio = describirCambio(before, after);
  if (!cambio) return;

  await tx.auditLog.create({
    data: { userId, entity, entityId: String(entityId), ...cambio },
  });
}
