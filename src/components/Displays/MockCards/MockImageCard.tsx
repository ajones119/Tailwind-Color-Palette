import { useColors } from "../../../contexts/ColorsContext";
import BackgroundSVG from "../../../assets/morphing-diamonds.svg";

export default function MockImageCard() {
  const { colorRows } = useColors();

  const neutral = colorRows.find((r) => r.title === "Neutral")?.colors ?? [];
  const primary = colorRows.find((r) => r.title === "Primary")?.colors ?? [];
  const tertiary = colorRows.find((r) => r.title === "Tertiary")?.colors ?? [];

  return (
    <div
      className="rounded-xl overflow-hidden border font-sans shadow-md shadow-neutral-200"
      style={{ backgroundColor: neutral[0], borderColor: neutral[2] }}
    >
      {/* Image placeholder */}
      <div
        className="w-full h-40 flex items-center justify-center text-sm font-medium"
        style={{
          backgroundImage: `url(${BackgroundSVG})`,
          backgroundSize: "40px 40px",
          backgroundPosition: "center",
          backgroundColor: primary[4],
        }}
      />
      <div className="px-6 py-3">
        {/* Tag */}
        <span
          className="inline-block text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full mb-2"
          style={{ backgroundColor: tertiary[1], color: tertiary[7] }}
        >
          Featured
        </span>

        <div className="mb-1 text-lg font-bold" style={{ color: neutral[9] }}>
          Design systems at scale
        </div>
        <div
          className="text-sm leading-relaxed mb-4"
          style={{ color: neutral[6] }}
        >
          How consistent color palettes help teams ship faster and maintain
          brand cohesion.
        </div>

        {/* Content */}
        <div>
          {/* Author row */}
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full shrink-0"
              style={{ backgroundColor: primary[3] }}
            />
            <span className="text-xs font-medium" style={{ color: neutral[7] }}>
              Alex Kim · 4 min read
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
