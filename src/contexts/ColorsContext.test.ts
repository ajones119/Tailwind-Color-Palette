import { describe, it, expect } from "vitest";
import { getShadeColor, type ColorRow } from "./ColorsContext";

describe("getShadeColor", () => {
  const rowWithColors: ColorRow = {
    title: "Primary",
    rootColor: "#3b82f6",
    colors: [
      "#eff6ff",
      "#dbeafe",
      "#bfdbfe",
      "#93c5fd",
      "#60a5fa",
      "#3b82f6",
      "#2563eb",
      "#1d4ed8",
      "#1e40af",
      "#1e3a8a",
      "#172554",
    ],
  };

  it("returns color at valid shade index", () => {
    expect(getShadeColor(rowWithColors, 0)).toBe("#eff6ff");
    expect(getShadeColor(rowWithColors, 5)).toBe("#3b82f6");
    expect(getShadeColor(rowWithColors, 10)).toBe("#172554");
  });

  it("returns fallback for out-of-range index", () => {
    expect(getShadeColor(rowWithColors, 11)).toBe("#000000");
    expect(getShadeColor(rowWithColors, 100)).toBe("#000000");
  });

  it("returns custom fallback when provided", () => {
    expect(getShadeColor(rowWithColors, 11, "#ffffff")).toBe("#ffffff");
  });

  it("returns fallback for empty row", () => {
    const emptyRow: ColorRow = {
      title: "Primary",
      rootColor: "#000000",
      colors: [],
    };
    expect(getShadeColor(emptyRow, 0)).toBe("#000000");
    expect(getShadeColor(emptyRow, 0, "#ff0000")).toBe("#ff0000");
  });
});
