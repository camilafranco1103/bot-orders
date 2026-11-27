import { describe, expect, it } from "vitest";
import { filtrarProductos, hrefCarta, leerFiltros } from "./filtros-carta";

const ficha = { ingredients: "x", allergens: "x", crossContamination: "x" };
const productos = [
  { ...ficha, name: "Jamón y queso", categoryId: 1, available: false },
  { ...ficha, name: "Carne", categoryId: 1, available: true, allergens: null },
  { ...ficha, name: "Tarta de verdura", categoryId: 2, available: true },
];
const nombres = (parametros: object) =>
  filtrarProductos(productos, leerFiltros(parametros)).map((p) => p.name);

describe("filtrarProductos", () => {
  it("sin filtros devuelve todo", () => {
    expect(nombres({})).toHaveLength(3);
  });

  it("busca sin importar tildes ni mayúsculas", () => {
    expect(nombres({ q: "JAMON" })).toEqual(["Jamón y queso"]);
  });

  it("combina categoría y estado", () => {
    expect(nombres({ categoria: "1", estado: "sin-stock" })).toEqual(["Jamón y queso"]);
    expect(nombres({ estado: "faltan-datos" })).toEqual(["Carne"]);
  });

  it("ignora valores inválidos de la dirección", () => {
    expect(nombres({ categoria: "abc", estado: "otro", q: ["a", "b"] })).toHaveLength(3);
  });
});

describe("hrefCarta", () => {
  it("incluye solo los filtros activos", () => {
    expect(hrefCarta({ q: "" })).toBe("/panel/carta");
    expect(hrefCarta({ q: "jamón y", categoria: 2 })).toBe(
      "/panel/carta?q=jam%C3%B3n+y&categoria=2",
    );
  });
});
