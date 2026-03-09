import { useColors } from "../../../contexts/ColorsContext";
import BirdImage from "../../../assets/dl314-lin-GOkl6DWghZw-unsplash (Small).jpg"

export default function MockHeroCard() {
  const { colorRows } = useColors();

  const neutral = colorRows.find((r) => r.title === "Neutral")?.colors ?? [];
  const primary = colorRows.find((r) => r.title === "Primary")?.colors ?? [];
  const tertiary = colorRows.find((r) => r.title === "Tertiary")?.colors ?? [];

  return (
    <div
      className="rounded-xl p-6 font-sans border col-span-2 flex flex-col md:flex-row gap-8 items-center shadow-md shadow-neutral-600"
      style={{ backgroundColor: primary[9], borderColor: primary[8] }}
    >
      <div className="flex-1 space-y-4">
        <span
          className="inline-block text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full"
          style={{ backgroundColor: tertiary[5], color: neutral[0] }}
        >
          Featured
        </span>

        <div
          className="text-2xl font-bold leading-snug"
          style={{ color: neutral[0] }}
        >
          Build beautiful UIs from a single color
        </div>

        <div className="text-sm leading-relaxed" style={{ color: primary[3] }}>
          Generate a site ready Tailwind color palette from a single color
        </div>

        <div className="flex gap-3 pt-2">
          <button
            className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer"
            style={{ backgroundColor: tertiary[5], color: neutral[0] }}
          >
            Tertiary
          </button>
          <button
            className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer border bg-transparent"
            style={{ color: primary[2], borderColor: primary[7] }}
          >
            Primary Border
          </button>
        </div>
      </div>

      <div
        className="md:w-52 md:h-40 w-full h-32 rounded-lg shrink-0 flex items-center justify-center"
        style={{ backgroundColor: primary[8] }}
      >
        <img src={BirdImage} alt="Bird" className="w-full h-full object-cover rounded-lg" />
      </div>
    </div>
  );
}
