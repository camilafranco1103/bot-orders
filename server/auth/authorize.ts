import { verifyPassword } from "../../lib/password";
import { loginSchema } from "../../lib/schemas";

type StoredUser = {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  active: boolean;
};

/**
 * Decide si las credenciales son válidas. Recibe la búsqueda del usuario como
 * parámetro para poder testearla sin base de datos.
 */
export async function authorizeUser(
  credentials: unknown,
  findByEmail: (email: string) => Promise<StoredUser | null>,
) {
  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) return null;

  const user = await findByEmail(parsed.data.email);
  if (!user || !user.active) return null;
  if (!(await verifyPassword(parsed.data.password, user.passwordHash))) return null;

  // Solo lo necesario para la sesión: el hash nunca sale de acá.
  return { id: String(user.id), email: user.email, name: user.name };
}
