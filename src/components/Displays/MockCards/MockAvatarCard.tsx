import { useColors } from "../../../contexts/ColorsContext";
import Topography from "../../../assets/topography.svg";
import Avatar1 from "../../../assets/cesar-rincon-XHVpWcr5grQ-unsplash.jpg";
import Avatar2 from "../../../assets/philip-martin-5aGUyCW_PJw-unsplash-avatar.jpg";
import Avatar3 from "../../../assets/stefan-stefancik-QXevDflbl8A-unsplash-avatar.jpg";

export default function MockAvatarCard() {
  const { colorRows } = useColors();

  const neutral = colorRows.find((r) => r.title === "Neutral")?.colors ?? [];
  const primary = colorRows.find((r) => r.title === "Primary")?.colors ?? [];
  const secondary =
    colorRows.find((r) => r.title === "Secondary")?.colors ?? [];
  const tertiary = colorRows.find((r) => r.title === "Tertiary")?.colors ?? [];

  return (
    <div
      className="relative rounded-xl font-sans border overflow-hidden shadow-md shadow-neutral-100"
      style={{ backgroundColor: primary[0], borderColor: neutral[2] }}
    >
      {/* Topography pattern */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          maskImage: `url(${Topography})`,
          WebkitMaskImage: `url(${Topography})`,
          maskSize: "1000% 1000%",
          WebkitMaskSize: "600% 600%",
          maskPosition: "55% 55%",
          WebkitMaskPosition: "55% 55%",
          backgroundColor: primary[1],
          opacity: 0.8,
        }}
      />
      <div className="z-10 relative">
        <h2
          className="text-4xl lg:text-2xl font-bold lg:p-6 p-6"
          style={{ color: primary[6] }}
        >
          Design With Passion
        </h2>
      </div>
      <div className="z-10 relative w-full min-h-[320px] mx-auto max-w-xs">
        <div
          className="overflow-hidden aspect-square rounded-full absolute w-48 bottom-5/12 left-6/12 -translate-x-6/12 translate-y-6/12 lg:w-64 lg:bottom-0 lg:left-0 lg:-translate-x-10 lg:translate-y-12"
          style={{
            border: `0px solid ${primary[0]}`,
            boxShadow: `0 8px 16px rgba(0,0,0,0.12), 0 0 0 8px ${primary[4]}`,
          }}
        >
          <img src={Avatar2} alt="" className="w-full h-full object-cover" />
        </div>
        <div
          className="overflow-hidden aspect-square rounded-full absolute w-20 bottom-16 right-8 lg:w-32 lg:bottom-30 lg:right-0 lg:translate-x-6 lg:translate-y-6"
          style={{
            border: `3px solid ${secondary[0]}`,
            boxShadow: `0 6px 16px rgba(0,0,0,0.12), 0 0 0 6px ${secondary[4]}`,
          }}
        >
          <img src={Avatar1} alt="" className="w-full h-full object-cover" />
        </div>
        <div
          className="overflow-hidden aspect-square rounded-full absolute w-20 bottom-16 left-8 lg:w-24 lg:bottom-46 lg:left-0 lg:-translate-x-4 lg:translate-y-4"
          style={{
            border: `3px solid ${tertiary[0]}`,
            boxShadow: `0 6px 16px rgba(0,0,0,0.12), 0 0 0 2px ${tertiary[4]}`,
          }}
        >
          <img src={Avatar3} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
