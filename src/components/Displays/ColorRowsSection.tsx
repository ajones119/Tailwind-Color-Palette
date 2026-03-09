import { useColors } from "../../contexts/ColorsContext";
import ColorRow from "./ColorRow";

export default function ColorRowsSection() {
  const { colorRows } = useColors();

  return (
    <section
      className="my-2 space-y-4 xl:max-w-5xl"
      aria-labelledby="color-rows-heading"
    >
      <h2
        id="color-rows-heading"
        className="text-2xl font-bold font-title mb-8 sr-only"
      >
        Color Rows
      </h2>
      <div className="space-y-8 lg:space-y-3">
        {colorRows.map((colorRow) => (
          <ColorRow key={colorRow.title} title={colorRow.title} />
        ))}
      </div>
    </section>
  );
}
