import { useColors } from "../../contexts/ColorsContext";
import { hslToHex, type HarmonyMethod } from "../../lib/color";
import { ManualRootInputs } from "./ManualRootInputs/ManualRootInputs";
import { useMemo, useState } from "react";
import { DialIcon } from "../Icons/Dial";
import { RadialIcon } from "../Icons/Radial";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { RadialRootInputs } from "./RadialRootInputs/RadialRootInputs";
import { AnimatePresence, motion } from "framer-motion";

type Mode = "radial" | "inputs";

const DEFAULT_MODE: Mode = "radial";

function getInitialModeFromUrl(): Mode {
  if (typeof window === "undefined") return DEFAULT_MODE;
  const params = new URLSearchParams(window.location.search);
  return params.get("mode") === "inputs" ? "inputs" : DEFAULT_MODE;
}

function setModeInUrl(mode: Mode) {
  const params = new URLSearchParams(window.location.search);
  params.set("mode", mode);
  const search = params.toString();
  window.history.replaceState(
    null,
    "",
    window.location.pathname + (search ? `?${search}` : ""),
  );
}

const HARMONY_METHODS: HarmonyMethod[] = [
  "analogous",
  "complementary",
  "triadic",
  "square",
  "rectangle",
  "split-complementary",
  "split-triadic",
  "tetradic",
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function RootColors() {
  const [mode, setMode] = useState<Mode>(getInitialModeFromUrl);
  const { updateRowRootColor, alignWithHarmony, setHarmonyMethod } =
    useColors();

  const handleModeChange = (value: Mode[] | undefined) => {
    const next = (value as Mode[])?.[0] ?? DEFAULT_MODE;
    setMode(next);
    setModeInUrl(next);
  };

  const randomize = () => {
    const hue = Math.floor(Math.random() * 360);
    const sat = Math.round(randomBetween(55, 95));
    const lit = Math.round(randomBetween(35, 60));
    const harmony =
      HARMONY_METHODS[Math.floor(Math.random() * HARMONY_METHODS.length)];

    const hex = hslToHex(hue, sat, lit, 100);
    if (!hex) return;

    setHarmonyMethod(harmony);
    updateRowRootColor("Primary", hex);
    alignWithHarmony("Primary");
  };

  const view = useMemo(() => {
    return mode === "inputs" ? <ManualRootInputs /> : <RadialRootInputs />;
  }, [mode]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl lg:text-lg font-bold font-title mb-1">
          Root Colors
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <ToggleGroup<Mode>
            className="flex gap-1"
            value={[mode]}
            onValueChange={handleModeChange}
            defaultValue={[DEFAULT_MODE]}
          >
            <Toggle
              aria-label="Manual Inputs"
              value={"inputs" as Mode}
              className={`active:translate-y-0.5 cursor-pointer size-10 lg:size-6 flex items-center justify-center rounded-sm bg-neutral-100 ${mode === "inputs" ? "bg-neutral-200" : ""}`}
            >
              <DialIcon className="size-6 lg:size-4" />
            </Toggle>
            <Toggle
              aria-label="Color Wheel"
              value={"radial" as Mode}
              className={`active:translate-y-0.5 cursor-pointer size-10 lg:size-6 flex items-center justify-center rounded-sm bg-neutral-100 ${mode === "radial" ? "bg-neutral-200" : ""}`}
            >
              <RadialIcon className="size-6 lg:size-4" />
            </Toggle>
          </ToggleGroup>
          <button
            type="button"
            onClick={randomize}
            className="cursor-pointer text-base font-semibold lg:font-normal lg:text-sm font-mono px-2 py-2 lg:py-0.5 rounded border border-neutral-300 hover:bg-neutral-100 active:translate-y-0.5"
          >
            Randomize
          </button>
        </div>
      </div>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            mode === "inputs"
              ? { opacity: 0, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.95, y: 0 }
          }
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {view}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
