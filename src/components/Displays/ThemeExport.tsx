import { useState, useCallback } from "react";
import { useColors } from "../../contexts/ColorsContext";
import { SHADE_KEYS } from "../../constants/palette";
import { formatColorForTheme, type ThemeExportFormat } from "../../lib/color";

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
 * Builds a shadcn/ui :root CSS variables block from the 4 color rows.
 * Maps palette shades to the standard shadcn variable names.
 */
function buildShadcnCSS(
  colorRows: { title: string; colors: string[] }[],
  format: ThemeExportFormat,
): string {
  const get = (title: string, index: number): string => {
    const row = colorRows.find((r) => r.title === title);
    const hex = row?.colors[index] ?? "#000000";
    return formatColorForTheme(hex, format);
  };

  // Index reference: 0=50, 1=100, 2=200, 3=300, 4=400, 5=500,
  //                  6=600, 7=700, 8=800, 9=900, 10=950
  const vars: [string, string][] = [
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
  ];

  const lines: string[] = ["/* shadcn/ui variables */", ":root {"];
  for (const [name, value] of vars) {
    lines.push(`  ${name}: ${value};`);
  }
  lines.push("}");
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
