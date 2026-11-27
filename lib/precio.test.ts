import { describe, expect, it } from "vitest";
import { leerPrecio, precioParaCampo } from "./precio";

describe("leerPrecio", () => {
  it.each([
    ["1500", 150000],
    ["1.500", 150000],
    ["$ 1.500,5", 150050],
    ["0,99", 99],
  ])("lee %s", (texto, centavos) => {
    expect(leerPrecio(texto)).toBe(centavos);
  });

  // "1500.50" es ambiguo en Argentina: se rechaza en vez de adivinar.
  it.each(["", "abc", "0", "-5", "1500.50", "1,234", "99999999"])("rechaza «%s»", (texto) => {
    expect(leerPrecio(texto)).toBeNull();
  });
});

describe("precioParaCampo", () => {
  it("muestra los centavos solo si hay", () => {
    expect(precioParaCampo(150000)).toBe("1500");
    expect(precioParaCampo(150050)).toBe("1500,50");
  });
});
