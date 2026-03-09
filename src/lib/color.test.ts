import { describe, it, expect } from "vitest";
import {
  parseColorToHex,
  getAlphaFromColor,
  colorsEqual,
  getTextColorOnBackground,
  setAlphaOnColor,
  hexToHsl,
  hexToRgb,
  formatColorForTheme,
  hslToHex,
  rgbToHex,
  hexToColorName,
  generateShadesFromBaseColor,
  getHarmonyRootsFromHsl,
  getPrimaryFromSecondaryOrTertiary,
  type Hsl,
} from "./color";

describe("parseColorToHex", () => {
  it("parses hex to normalized hex", () => {
    expect(colorsEqual(parseColorToHex("#ff0000")!, "#ff0000")).toBe(true);
    expect(colorsEqual(parseColorToHex("#abc")!, "#aabbcc")).toBe(true);
  });
  it("parses hex8 when alpha < 1", () => {
    const result = parseColorToHex("rgba(255, 0, 0, 0.5)");
    expect(result).toBeTruthy();
    expect(result!.startsWith("#")).toBe(true);
    expect(result!.length).toBeGreaterThanOrEqual(7);
  });
  it("parses rgb() to hex", () => {
    expect(colorsEqual(parseColorToHex("rgb(255, 0, 0)")!, "#ff0000")).toBe(true);
  });
  it("parses hsl() to hex", () => {
    expect(colorsEqual(parseColorToHex("hsl(0, 100%, 50%)")!, "#ff0000")).toBe(true);
  });
  it("returns null for empty string", () => {
    expect(parseColorToHex("")).toBe(null);
  });
  it("returns null for whitespace-only string", () => {
    expect(parseColorToHex("   ")).toBe(null);
  });
  it("returns null for invalid input", () => {
    expect(parseColorToHex("notacolor")).toBe(null);
  });
  it("trims whitespace from input", () => {
    expect(colorsEqual(parseColorToHex("  #ff0000  ")!, "#ff0000")).toBe(true);
  });
});

describe("getAlphaFromColor", () => {
  it("returns 100 for opaque hex", () => {
    expect(getAlphaFromColor("#ff0000")).toBe(100);
  });
  it("returns correct alpha for hex8", () => {
    const result = getAlphaFromColor("#ff000080");
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(100);
  });
  it("returns 100 for invalid hex", () => {
    expect(getAlphaFromColor("invalid")).toBe(100);
  });
});

describe("colorsEqual", () => {
  it("returns true for equal hex colors", () => {
    expect(colorsEqual("#ff0000", "#ff0000")).toBe(true);
  });
  it("returns true for equivalent color formats", () => {
    expect(colorsEqual("#ff0000", "rgb(255, 0, 0)")).toBe(true);
  });
  it("returns false for different colors", () => {
    expect(colorsEqual("#ff0000", "#00ff00")).toBe(false);
  });
  it("falls back to string comparison for invalid colors", () => {
    expect(colorsEqual("invalid", "invalid")).toBe(true);
    expect(colorsEqual("invalid", "other")).toBe(false);
  });
});

describe("getTextColorOnBackground", () => {
  it("returns black for light backgrounds", () => {
    expect(getTextColorOnBackground("#ffffff")).toBe("#000000");
    expect(getTextColorOnBackground("#f0f0f0")).toBe("#000000");
  });
  it("returns white for dark backgrounds", () => {
    expect(getTextColorOnBackground("#000000")).toBe("#ffffff");
    expect(getTextColorOnBackground("#333333")).toBe("#ffffff");
  });
  it("returns #000000 for invalid input", () => {
    expect(getTextColorOnBackground("invalid")).toBe("#000000");
  });
});

describe("setAlphaOnColor", () => {
  it("returns hex when alpha is 100", () => {
    expect(colorsEqual(setAlphaOnColor("#ff0000", 100), "#ff0000")).toBe(true);
  });
  it("returns hex8 when alpha < 100", () => {
    const result = setAlphaOnColor("#ff0000", 50);
    expect(result).toBeTruthy();
    expect(result.startsWith("#")).toBe(true);
    expect(result).not.toBe("#ff0000");
  });
  it("clamps alpha to 0-100", () => {
    const over = setAlphaOnColor("#ff0000", 150);
    const under = setAlphaOnColor("#ff0000", -10);
    expect(getAlphaFromColor(over)).toBe(100);
    expect(getAlphaFromColor(under)).toBeLessThanOrEqual(100);
  });
  it("returns original hex for invalid input", () => {
    expect(setAlphaOnColor("invalid", 50)).toBe("invalid");
  });
});

describe("hexToHsl", () => {
  it("converts red hex to HSL", () => {
    const result = hexToHsl("#ff0000");
    expect(result).not.toBeNull();
    expect(result!.h).toBeCloseTo(0, 0);
    expect(result!.s).toBeCloseTo(100, 0);
    expect(result!.l).toBeCloseTo(50, 0);
    expect(result!.a).toBe(100);
  });
  it("returns null for invalid hex", () => {
    expect(hexToHsl("invalid")).toBe(null);
  });
});

describe("hexToRgb", () => {
  it("converts red hex to RGB", () => {
    const result = hexToRgb("#ff0000");
    expect(result).toEqual({ r: 255, g: 0, b: 0, a: 100 });
  });
  it("converts green hex to RGB", () => {
    const result = hexToRgb("#00ff00");
    expect(result).toEqual({ r: 0, g: 255, b: 0, a: 100 });
  });
  it("returns null for invalid hex", () => {
    expect(hexToRgb("invalid")).toBe(null);
  });
});

describe("formatColorForTheme", () => {
  it("formats as hex", () => {
    expect(colorsEqual(formatColorForTheme("#ff0000", "hex"), "#ff0000")).toBe(true);
  });
  it("formats as hsl", () => {
    const result = formatColorForTheme("#ff0000", "hsl");
    expect(result).toMatch(/^hsl\(\d+ \d+% \d+%\)$/);
  });
  it("formats as rgba", () => {
    const result = formatColorForTheme("#ff0000", "rgba");
    expect(result).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  });
  it("returns hex on parse error", () => {
    expect(formatColorForTheme("invalid", "hsl")).toBe("invalid");
  });
});

describe("hslToHex", () => {
  it("converts HSL to hex", () => {
    const result = hslToHex(0, 100, 50);
    expect(colorsEqual(result!, "#ff0000")).toBe(true);
  });
  it("round-trips with hexToHsl", () => {
    const hex = "#3b82f6";
    const hsl = hexToHsl(hex);
    expect(hsl).not.toBeNull();
    const back = hslToHex(hsl!.h, hsl!.s, hsl!.l, hsl!.a);
    expect(back).toBe(hex);
  });
  it("handles alpha", () => {
    const result = hslToHex(0, 100, 50, 50);
    expect(result).toBeTruthy();
    expect(result!.startsWith("#")).toBe(true);
  });
});

describe("rgbToHex", () => {
  it("converts RGB to hex", () => {
    expect(colorsEqual(rgbToHex(255, 0, 0)!, "#ff0000")).toBe(true);
    expect(colorsEqual(rgbToHex(0, 255, 0)!, "#00ff00")).toBe(true);
  });
  it("round-trips with hexToRgb", () => {
    const hex = "#8b5cf6";
    const rgb = hexToRgb(hex);
    expect(rgb).not.toBeNull();
    const back = rgbToHex(rgb!.r, rgb!.g, rgb!.b, rgb!.a);
    expect(back).toBe(hex);
  });
});

describe("hexToColorName", () => {
  it("returns a name for known colors", () => {
    const red = hexToColorName("#ff0000");
    expect(red).toBeTruthy();
    expect(typeof red).toBe("string");
    expect(red!.toLowerCase()).toContain("red");
  });
  it("returns null for invalid hex", () => {
    expect(hexToColorName("invalid")).toBe(null);
  });
});

describe("generateShadesFromBaseColor", () => {
  it("returns 11 shades by default", () => {
    const shades = generateShadesFromBaseColor("#3b82f6");
    expect(shades).toHaveLength(11);
  });
  it("returns empty array for numberOfShades <= 0", () => {
    expect(generateShadesFromBaseColor("#ff0000", 0)).toEqual([]);
    expect(generateShadesFromBaseColor("#ff0000", -1)).toEqual([]);
  });
  it("includes base color in output", () => {
    const base = "#3b82f6";
    const shades = generateShadesFromBaseColor(base);
    expect(shades).toContain(base);
  });
  it("returns valid hex strings", () => {
    const shades = generateShadesFromBaseColor("#ff0000");
    const hexRegex = /^#[0-9a-f]{3,8}$/i;
    shades.forEach((s) => expect(s).toMatch(hexRegex));
  });
  it("respects numberOfShades parameter", () => {
    const shades = generateShadesFromBaseColor("#ff0000", 5);
    expect(shades).toHaveLength(5);
  });
});

describe("getHarmonyRootsFromHsl", () => {
  const base: Hsl = { h: 0, s: 100, l: 50 };

  it("analogous: secondary +30, tertiary -30", () => {
    const { secondary, tertiary } = getHarmonyRootsFromHsl(base, "analogous");
    expect(secondary.h).toBe(30);
    expect(tertiary.h).toBe(330);
  });
  it("complementary: secondary +180, tertiary +150", () => {
    const { secondary, tertiary } = getHarmonyRootsFromHsl(base, "complementary");
    expect(secondary.h).toBe(180);
    expect(tertiary.h).toBe(150);
  });
  it("triadic: secondary +120, tertiary +240", () => {
    const { secondary, tertiary } = getHarmonyRootsFromHsl(base, "triadic");
    expect(secondary.h).toBe(120);
    expect(tertiary.h).toBe(240);
  });
  it("square: secondary +90, tertiary +270", () => {
    const { secondary, tertiary } = getHarmonyRootsFromHsl(base, "square");
    expect(secondary.h).toBe(90);
    expect(tertiary.h).toBe(270);
  });
  it("preserves s and l", () => {
    const { secondary, tertiary } = getHarmonyRootsFromHsl(base, "analogous");
    expect(secondary.s).toBe(100);
    expect(secondary.l).toBe(50);
    expect(tertiary.s).toBe(100);
    expect(tertiary.l).toBe(50);
  });
  it("auto returns same hue for secondary and tertiary", () => {
    const { secondary, tertiary } = getHarmonyRootsFromHsl(base, "auto");
    expect(secondary.h).toBe(0);
    expect(tertiary.h).toBe(0);
  });
});

describe("getPrimaryFromSecondaryOrTertiary", () => {
  it("returns null for auto", () => {
    expect(
      getPrimaryFromSecondaryOrTertiary({ h: 30, s: 100, l: 50 }, "auto", "secondary"),
    ).toBe(null);
  });
  it("analogous: reverses secondary (+30 -> -30)", () => {
    const result = getPrimaryFromSecondaryOrTertiary(
      { h: 30, s: 100, l: 50 },
      "analogous",
      "secondary",
    );
    expect(result!.h).toBe(0);
  });
  it("complementary: reverses secondary (+180 -> -180)", () => {
    const result = getPrimaryFromSecondaryOrTertiary(
      { h: 180, s: 100, l: 50 },
      "complementary",
      "secondary",
    );
    expect(result!.h).toBe(0);
  });
  it("preserves s and l", () => {
    const result = getPrimaryFromSecondaryOrTertiary(
      { h: 30, s: 80, l: 60 },
      "analogous",
      "secondary",
    );
    expect(result!.s).toBe(80);
    expect(result!.l).toBe(60);
  });
});
