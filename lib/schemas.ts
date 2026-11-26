import { z } from "zod";

/** Datos del formulario de login. zod los valida antes de tocar la base. */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(72), // bcrypt solo usa los primeros 72 bytes
});
