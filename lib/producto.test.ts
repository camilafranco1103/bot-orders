import { describe, expect, it } from "vitest";
import { datosFaltantes } from "./producto";

const completa = {
  ingredients: "Harina de arroz, carne",
  allergens: "Huevo",
  crossContamination: "Cocina libre de gluten",
};

describe("datosFaltantes", () => {
  it("devuelve una lista vacía si la ficha está completa", () => {
    expect(datosFaltantes(completa)).toEqual([]);
  });

  it("nombra cada dato sin completar", () => {
    expect(datosFaltantes({ ...completa, allergens: null, crossContamination: null })).toEqual([
      "alérgenos",
      "contaminación cruzada",
    ]);
  });

  it("un texto con solo espacios cuenta como vacío", () => {
    expect(datosFaltantes({ ...completa, ingredients: "   " })).toEqual(["ingredientes"]);
  });
});
