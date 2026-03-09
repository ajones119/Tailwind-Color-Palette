import MockCard from "./MockCards/MockCard";
import MockBarChartCard from "./MockCards/MockBarChartCard";
import MockLineChartCard from "./MockCards/MockLineChartCard";
import MockPieChartCard from "./MockCards/MockPieChartCard";
import MockImageCard from "./MockCards/MockImageCard";
import MockAvatarCard from "./MockCards/MockAvatarCard";
import MockHeroCard from "./MockCards/MockHeroCard";

export default function CardExamplesSection() {
  return (
    <section className="mx-4" aria-labelledby="card-examples-heading">
      <h2
        id="card-examples-heading"
        className="text-2xl font-bold font-title mb-8"
      >
        Card Examples
      </h2>
      <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-4 gap-4 transition-colors duration-100">
        <MockAvatarCard />
        <MockCard />
        <MockBarChartCard />
        <MockImageCard />
        <MockPieChartCard />
        <MockLineChartCard />
        <MockHeroCard />
      </div>
    </section>
  );
}

