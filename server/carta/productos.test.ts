import { beforeEach, describe, expect, it, vi } from "vitest";
import { borrarProducto, crearProducto, editarProducto } from "./productos";

// Base de datos simulada: la transacción recibe estas funciones falsas.
const tx = vi.hoisted(() => ({
  product: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  category: { findUnique: vi.fn() },
  orderItem: { count: vi.fn() },
  substitute: { findMany: vi.fn() },
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

describe("borrarProducto", () => {
  beforeEach(() => tx.product.findUnique.mockResolvedValue({ id: 7, ...ficha }));

  it("no borra un producto que aparece en pedidos", async () => {
    tx.orderItem.count.mockResolvedValue(1);

    expect(await borrarProducto(1, 7)).toMatch("aparece en pedidos");
    expect(tx.product.delete).not.toHaveBeenCalled();
  });

  it("registra la baja y la de sus reemplazos", async () => {
    tx.orderItem.count.mockResolvedValue(0);
    tx.substitute.findMany.mockResolvedValue([{ productId: 7, substituteId: 8 }]);

    expect(await borrarProducto(1, 7)).toBeUndefined();
    expect(tx.product.delete).toHaveBeenCalledOnce();
    expect(tx.auditLog.create).toHaveBeenCalledTimes(2);
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
