import { z } from "zod";

/** Datos del formulario de login. zod los valida antes de tocar la base. */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(72), // bcrypt solo usa los primeros 72 bytes
});

/** Nombre de una categoría de la carta. */
export const nombreCategoriaSchema = z
  .string()
  .trim()
  .min(1, "Escribí un nombre.")
  .max(40, "El nombre puede tener hasta 40 caracteres.");

export const idSchema = z.coerce.number().int().positive();
