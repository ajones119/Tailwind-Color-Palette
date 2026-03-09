/** Tailwind-style shade keys (11 steps) */
export const SHADE_KEYS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;
export type ShadeKey = (typeof SHADE_KEYS)[number];

/** Default neutral (grey) scale — root at 600 */
export const DEFAULT_NEUTRAL: string[] = [
  "#f7f7f8", // 50
  "#edecef", // 100
  "#d8d6db", // 200
  "#bbbabf", // 300
  "#9d9ca0", // 400
  "#727075", // 500
  "#5d5c60", // 600 — root
  "#48454e", // 700
  "#333239", // 800
  "#222127", // 900
  "#111014", // 950
];

/** Default primary (blue) scale — root at 500 */
export const DEFAULT_PRIMARY: string[] = [
  "#f1f6fe", // 50
  "#deeafd", // 100
  "#b8d2f9", // 200
  "#86b4f3", // 300
  "#5094ec", // 400
  "#186ddc", // 500 — root
  "#1154ac", // 600
  "#0c4488", // 700
  "#083363", // 800
  "#052343", // 900
  "#021222", // 950
];

/** Default secondary (teal) scale — root at 500 */
export const DEFAULT_SECONDARY: string[] = [
  "#f0fdfa", // 50
  "#ccfbf1", // 100
  "#99f6e4", // 200
  "#5eead4", // 300
  "#2dd4bf", // 400
  "#14b8a6", // 500 — root
  "#0d9488", // 600
  "#0f766e", // 700
  "#115e59", // 800
  "#134e4a", // 900
  "#042f2e", // 950
];

/** Default tertiary (orange) scale — root at 500 */
export const DEFAULT_TERTIARY: string[] = [
  "#fef8f0", // 50
  "#fdeddd", // 100
  "#fbd8b7", // 200
  "#f6b983", // 300
  "#f1964c", // 400
  "#ec7513", // 500 — root
  "#b1560c", // 600
  "#8c4108", // 700
  "#662e05", // 800
  "#441d03", // 900
  "#1a0c02", // 950
];
