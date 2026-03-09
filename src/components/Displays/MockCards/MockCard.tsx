import { useColors } from "../../../contexts/ColorsContext";
import Topography from "../../../assets/topography.svg";


export default function MockCard() {
  const { colorRows } = useColors();

  const neutral = colorRows.find((r) => r.title === "Neutral")?.colors ?? [];
  const primary = colorRows.find((r) => r.title === "Primary")?.colors ?? [];

  return (
    <div
      className="rounded-xl p-6 font-sans border relative overflow-hidden shadow-md shadow-neutral-200"
      style={{ backgroundColor: neutral[0], borderColor: neutral[2] }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0 hidden"
        style={{
          maskImage: `url(${Topography})`,
          WebkitMaskImage: `url(${Topography})`,
          maskSize: "1000% 1000%",
          WebkitMaskSize: "1000% 1000%",
          maskPosition: "20% 50%",
          WebkitMaskPosition: "50% 50%",
          backgroundColor: neutral[1],
          opacity: 0.8,
        }}
      />
      <div className="relative z-10">
        <span
          className="inline-block text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full mb-3 font-body"
          style={{ backgroundColor: primary[1], color: primary[7] }}
        >
          New
        </span>

        <div
          className="text-lg font-bold mb-1 font-title"
          style={{ color: neutral[9] }}
        >
          See Your Colors
        </div>

        <div
          className="text-sm leading-relaxed mb-5 font-body"
          style={{ color: neutral[6] }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          cursus rutrum interdum. Phasellus sollicitudin feugiat sollicitudin.
        </div>

        <div className="mb-5 border-t" style={{ borderColor: neutral[2] }} />

        <div className="flex flex-col gap-2">
          <button
            className="px-5 py-2 rounded-lg text-sm font-semibold font-body text-white cursor-pointer"
            style={{ backgroundColor: primary[5] }}
          >
            Get started
          </button>

          <button
            className="px-5 py-2 rounded-lg text-sm font-semibold font-body cursor-pointer border bg-transparent"
            style={{ color: primary[6], borderColor: primary[3] }}
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}
