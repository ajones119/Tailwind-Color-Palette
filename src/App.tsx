import RootColors from "./components/Controls/RootColors";
import ColorRowsSection from "./components/Displays/ColorRowsSection";
import CardExamplesSection from "./components/Displays/CardExamplesSection";
import ThemeExport from "./components/Displays/ThemeExport";
import { BaseColorDisplay } from "./components/Displays/BaseColorDisplay";

function App() {
  return (
    <div className="p-4 md:p-16 font-body">
      <div className="mt-8">
        <h1 className="text-4xl font-bold font-title">
          Tailwind Color Palette
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] mt-12 lg:mt-0">
        <div className="lg:my-24 mx-4">
          <div className="lg:sticky lg:top-8 pb-8 lg:p-4 lg:pb-8 lg:pr-8 lg:border-b-0 border-b lg:border-r border-solid border-neutral-400">
            <RootColors />
          </div>
        </div>
        <div className="flex flex-col gap-16 lg:gap-0">
          <div className="lg:mt-28 mt-18 lg:ml-4 lg:mb-2">
            <BaseColorDisplay />
          </div>
          <div className="lg:ml-4">
            <ColorRowsSection />
          </div>
          <div className="lg:mt-32">
            <CardExamplesSection />
          </div>
          <div className="mx-4 lg:mt-32">
            <h2 className="text-2xl font-bold mb-4 font-title">Export</h2>
            <p className="text-neutral-600 mb-4 max-w-2xl">
              Paste this into your CSS (e.g. in{" "}
              <code className="font-mono bg-neutral-200 px-1 rounded text-sm">
                @import &quot;tailwindcss&quot;;
              </code>{" "}
              or your main stylesheet) to use these colors as Tailwind v4 theme
              variables.
            </p>
            <ThemeExport />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
