import { describe, expect, it, vi } from "vitest";
import { requirePermission } from "./require-permission";
import { requireUser } from "./require-user";

// Se reemplazan la sesión y la redirección de Next para probar solo la decisión.
vi.mock("./require-user", () => ({ requireUser: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (ruta: string) => {
    throw new Error(`redirige a ${ruta}`);
  },
}));

const usuario = { id: 1, email: "persona@example.com", name: "Persona", active: true };

describe("requirePermission", () => {
  it("deja pasar a quien tiene el permiso", async () => {
    vi.mocked(requireUser).mockResolvedValue({ ...usuario, role: "OWNER" });
    await expect(requirePermission("cambiarPrecios")).resolves.toMatchObject({ role: "OWNER" });
  });

  it("redirige a quien no lo tiene", async () => {
    vi.mocked(requireUser).mockResolvedValue({ ...usuario, role: "EMPLOYEE" });
    await expect(requirePermission("cambiarPrecios")).rejects.toThrow("redirige a /panel");
  });
});
