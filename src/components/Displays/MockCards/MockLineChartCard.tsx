import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useColors } from "../../../contexts/ColorsContext";
import { useIntersectionObserver } from "usehooks-ts";

const data = [
  { month: "Jan", primary: 240, tertiary: 120 },
  { month: "Feb", primary: 310, tertiary: 155 },
  { month: "Mar", primary: 280, tertiary: 140 },
  { month: "Apr", primary: 520, tertiary: 260 },
  { month: "May", primary: 490, tertiary: 245 },
  { month: "Jun", primary: 670, tertiary: 335 },
];

export default function MockLineChartCard() {
  const { colorRows } = useColors();
  const [chartRef, isInView] = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true,
  });

  const neutral = colorRows.find((r) => r.title === "Neutral")?.colors ?? [];
  const primary = colorRows.find((r) => r.title === "Primary")?.colors ?? [];
  const tertiary = colorRows.find((r) => r.title === "Tertiary")?.colors ?? [];

  return (
    <div
      ref={chartRef}
      className="rounded-xl p-6 font-sans border"
      style={{ backgroundColor: neutral[0], borderColor: neutral[2] }}
    >
      <div className="mb-1 text-lg font-bold" style={{ color: neutral[9] }}>
        Charts
      </div>
      <div
        className="text-sm leading-relaxed mb-6"
        style={{ color: neutral[6] }}
      >
        Visualize your colors
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} key={isInView ? "in-view" : "out-of-view"}>
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
            cursor={{ stroke: neutral[3] }}
            contentStyle={{
              backgroundColor: neutral[0],
              border: `1px solid ${neutral[2]}`,
              borderRadius: "0.5rem",
              color: neutral[9],
              fontSize: "0.8rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="primary"
            stroke={primary[5]}
            strokeWidth={2}
            dot={{ fill: primary[5], r: 4, strokeWidth: 0 }}
            activeDot={{ fill: primary[4], r: 6, strokeWidth: 0 }}
            isAnimationActive={isInView}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Line
            type="monotone"
            dataKey="tertiary"
            stroke={tertiary[4]}
            strokeWidth={2}
            dot={{ fill: tertiary[4], r: 4, strokeWidth: 0 }}
            activeDot={{ fill: tertiary[3], r: 6, strokeWidth: 0 }}
            isAnimationActive={isInView}
            animationBegin={200}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
