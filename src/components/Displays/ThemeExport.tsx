import { useState, useCallback } from "react";
import { useColors } from "../../contexts/ColorsContext";
import { SHADE_KEYS } from "../../constants/palette";
import {
  formatColorForTheme,
  setAlphaOnColor,
  type ThemeExportFormat,
} from "../../lib/color";

const FONTS = [
  {
    var: "--font-title",
    value: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  },
  {
    var: "--font-body",
    value: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  },
  { var: "--font-mono", value: '"Fira Code", ui-monospace, monospace' },
];

/**
 * Builds Tailwind v4 @theme CSS block from current color rows.
 * Includes font variables followed by color scales.
 * Format: --color-{rowName}-{shade}: value;
 */
function buildTailwindV4ThemeCSS(
  colorRows: { title: string; colors: string[] }[],
  format: ThemeExportFormat,
): string {
  const lines: string[] = ["@theme {"];
  // Fonts
  lines.push("  /* Fonts */");
  for (const font of FONTS) {
    lines.push(`  ${font.var}: ${font.value};`);
  }
  lines.push("");
  // Color scales
  for (const row of colorRows) {
    const name = row.title.toLowerCase();
    lines.push(`  /* ${row.title} */`);
    row.colors.forEach((hex, i) => {
      const shade = SHADE_KEYS[i];
      if (shade !== undefined) {
        const value = formatColorForTheme(hex, format);
        lines.push(`  --color-${name}-${shade}: ${value};`);
      }
    });
    lines.push("");
  }

  lines.push("}");
  return lines.join("\n");
}

/**
 * Builds a shadcn/ui :root and .dark CSS variables block from the 4 color rows.
 * Maps palette shades to the standard shadcn variable names.
 */
function buildShadcnCSS(
  colorRows: { title: string; colors: string[] }[],
  format: ThemeExportFormat,
): string {
  const getRaw = (title: string, index: number): string => {
    const row = colorRows.find((r) => r.title === title);
    return row?.colors[index] ?? "#000000";
  };
  const get = (title: string, index: number): string =>
    formatColorForTheme(getRaw(title, index), format);
  const getWithAlpha = (title: string, index: number, alphaPercent: number) =>
    formatColorForTheme(setAlphaOnColor(getRaw(title, index), alphaPercent), format);

  // Index reference: 0=50, 1=100, 2=200, 3=300, 4=400, 5=500,
  //                  6=600, 7=700, 8=800, 9=900, 10=950
  const lightVars: [string, string][] = [
    ["--background", get("Neutral", 0)],
    ["--foreground", get("Neutral", 10)],
    ["--card", get("Neutral", 0)],
    ["--card-foreground", get("Neutral", 10)],
    ["--popover", get("Neutral", 0)],
    ["--popover-foreground", get("Neutral", 10)],
    ["--primary", get("Primary", 5)],
    ["--primary-foreground", get("Primary", 0)],
    ["--secondary", get("Secondary", 1)],
    ["--secondary-foreground", get("Secondary", 9)],
    ["--muted", get("Neutral", 1)],
    ["--muted-foreground", get("Neutral", 5)],
    ["--accent", get("Tertiary", 1)],
    ["--accent-foreground", get("Tertiary", 9)],
    ["--destructive", get("Tertiary", 5)],
    ["--destructive-foreground", get("Tertiary", 0)],
    ["--border", get("Neutral", 2)],
    ["--input", get("Neutral", 2)],
    ["--ring", get("Primary", 5)],
    ["--chart-1", get("Primary", 0)],
    ["--chart-2", get("Primary", 2)],
    ["--chart-3", get("Primary", 4)],
    ["--chart-4", get("Primary", 6)],
    ["--chart-5", get("Primary", 9)],
    ["--radius", "0.625rem"],
    ["--sidebar", get("Neutral", 0)],
    ["--sidebar-foreground", get("Neutral", 10)],
    ["--sidebar-primary", get("Primary", 5)],
    ["--sidebar-primary-foreground", get("Primary", 0)],
    ["--sidebar-accent", get("Neutral", 1)],
    ["--sidebar-accent-foreground", get("Neutral", 10)],
    ["--sidebar-border", get("Neutral", 2)],
    ["--sidebar-ring", get("Primary", 5)],
  ];

  // Dark mode: inverted roles, light text on dark bg, subtle borders via alpha
  const darkVars: [string, string][] = [
    ["--background", get("Neutral", 10)],
    ["--foreground", get("Neutral", 0)],
    ["--card", get("Neutral", 9)],
    ["--card-foreground", get("Neutral", 0)],
    ["--popover", get("Neutral", 9)],
    ["--popover-foreground", get("Neutral", 0)],
    ["--primary", get("Neutral", 0)],
    ["--primary-foreground", get("Neutral", 10)],
    ["--secondary", get("Neutral", 8)],
    ["--secondary-foreground", get("Neutral", 0)],
    ["--muted", get("Neutral", 8)],
    ["--muted-foreground", get("Neutral", 5)],
    ["--accent", get("Neutral", 7)],
    ["--accent-foreground", get("Neutral", 0)],
    ["--destructive", get("Tertiary", 5)],
    ["--destructive-foreground", get("Tertiary", 0)],
    ["--border", getWithAlpha("Neutral", 0, 10)],
    ["--input", getWithAlpha("Neutral", 0, 15)],
    ["--ring", get("Neutral", 9)],
    ["--chart-1", get("Primary", 0)],
    ["--chart-2", get("Primary", 2)],
    ["--chart-3", get("Primary", 4)],
    ["--chart-4", get("Primary", 6)],
    ["--chart-5", get("Primary", 9)],
    ["--radius", "0.625rem"],
    ["--sidebar", get("Neutral", 9)],
    ["--sidebar-foreground", get("Neutral", 0)],
    ["--sidebar-primary", get("Primary", 4)],
    ["--sidebar-primary-foreground", get("Neutral", 0)],
    ["--sidebar-accent", get("Neutral", 8)],
    ["--sidebar-accent-foreground", get("Neutral", 0)],
    ["--sidebar-border", getWithAlpha("Neutral", 0, 10)],
    ["--sidebar-ring", get("Neutral", 9)],
  ];

  const lines: string[] = [
    "/* shadcn/ui variables */",
    ":root {",
    ...lightVars.map(([name, value]) => `  ${name}: ${value};`),
    "}",
    "",
    ".dark {",
    ...darkVars.map(([name, value]) => `  ${name}: ${value};`),
    "}",
  ];
  return lines.join("\n");
}

const FORMAT_OPTIONS: { value: ThemeExportFormat; label: string }[] = [
  { value: "hex", label: "Hex" },
  { value: "hsl", label: "HSL" },
  { value: "rgba", label: "RGBA" },
];

export default function ThemeExport() {
  const { colorRows } = useColors();
  const [format, setFormat] = useState<ThemeExportFormat>("hex");
  const [copied, setCopied] = useState(false);

  const tailwindCSS = buildTailwindV4ThemeCSS(colorRows, format);
  const shadcnCSS = buildShadcnCSS(colorRows, format);
  const css = `${tailwindCSS}\n\n${shadcnCSS}`;

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [css]);

  return (
    <section
      className="rounded-xl border overflow-hidden"
      aria-labelledby="theme-export-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b bg-neutral-100 border-neutral-300">
        <h2
          id="theme-export-heading"
          className="text-base sm:text-lg font-bold text-neutral-800 min-w-0 truncate"
        >
          Tailwind v4 theme
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-neutral-600">Format:</span>
          <div className="flex rounded-lg border border-neutral-400 overflow-hidden bg-white">
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormat(opt.value)}
                className={`px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-inset ${
                  format === opt.value
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={copyToClipboard}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1"
          >
            {copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
      </div>
      <pre className="p-4 text-xs sm:text-sm overflow-x-auto bg-neutral-900 text-neutral-100 font-mono leading-relaxed">
        <code>{css}</code>
      </pre>
    </section>
  );
}
