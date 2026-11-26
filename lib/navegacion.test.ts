import { describe, expect, it } from "vitest";
import { estaActiva } from "./navegacion";

describe("estaActiva", () => {
  it("marca Pedidos solo en la portada del panel", () => {
    expect(estaActiva("/panel", "/panel")).toBe(true);
    expect(estaActiva("/panel", "/panel/carta")).toBe(false);
  });

  it("marca una sección también en sus subpáginas", () => {
    expect(estaActiva("/panel/carta", "/panel/carta/nuevo")).toBe(true);
  });

  it("no confunde rutas que empiezan parecido", () => {
    expect(estaActiva("/panel/carta", "/panel/cartas")).toBe(false);
  });
});
