import { describe, expect, it } from "vitest";
import { describirCambio } from "./diff";

const producto = { id: 1, name: "Tarta", priceCents: 1000, available: true, ingredients: null };

describe("describirCambio", () => {
  it("en una modificación guarda solo lo que cambió", () => {
    expect(describirCambio(producto, { ...producto, available: false })).toEqual({
      action: "update",
      oldValue: { available: true },
      newValue: { available: false },
    });
  });

  it("acepta una actualización parcial", () => {
    expect(describirCambio(producto, { priceCents: 1200 })).toEqual({
      action: "update",
      oldValue: { priceCents: 1000 },
      newValue: { priceCents: 1200 },
    });
  });

  it("no registra nada si no cambió nada", () => {
    expect(describirCambio(producto, { ...producto })).toBeNull();
    expect(describirCambio(producto, { updatedAt: new Date() })).toBeNull();
  });

  it("registra altas y bajas", () => {
    expect(describirCambio(null, producto)).toEqual({ action: "create", newValue: producto });
    expect(describirCambio(producto, null)).toEqual({ action: "delete", oldValue: producto });
  });

  it("anota que cambió la contraseña sin guardar el hash", () => {
    const cambio = describirCambio({ passwordHash: "viejo" }, { passwordHash: "nuevo" });
    expect(cambio).toEqual({
      action: "update",
      oldValue: { passwordHash: "[oculto]" },
      newValue: { passwordHash: "[oculto]" },
    });
  });
});
