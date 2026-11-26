import { beforeAll, describe, expect, it } from "vitest";
import { hashPassword } from "../../lib/password";
import { authorizeUser } from "./authorize";

describe("authorizeUser", () => {
  const password = "una-clave-de-prueba";
  let passwordHash: string;

  beforeAll(async () => {
    passwordHash = await hashPassword(password);
  });

  const finder =
    (active = true) =>
    async (email: string) =>
      email === "duenio@example.com" ? { id: 1, email, name: "Dueño", passwordHash, active } : null;

  it("acepta credenciales correctas y no devuelve el hash", async () => {
    const result = await authorizeUser({ email: " Duenio@Example.com ", password }, finder());
    expect(result).toEqual({ id: "1", email: "duenio@example.com", name: "Dueño" });
  });

  it("rechaza una contraseña incorrecta", async () => {
    const credentials = { email: "duenio@example.com", password: "otra" };
    expect(await authorizeUser(credentials, finder())).toBeNull();
  });

  it("rechaza un usuario inexistente", async () => {
    const credentials = { email: "nadie@example.com", password };
    expect(await authorizeUser(credentials, finder())).toBeNull();
  });

  it("rechaza un usuario desactivado", async () => {
    const credentials = { email: "duenio@example.com", password };
    expect(await authorizeUser(credentials, finder(false))).toBeNull();
  });

  it("rechaza datos con formato inválido", async () => {
    expect(await authorizeUser({ email: "no-es-un-email" }, finder())).toBeNull();
  });
});
