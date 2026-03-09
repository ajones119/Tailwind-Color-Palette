import Color from "colorjs.io";
import namer from "color-namer";

/**
 * Architecture: We store colors as hex/hex8 strings in context/state. Color.js Color
 * objects are used only for parsing and conversion in the UI. Hex is canonical
 * because it's serializable, shareable, and the rest of the app (palette gen,
 * mock cards) expects it. We use hex8 (#rrggbbaa) when alpha < 1 to preserve opacity.
 */

/**
 * Parse a user-entered color to a normalized hex/hex8 string using Color.js.
 * Returns hex8 (#rrggbbaa) when alpha < 1, otherwise hex (#rrggbb).
 * Supports rgba(), hsla(), hex8, etc.
 */
export function parseColorToHex(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const color = new Color(trimmed);
    const alpha = color.alpha ?? 1;
    return alpha < 1
      ? color.toString({ format: "hex", collapse: false }) +
          Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")
      : color.toString({ format: "hex" });
  } catch {
    return null;
  }
}

/** Get alpha 0–100 from a hex/hex8 string. Defaults to 1 if missing. */
export function getAlphaFromColor(hex: string): number {
  try {
    const c = new Color(hex);
    return (c.alpha ?? 1) * 100;
  } catch {
    return 100;
  }
}

/** Compare two color strings (hex or hex8) for equality. */
export function colorsEqual(a: string, b: string): boolean {
  try {
    const c1 = new Color(a);
    const c2 = new Color(b);
    return c1.equals(c2);
  } catch {
    return a === b;
  }
}

/**
 * Pick black or white for readable text on the given background using WCAG 21 contrast.
 * Returns whichever foreground has the higher contrast ratio.
 */
export function getTextColorOnBackground(
  background: string,
): "#000000" | "#ffffff" {
  try {
    const bg = new Color(background);
    const black = new Color("#000000");
    const white = new Color("#ffffff");
    const contrastBlack = bg.contrastWCAG21(black);
    const contrastWhite = bg.contrastWCAG21(white);
    return contrastWhite > contrastBlack ? "#ffffff" : "#000000";
  } catch {
    return "#000000";
  }
}

/** Set alpha on a color string. alpha 0–100. Returns hex8 when alpha < 100, hex otherwise. */
export function setAlphaOnColor(hex: string, alphaPercent: number): string {
  try {
    const c = new Color(hex);
    c.alpha = Math.max(0, Math.min(1, alphaPercent / 100));
    return c.alpha < 1
      ? c.toString({ format: "hex", collapse: false }) +
          Math.round(c.alpha * 255)
            .toString(16)
            .padStart(2, "0")
      : c.toString({ format: "hex" });
  } catch {
    return hex;
  }
}

/** HSL values: h 0–360, s 0–100, l 0–100, a 0–100. Color.js stores s/l as 0–100. */
export function hexToHsl(
  hex: string,
): { h: number; s: number; l: number; a: number } | null {
  try {
    const c = new Color(hex);
    const hsl = c.to("hsl");
    return {
      h: hsl.get("h") ?? 0,
      s: hsl.get("s") ?? 0,
      l: hsl.get("l") ?? 0,
      a: (c.alpha ?? 1) * 100,
    };
  } catch {
    return null;
  }
}

/** RGB values: r, g, b each 0–255, a 0–100 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number; a: number } | null {
  try {
    const c = new Color(hex);
    const srgb = c.to("srgb");
    return {
      r: Math.round((srgb.get("r") ?? 0) * 255),
      g: Math.round((srgb.get("g") ?? 0) * 255),
      b: Math.round((srgb.get("b") ?? 0) * 255),
      a: (c.alpha ?? 1) * 100,
    };
  } catch {
    return null;
  }
}

export type ThemeExportFormat = "hex" | "hsl" | "rgba";

/**
 * Format a color (hex/hex8) as a CSS value for Tailwind @theme.
 * Returns the raw hex/hsl/rgba string; falls back to hex on parse error.
 */
export function formatColorForTheme(
  hex: string,
  format: ThemeExportFormat,
): string {
  try {
    const c = new Color(hex);
    if (format === "hex") {
      const alpha = c.alpha ?? 1;
      return alpha < 1
        ? c.toString({ format: "hex", collapse: false }) +
            Math.round(alpha * 255)
              .toString(16)
              .padStart(2, "0")
        : c.toString({ format: "hex" });
    }
    if (format === "hsl") {
      const hsl = hexToHsl(hex);
      if (!hsl) return hex;
      const { h, s, l, a } = hsl;
      return a < 100
        ? `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}% / ${(a / 100).toFixed(2)})`
        : `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
    }
    if (format === "rgba") {
      const rgb = hexToRgb(hex);
      if (!rgb) return hex;
      const { r, g, b, a } = rgb;
      return a < 100
        ? `rgba(${r}, ${g}, ${b}, ${(a / 100).toFixed(2)})`
        : `rgb(${r}, ${g}, ${b})`;
    }
  } catch {
    // fallback
  }
  return hex;
}

/** Build hex/hex8 from HSL. h 0–360, s 0–100, l 0–100, a 0–100 (optional, default 100) */
export function hslToHex(
  h: number,
  s: number,
  l: number,
  a: number = 100,
): string | null {
  try {
    const alpha = Math.max(0, Math.min(1, a / 100));
    const c = new Color("hsl", [h, s, l], alpha);
    return alpha < 1
      ? c.toString({ format: "hex", collapse: false }) +
          Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")
      : c.toString({ format: "hex" });
  } catch {
    return null;
  }
}

/** Build hex/hex8 from RGB. r, g, b each 0–255, a 0–100 (optional, default 100) */
export function rgbToHex(
  r: number,
  g: number,
  b: number,
  a: number = 100,
): string | null {
  try {
    const alpha = Math.max(0, Math.min(1, a / 100));
    const c = new Color("srgb", [r / 255, g / 255, b / 255], alpha);
    return alpha < 1
      ? c.toString({ format: "hex", collapse: false }) +
          Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")
      : c.toString({ format: "hex" });
  } catch {
    return null;
  }
}

/**
 * Get the closest named color for a hex value using perceptual distance.
 * Uses the HTML/CSS color list (~140 names). Returns null if lookup fails.
 */
export function hexToColorName(hex: string): string | null {
  try {
    const names = namer(hex, { pick: ["ntc"] });
    const closest = names.ntc?.[0];
    return closest ? closest.name : null;
  } catch {
    return null;
  }
}

/**
 * Per-slot adjustments applied on top of the base H/S to simulate
 * how hand-crafted palettes shift hue and saturation at the extremes.
 *
 * - deltaH: hue shift in degrees. Positive = warmer (toward yellow), negative = cooler.
 *   Light shades drift slightly warm (+4°), dark shades drift slightly cool (−4°).
 *   Mid shades stay true to the base hue.
 *
 * - deltaS: saturation shift as a percentage. Light shades get a small boost
 *   (+8%) so they don't look washed out. Dark shades hold or slightly increase
 *   saturation so they stay rich and vivid rather than going muddy. Mid shades
 *   are unchanged.
 *
 * - targetL: the target HSL lightness (0–100). Runs from near-white (97) to
 *   near-black (8) across the 11 Tailwind steps (50, 100, 200, … 950).
 */
const SHADE_ADJUSTMENTS = [
  // index  step   targetL  deltaH  deltaS
  { targetL: 97, deltaH: 4, deltaS: 8 }, // 50  — lightest, warm + saturation boost
  { targetL: 93, deltaH: 3, deltaS: 6 }, // 100
  { targetL: 85, deltaH: 2, deltaS: 4 }, // 200
  { targetL: 74, deltaH: 1, deltaS: 2 }, // 300
  { targetL: 62, deltaH: 0, deltaS: 0 }, // 400 — transitioning to base
  { targetL: 45, deltaH: 0, deltaS: 0 }, // 500 — mid (steeper drop from 400)
  { targetL: 37, deltaH: 0, deltaS: 2 }, // 600
  { targetL: 29, deltaH: -1, deltaS: 4 }, // 700 — hold richness, slight cool shift
  { targetL: 21, deltaH: -2, deltaS: 5 }, // 800
  { targetL: 14, deltaH: -3, deltaS: 6 }, // 900
  { targetL: 7, deltaH: -4, deltaS: 8 }, // 950 — darkest, cool but still vivid
];

/**
 * Generate an N-step palette from a base color using HSL with per-slot
 * hue and saturation adjustments to mimic hand-crafted palettes.
 *
 * How it works:
 * 1. Convert the base color to HSL (Hue, Saturation, Lightness).
 *    - Hue = the "color" angle (0° red → 120° green → 240° blue → 360° red)
 *    - Saturation = how vivid vs grey (0% = grey, 100% = fully vivid)
 *    - Lightness = how light or dark (0% = black, 100% = white)
 *
 * 2. For each shade slot, apply its target lightness and a small
 *    per-slot hue/saturation nudge (see SHADE_ADJUSTMENTS).
 *    This makes the light end feel naturally warm and airy, and the
 *    dark end feel deep and cool — matching how designers hand-craft these.
 *
 * 3. The base color's actual lightness determines which slot it falls into.
 *    We find the closest target L and overwrite that slot with the exact base
 *    color, so a light base sits near index 1–2 and a dark base near index 8–9.
 */
export function generateShadesFromBaseColor(
  baseColor: string,
  numberOfShades: number = 11,
): string[] {
  if (numberOfShades <= 0) return [];

  const base = new Color(baseColor);
  const baseAlpha = base.alpha ?? 1;

  // Convert to HSL to extract the base hue, saturation, and lightness.
  const hsl = base.to("hsl");
  const hue = hsl.get("h") || 0; // 0–360 degrees, falls back to 0 for achromatic greys
  const saturation = hsl.get("s") || 0; // 0–100%
  const baseLightness = hsl.get("l"); // 0–100%, used to pick which slot the base belongs in

  const adjustments = SHADE_ADJUSTMENTS.slice(0, numberOfShades);

  const toHex = (c: Color) =>
    baseAlpha < 1
      ? c.toString({ format: "hex", collapse: false }) +
        Math.round(baseAlpha * 255)
          .toString(16)
          .padStart(2, "0")
      : c.toString({ format: "hex" });

  // Build each shade by applying target lightness + hue and saturation nudges.
  const shades = adjustments.map(({ targetL, deltaH, deltaS }) => {
    const adjustedH = (hue + deltaH + 360) % 360; // wrap hue to stay in 0–360
    const adjustedS = Math.max(0, Math.min(100, saturation + deltaS)); // clamp S to 0–100
    const shade = new Color("hsl", [adjustedH, adjustedS, targetL], baseAlpha);
    return toHex(shade);
  });

  // Find the slot whose target lightness is closest to the base's actual lightness
  // and overwrite it with the exact base hex so the user's chosen color appears
  // naturally in the scale without distortion.
  let bestIndex = 0;
  let bestDiff = Math.abs(baseLightness - adjustments[0].targetL);

  for (let i = 1; i < shades.length; i++) {
    const diff = Math.abs(baseLightness - adjustments[i].targetL);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i;
    }
  }

  shades[bestIndex] = toHex(base);

  return shades;
}

export type Hsl = {
  h: number;
  s: number;
  l: number;
};

export type HarmonyMethod =
  | "auto"
  | "analogous"
  | "complementary"
  | "triadic"
  | "square"
  | "rectangle"
  | "split-complementary"
  | "split-triadic"
  | "tetradic";

export function getHarmonyRootsFromHsl(
  hsl: Hsl,
  method: HarmonyMethod,
): { secondary: Hsl; tertiary: Hsl } {
  const { h, s, l } = hsl;
  const mod = (x: number) => ((x % 360) + 360) % 360;
  let secondaryH: number = h;
  let tertiaryH: number = h;
  switch (method) {
    case "analogous":
      secondaryH = mod(h + 30);
      tertiaryH = mod(h - 30);
      break;
    case "complementary":
      secondaryH = mod(h + 180);
      tertiaryH = mod(h + 150);
      break;
    case "triadic":
      secondaryH = mod(h + 120);
      tertiaryH = mod(h + 240);
      break;
    case "square":
      secondaryH = mod(h + 90);
      tertiaryH = mod(h + 270);
      break;
    case "rectangle":
      secondaryH = mod(h + 60);
      tertiaryH = mod(h + 180);
      break;
    case "split-complementary":
      secondaryH = mod(h + 150);
      tertiaryH = mod(h + 210);
      break;
    case "split-triadic":
      secondaryH = mod(h + 120);
      tertiaryH = mod(h + 240);
      break;
    case "tetradic":
      secondaryH = mod(h + 90);
      tertiaryH = mod(h + 270);
      break;
    default:
      break;
  }
  return {
    secondary: { h: secondaryH, s, l },
    tertiary: { h: tertiaryH, s, l },
  };
}

/**
 * Derive Primary from a changed Secondary or Tertiary when harmony is on.
 * Returns the Primary HSL that would produce the given source color, or null for 'auto'.
 */
export function getPrimaryFromSecondaryOrTertiary(
  hsl: Hsl,
  method: HarmonyMethod,
  source: "secondary" | "tertiary",
): Hsl | null {
  if (method === "auto") return null;
  const mod = (x: number) => ((x % 360) + 360) % 360;
  const { h, s, l } = hsl;
  let primaryH: number;
  switch (method) {
    case "analogous":
      primaryH = source === "secondary" ? mod(h - 30) : mod(h + 30);
      break;
    case "complementary":
      primaryH = source === "secondary" ? mod(h - 180) : mod(h - 150);
      break;
    case "triadic":
    case "split-triadic":
      primaryH = source === "secondary" ? mod(h - 120) : mod(h - 240);
      break;
    case "square":
    case "tetradic":
      primaryH = source === "secondary" ? mod(h - 90) : mod(h - 270);
      break;
    case "rectangle":
      primaryH = source === "secondary" ? mod(h - 60) : mod(h - 180);
      break;
    case "split-complementary":
      primaryH = source === "secondary" ? mod(h - 150) : mod(h - 210);
      break;
    default:
      return null;
  }
  return { h: primaryH, s, l };
}
