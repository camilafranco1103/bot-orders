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

// Un texto vacío se guarda como null: "falta el dato".
const datoDeFicha = z
  .string()
  .trim()
  .max(500, "Cada dato de la ficha puede tener hasta 500 caracteres.")
  .transform((texto) => texto || null);

/** Ficha de un producto, sin el precio (que tiene su propio permiso). */
export const productoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Escribí un nombre.")
    .max(80, "El nombre puede tener hasta 80 caracteres."),
  categoryId: z.coerce.number("Elegí una categoría.").int().positive("Elegí una categoría."),
  ingredients: datoDeFicha,
  allergens: datoDeFicha,
  crossContamination: datoDeFicha,
});
