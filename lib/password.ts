import { compare, hash } from "bcryptjs";

// Cuántas rondas de cálculo usa bcrypt: más rondas, más difícil de adivinar (y más lento).
const ROUNDS = 12;

/** Convierte una contraseña en un hash que sí se puede guardar en la base. */
export function hashPassword(password: string): Promise<string> {
  return hash(password, ROUNDS);
}

/** Indica si la contraseña corresponde al hash guardado. */
export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}
