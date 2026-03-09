import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useIntersectionObserver } from "usehooks-ts";
import { useColors } from "../../../contexts/ColorsContext";

const data = [
  { name: "Primary", value: 35 },
  { name: "Tertiary", value: 28 },
  { name: "Neutral", value: 22 },
  { name: "Other", value: 15 },
];

export default function MockPieChartCard() {
  const { colorRows } = useColors();
  const [chartRef, isInView] = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true,
  });

  const neutral = colorRows.find((r) => r.title === "Neutral")?.colors ?? [];
  const primary = colorRows.find((r) => r.title === "Primary")?.colors ?? [];

  const segmentColors = [primary[3], primary[4], primary[6], primary[8]];

  return (
    <div
      ref={chartRef}
      className="rounded-xl p-6 border"
      style={{ backgroundColor: neutral[0], borderColor: neutral[2] }}
    >
      <div className="mb-1 text-lg font-bold" style={{ color: neutral[9] }}>
        Distribution
      </div>
      <div
        className="text-sm leading-relaxed mb-0 border-b pb-5"
        style={{ color: neutral[6], borderColor: neutral[2] }}
      >
        Pie chart with your palette
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart key={isInView ? "in-view" : "out-of-view"}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={isInView}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={segmentColors[index % segmentColors.length]}
                stroke={neutral[0]}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: neutral[0],
              border: `1px solid ${neutral[2]}`,
              borderRadius: "0.5rem",
              color: neutral[9],
              fontSize: "0.8rem",
            }}
            formatter={(value?: number | string) => [`${value ?? 0}%`, "Share"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
