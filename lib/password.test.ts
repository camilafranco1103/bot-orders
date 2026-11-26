import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("contraseñas", () => {
  it("no guarda la contraseña en texto plano", async () => {
    const passwordHash = await hashPassword("una-clave-de-prueba");
    expect(passwordHash).not.toContain("una-clave-de-prueba");
  });

  it("acepta la contraseña correcta y rechaza otra", async () => {
    const passwordHash = await hashPassword("una-clave-de-prueba");
    expect(await verifyPassword("una-clave-de-prueba", passwordHash)).toBe(true);
    expect(await verifyPassword("otra-clave", passwordHash)).toBe(false);
  });
});
