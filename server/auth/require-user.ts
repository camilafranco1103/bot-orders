import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { auth } from "./index";

/**
 * Devuelve el usuario que inició sesión o manda al login. Consulta la base para
 * que un usuario desactivado pierda el acceso aunque su cookie siga vigente.
 */
export async function requireUser() {
  const session = await auth();
  const id = Number(session?.user?.id);
  if (!Number.isInteger(id)) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, active: true },
  });
  if (!user?.active) redirect("/login");
  return user;
}
