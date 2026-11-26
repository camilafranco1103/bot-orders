import { describe, expect, it } from "vitest";
import { mover } from "./orden";

describe("mover", () => {
  it("sube y baja un elemento", () => {
    expect(mover([1, 2, 3], 2, "arriba")).toEqual([2, 1, 3]);
    expect(mover([1, 2, 3], 2, "abajo")).toEqual([1, 3, 2]);
  });

  it("no cambia nada en los bordes o si no existe", () => {
    expect(mover([1, 2, 3], 1, "arriba")).toEqual([1, 2, 3]);
    expect(mover([1, 2, 3], 3, "abajo")).toEqual([1, 2, 3]);
    expect(mover([1, 2, 3], 9, "arriba")).toEqual([1, 2, 3]);
  });
});
