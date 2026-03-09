## Tailwind Color Palette

Interactive color palette designer for Tailwind CSS v4 and shadcn/ui.

This app lets you:

- **Pick and harmonize 4 core colors**: `Primary`, `Secondary`, `Tertiary`, and `Neutral`
- **Generate full 11-step Tailwind-style scales** for each color (50 → 950)
- **Preview real UI usage** in example cards and charts
- **Export ready-to-paste CSS**:
  - A Tailwind v4 `@theme {}` block with `--color-{row}-{shade}` variables
  - A `:root` block with shadcn/ui variables (background, foreground, muted, primary, etc.)
  - Font variables for title, body, and mono text

---

### Tech stack

- **React + TypeScript + Vite**
- **Tailwind CSS v4 (@theme)** for design tokens
- **shadcn/ui-style CSS tokens** via `:root` variables
- **Recharts** for chart previews
- **Prettier** for code formatting

---

### Getting started

From the `ColorPaletteGenerator` directory:

```bash
npm install      # or pnpm install / yarn
npm run dev      # or pnpm dev / yarn dev
```

Then open the printed localhost URL in your browser.

---

### Using the exported CSS

1. Tune your colors and harmony using the controls on the left.
2. Scroll to the **Export** section at the bottom.
3. Choose your desired format (**Hex / HSL / RGBA**).
4. Click **Copy CSS** and paste into your main stylesheet, for example:

```css
@import "tailwindcss";

/* Paste exported @theme block and :root shadcn variables here */
```

Tailwind will pick up the `@theme {}` variables, and your design system (including shadcn/ui) can consume the `:root` variables.

---

### Fonts

The app exposes three font variables:

```css
--font-title: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
--font-body: "DM Sans", ui-sans-serif, system-ui, sans-serif;
--font-mono: "Fira Code", ui-monospace, monospace;
```

In `src/index.css` the body is wired up with:

```css
:root {
  font-family: var(--font-body);
}
```

The UI uses:

- `font-title` for headings
- `font-body` for body text
- `font-mono` for code / numeric details

---

### shadcn/ui variable mapping

The export includes a `:root` block mapping your live palette into shadcn/ui-style tokens, for example:

- `--background` / `--foreground` → `Neutral` scale (lightest / darkest)
- `--primary` / `--primary-foreground` → `Primary` scale (500 / 50)
- `--secondary`, `--accent`, `--muted`, `--destructive` → `Secondary`, `Tertiary`, and `Neutral` scales
- `--border`, `--input`, `--ring` → `Neutral` / `Primary` scales

So you can wire shadcn/ui to these variables without manual mapping every time.

---

### Formatting with Prettier

Prettier is installed as a dev dependency in the repo.

To format all files from the project root:

```bash
npx prettier . --write
```

The config lives in `.prettierrc` with:

- single quotes
- no semicolons
- trailing commas where valid
- `printWidth` 100

---

### License

MIT
