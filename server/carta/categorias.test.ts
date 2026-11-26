import { beforeEach, describe, expect, it, vi } from "vitest";
import { borrarCategoria, crearCategoria } from "./categorias";

// Base de datos simulada: la transacción recibe estas funciones falsas.
const tx = vi.hoisted(() => ({
  category: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    aggregate: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  product: { count: vi.fn() },
  auditLog: { create: vi.fn() },
}));

vi.mock("../../lib/prisma", () => ({
  prisma: { $transaction: (operacion: (t: typeof tx) => unknown) => operacion(tx) },
}));

beforeEach(() => vi.resetAllMocks());

describe("crearCategoria", () => {
  it("la agrega al final y lo registra", async () => {
    tx.category.aggregate.mockResolvedValue({ _max: { position: 2 } });
    tx.category.create.mockResolvedValue({ id: 4, name: "Postres", position: 3 });

    expect(await crearCategoria(1, "Postres")).toBeUndefined();
    expect(tx.category.create).toHaveBeenCalledWith({ data: { name: "Postres", position: 3 } });
    expect(tx.auditLog.create).toHaveBeenCalledOnce();
  });

  it("rechaza un nombre repetido", async () => {
    tx.category.findFirst.mockResolvedValue({ id: 1, name: "Tartas" });

    expect(await crearCategoria(1, "tartas")).toMatch("Ya existe");
    expect(tx.category.create).not.toHaveBeenCalled();
  });
});

describe("borrarCategoria", () => {
  it("no borra una categoría con productos", async () => {
    tx.category.findUnique.mockResolvedValue({ id: 1, name: "Tartas" });
    tx.product.count.mockResolvedValue(2);

    expect(await borrarCategoria(1, 1)).toMatch("tiene productos");
    expect(tx.category.delete).not.toHaveBeenCalled();
  });

  it("borra una vacía y lo registra", async () => {
    tx.category.findUnique.mockResolvedValue({ id: 1, name: "Postres" });
    tx.product.count.mockResolvedValue(0);

    expect(await borrarCategoria(1, 1)).toBeUndefined();
    expect(tx.category.delete).toHaveBeenCalledOnce();
    expect(tx.auditLog.create).toHaveBeenCalledOnce();
  });
});
