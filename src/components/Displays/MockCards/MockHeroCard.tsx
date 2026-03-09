import { useColors } from "../../../contexts/ColorsContext";

export default function MockHeroCard() {
  const { colorRows } = useColors();

  const neutral = colorRows.find((r) => r.title === "Neutral")?.colors ?? [];
  const primary = colorRows.find((r) => r.title === "Primary")?.colors ?? [];
  const tertiary = colorRows.find((r) => r.title === "Tertiary")?.colors ?? [];

  return (
    <div
      className="rounded-xl p-8 font-sans border col-span-2 flex gap-8 items-center"
      style={{ backgroundColor: primary[9], borderColor: primary[8] }}
    >
      {/* Text side */}
      <div className="flex-1 space-y-4">
        <span
          className="inline-block text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full"
          style={{ backgroundColor: tertiary[5], color: neutral[0] }}
        >
          Now in beta
        </span>

        <div
          className="text-2xl font-bold leading-snug"
          style={{ color: neutral[0] }}
        >
          Build beautiful UIs from a single color
        </div>

        <div className="text-sm leading-relaxed" style={{ color: primary[3] }}>
          Paste in any hex or color name and instantly generate a complete
          11-step palette ready to drop into Tailwind, CSS variables, or Figma.
        </div>

        <div className="flex gap-3 pt-2">
          <button
            className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer"
            style={{ backgroundColor: tertiary[5], color: neutral[0] }}
          >
            Get started free
          </button>
          <button
            className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer border bg-transparent"
            style={{ color: primary[2], borderColor: primary[7] }}
          >
            See the docs
          </button>
        </div>
      </div>

      {/* Image placeholder side */}
      <div
        className="w-52 h-40 rounded-lg shrink-0 flex items-center justify-center"
        style={{ backgroundColor: primary[8] }}
      >
        <svg
          className="w-10 h-10 opacity-30"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: primary[3] }}
        >
          <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" />
        </svg>
      </div>
    </div>
  );
}
