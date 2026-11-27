import { beforeEach, describe, expect, it, vi } from "vitest";
import { crearProducto, editarProducto } from "./productos";

// Base de datos simulada: la transacción recibe estas funciones falsas.
const tx = vi.hoisted(() => ({
  product: { findFirst: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
  category: { findUnique: vi.fn() },
  auditLog: { create: vi.fn() },
}));

vi.mock("../../lib/prisma", () => ({
  prisma: { $transaction: (operacion: (t: typeof tx) => unknown) => operacion(tx) },
}));

const ficha = {
  name: "Carne",
  categoryId: 1,
  ingredients: null,
  allergens: null,
  crossContamination: null,
};

beforeEach(() => {
  vi.resetAllMocks();
  tx.category.findUnique.mockResolvedValue({ id: 1 });
});

describe("crearProducto", () => {
  it("lo crea y lo registra", async () => {
    tx.product.create.mockResolvedValue({ id: 7, ...ficha, priceCents: 150000 });

    expect(await crearProducto(1, { ...ficha, priceCents: 150000 })).toBeUndefined();
    expect(tx.auditLog.create).toHaveBeenCalledOnce();
  });

  it("rechaza un nombre repetido", async () => {
    tx.product.findFirst.mockResolvedValue({ id: 2 });

    expect(await crearProducto(1, { ...ficha, priceCents: 1 })).toMatch("Ya existe");
    expect(tx.product.create).not.toHaveBeenCalled();
  });

  it("rechaza una categoría que no existe", async () => {
    tx.category.findUnique.mockResolvedValue(null);

    expect(await crearProducto(1, { ...ficha, priceCents: 1 })).toMatch("categoría");
    expect(tx.product.create).not.toHaveBeenCalled();
  });
});

describe("editarProducto", () => {
  it("registra solo lo que cambió", async () => {
    const antes = { id: 7, ...ficha, priceCents: 150000 };
    tx.product.findUnique.mockResolvedValue(antes);
    tx.product.update.mockResolvedValue({ ...antes, allergens: "Huevo" });

    await editarProducto(1, 7, { ...ficha, allergens: "Huevo" });

    expect(tx.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        oldValue: { allergens: null },
        newValue: { allergens: "Huevo" },
      }),
    });
  });
});
