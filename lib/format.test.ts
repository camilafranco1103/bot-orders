import { describe, expect, it } from "vitest";
import { formatTime } from "./format";

describe("formatTime", () => {
  it("convierte minutos en hora", () => {
    expect(formatTime(690)).toBe("11:30");
  });

  it("completa con ceros", () => {
    expect(formatTime(5)).toBe("00:05");
  });
});
