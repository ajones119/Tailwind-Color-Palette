import { useColors, type HarmonyMethod } from "../../../contexts/ColorsContext";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Tooltip } from "@base-ui/react/tooltip";

const HARMONY_METHOD_OPTIONS: HarmonyMethod[] = [
  "auto",
  "analogous",
  "complementary",
  "triadic",
  //'square',
  "rectangle",
  "split-complementary",
  //'split-triadic',
  "tetradic",
];

const HARMONY_TOOLTIPS: Record<HarmonyMethod, string> = {
  auto: "Secondary and tertiary follow the last manual positions on the wheel.",
  analogous:
    "Uses hues next to each other on the wheel for a harmonious, natural look.",
  complementary: "Uses the hue opposite primary for bold contrast and energy.",
  triadic: "Three hues 120° apart for a vibrant, balanced mix.",
  square: "Four hues 90° apart for a bold, dynamic palette.",
  rectangle: "Two pairs of hues (60° and 180° apart) for strong contrast.",
  "split-complementary":
    "Primary plus the two neighbors of its opposite for contrast with less tension.",
  "split-triadic":
    "Variation of triadic with adjusted spacing for softer contrast.",
  tetradic: "Two pairs of opposite hues for rich variety.",
};

export default function HarmonyInput() {
  const { harmonyMethod, setHarmonyMethod } = useColors();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="harmony-toggles"
          className="text-base lg:text-xs font-mono text-neutral-600"
        >
          Color Harmony
        </label>
      </div>
      <Tooltip.Provider>
        <ToggleGroup
          id="harmony-toggles"
          className="flex gap-2 lg:gap-1.5 flex-wrap"
          value={[harmonyMethod]}
          onValueChange={(value) =>
            setHarmonyMethod((value as HarmonyMethod[])?.[0] ?? "auto")
          }
        >
          {HARMONY_METHOD_OPTIONS.map((method) => (
            <Tooltip.Root key={method}>
              <Tooltip.Trigger
                render={(triggerProps) => (
                  <Toggle
                    {...triggerProps}
                    aria-label={method}
                    value={method}
                    className={`cursor-pointer px-3 py-1 lg:px-1 lg:py-0.5 flex font-mono items-center justify-center rounded-sm bg-neutral-100 text-sm active:translate-y-0.5 ${harmonyMethod === method ? "bg-neutral-300" : ""}`}
                  >
                    {method}
                  </Toggle>
                )}
              />
              <Tooltip.Portal>
                <Tooltip.Positioner>
                  <Tooltip.Popup className="z-50 max-w-xs rounded-md border font-body border-neutral-200 bg-neutral-50 px-2 py-1.5 text-sm text-neutral-800 shadow-md">
                    {HARMONY_TOOLTIPS[method]}
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </ToggleGroup>
      </Tooltip.Provider>
    </div>
  );
}
