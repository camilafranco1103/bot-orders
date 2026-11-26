import { describe, expect, it } from "vitest";
import { estaActiva, seccionesPara } from "./navegacion";

describe("seccionesPara", () => {
  const rutas = (rol?: "OWNER" | "EMPLOYEE") => seccionesPara(rol).map(({ href }) => href);

  it("muestra Usuarios solo al dueño", () => {
    expect(rutas("OWNER")).toContain("/panel/usuarios");
    expect(rutas("EMPLOYEE")).not.toContain("/panel/usuarios");
    expect(rutas()).not.toContain("/panel/usuarios");
  });
});

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
