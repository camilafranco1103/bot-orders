import { describe, expect, it } from "vitest";
import { puede } from "./permisos";

describe("puede", () => {
  it("el dueño puede todo", () => {
    for (const permiso of [
      "gestionarUsuarios",
      "cambiarPrecios",
      "altaYBajaProductos",
      "altaYBajaCategorias",
      "editarFichas",
      "cambiarStock",
      "gestionarPedidos",
    ] as const) {
      expect(puede("OWNER", permiso)).toBe(true);
    }
  });

  it("el empleado edita fichas, stock y pedidos", () => {
    expect(puede("EMPLOYEE", "editarFichas")).toBe(true);
    expect(puede("EMPLOYEE", "cambiarStock")).toBe(true);
    expect(puede("EMPLOYEE", "gestionarPedidos")).toBe(true);
  });

  it("el empleado no toca usuarios, precios ni altas y bajas", () => {
    expect(puede("EMPLOYEE", "gestionarUsuarios")).toBe(false);
    expect(puede("EMPLOYEE", "cambiarPrecios")).toBe(false);
    expect(puede("EMPLOYEE", "altaYBajaProductos")).toBe(false);
    expect(puede("EMPLOYEE", "altaYBajaCategorias")).toBe(false);
  });
});
