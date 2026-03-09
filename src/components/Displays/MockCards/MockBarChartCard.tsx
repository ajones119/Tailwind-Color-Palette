import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useIntersectionObserver } from "usehooks-ts";
import { useColors } from "../../../contexts/ColorsContext";

const data = [
  { month: "Jan", primary: 42, secondary: 32 },
  { month: "Feb", primary: 68, secondary: 56 },
  { month: "Mar", primary: 55, secondary: 44 },
  { month: "Apr", primary: 91, secondary: 78 },
  { month: "May", primary: 73, secondary: 61 },
  { month: "Jun", primary: 84, secondary: 72 },
];

export default function MockBarChartCard() {
  const { colorRows } = useColors();
  const [chartRef, isInView] = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const neutral = colorRows.find((r) => r.title === "Neutral")?.colors ?? [];
  const primary = colorRows.find((r) => r.title === "Primary")?.colors ?? [];
  const secondary =
    colorRows.find((r) => r.title === "Secondary")?.colors ?? [];

  return (
    <div
      ref={chartRef}
      className="rounded-xl p-6 border"
      style={{ backgroundColor: neutral[0], borderColor: neutral[2] }}
    >
      <div className="mb-1 text-lg font-bold" style={{ color: neutral[9] }}>
        Charts
      </div>
      <div
        className="text-sm leading-relaxed mb-5"
        style={{ color: neutral[6] }}
      >
        Visualize Your Colors
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          key={isInView ? "in-view" : "out-of-view"}
          data={data}
          barCategoryGap="35%"
        >
          <CartesianGrid vertical={false} stroke={neutral[2]} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={false}
            height={0}
          />
          <YAxis width={0} axisLine={false} tickLine={false} tick={false} />
          <Tooltip
            cursor={{ fill: neutral[1] }}
            contentStyle={{
              backgroundColor: neutral[0],
              border: `1px solid ${neutral[2]}`,
              borderRadius: "0.5rem",
              color: neutral[9],
              fontSize: "0.8rem",
            }}
          />
          <Bar
            dataKey="primary"
            fill={primary[5]}
            radius={[4, 4, 0, 0]}
            isAnimationActive={isInView}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="secondary"
            fill={secondary[5]}
            radius={[4, 4, 0, 0]}
            isAnimationActive={isInView}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-2 flex-wrap mt-4 ">
        <div
          className="py-1 px-2 rounded-full text-[8px] leading-tight tracking-wider font-semibold lg:w-full xl:w-auto"
          style={{ backgroundColor: primary[1], color: primary[6] }}
        >
          Gain Insights
        </div>
        <div
          className="py-1 px-2 rounded-full text-[8px] leading-tight tracking-wider font-semibold lg:w-full xl:w-auto"
          style={{ backgroundColor: primary[1], color: primary[6] }}
        >
          See Data
        </div>
        <div
          className="py-1 px-2 rounded-full text-[8px] leading-tight tracking-wider font-semibold lg:w-full xl:w-auto"
          style={{ backgroundColor: primary[1], color: primary[6] }}
        >
          Make Decisions
        </div>
        <div
          className="py-1 px-2 rounded-full text-[8px] leading-tight tracking-wider font-semibold lg:w-full xl:w-auto"
          style={{ backgroundColor: primary[1], color: primary[6] }}
        >
          Achieve Goals
        </div>
      </div>
      <button
        className="w-full mt-4 py-2 rounded-md text-sm font-semibold cursor-pointer"
        style={{ backgroundColor: primary[5], color: neutral[0] }}
      >
        Take Action
      </button>
    </div>
  );
}
