import { describe, expect, it } from "vitest";
import { formatPrice, formatTime } from "./format";

describe("formatPrice", () => {
  it("muestra centavos como pesos", () => {
    // Intl separa el signo con un espacio especial; se normaliza para comparar.
    expect(formatPrice(250050).replace(/\s/g, " ")).toBe("$ 2.500,50");
  });
});

describe("formatTime", () => {
  it("convierte minutos en hora", () => {
    expect(formatTime(690)).toBe("11:30");
  });

  it("completa con ceros", () => {
    expect(formatTime(5)).toBe("00:05");
  });
});
