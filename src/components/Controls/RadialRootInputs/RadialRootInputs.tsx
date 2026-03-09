import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Slider } from "@base-ui/react/slider";
import { useColors, useRow } from "../../../contexts/ColorsContext";
import {
  getHarmonyRootsFromHsl,
  getTextColorOnBackground,
  hexToHsl,
  hslToHex,
} from "../../../lib/color";
import HarmonyInput from "../HarmonyInput/HarmonyInput";
import { useResizeObserver } from "usehooks-ts";
import { motion } from "framer-motion";

type RowKey = "Primary" | "Secondary" | "Tertiary";

const DRAG_UPDATE_THRESHOLD_PX = 4;

const CHIP_ANIMATION_CONFIG = {
  scale: 1.1,
  transition: { type: "spring" as const, stiffness: 150, damping: 10 },
};

const CHIP_HOVER_TAP_ANIMATION = {
  whileHover: { scale: CHIP_ANIMATION_CONFIG.scale },
  whileTap: { scale: CHIP_ANIMATION_CONFIG.scale },
  transition: CHIP_ANIMATION_CONFIG.transition,
};

export const RadialRootInputs = () => {
  const {
    colorRows,
    updateRowRootColor,
    alignNeutralWithPrimary,
    alignWithHarmony,
    setNonNeutralSaturationLightness,
    harmonyMethod,
  } = useColors();

  const baseColorRow = useRow("Primary");
  const secondaryColorRow = useRow("Secondary");
  const tertiaryColorRow = useRow("Tertiary");

  const baseSaturation = baseColorRow?.rootColor
    ? (hexToHsl(baseColorRow.rootColor)?.s ?? 100)
    : 100;
  const baseLightness = baseColorRow?.rootColor
    ? (hexToHsl(baseColorRow.rootColor)?.l ?? 50)
    : 50;

  const [saturation, setSaturation] = useState(baseSaturation);
  const [lightness, setLightness] = useState(baseLightness);

  const [hue, setHue] = useState<Record<RowKey, number>>(() => ({
    Primary:
      hexToHsl(
        colorRows.find((r) => r.title === "Primary")?.rootColor ?? "#000000",
      )?.h ?? 0,
    Secondary:
      hexToHsl(
        colorRows.find((r) => r.title === "Secondary")?.rootColor ?? "#000000",
      )?.h ?? 0,
    Tertiary:
      hexToHsl(
        colorRows.find((r) => r.title === "Tertiary")?.rootColor ?? "#000000",
      )?.h ?? 0,
  }));

  const lightShade = baseColorRow?.colors[2] ?? "#ffffff";
  const baseShade = baseColorRow?.rootColor ?? "#000000";

  const pieBackground = useRef<HTMLDivElement>(null);
  const primaryIndicator = useRef<HTMLDivElement>(null);
  const primaryIndicatorChip = useRef<HTMLDivElement>(null);
  const secondaryIndicator = useRef<HTMLDivElement>(null);
  const tertiaryIndicator = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const draggingRow = useRef<RowKey | null>(null);
  const hueRef = useRef<Record<RowKey, number>>({ ...hue });
  const lastUpdatePos = useRef<{ x: number; y: number } | null>(null);
  const dragRafId = useRef<number | null>(null);
  const slRef = useRef({ s: saturation, l: lightness });
  const slRafId = useRef<number | null>(null);
  const lastPushedSL = useRef<{ s: number; l: number } | null>(null);

  const { width, height } = useResizeObserver({
    ref: pieBackground as any,
    box: "border-box",
  });

  useEffect(() => {
    slRef.current = { s: saturation, l: lightness };
  }, [saturation, lightness]);
  useEffect(() => {
    hueRef.current = { ...hue };
  }, [hue]);

  // Stable refs for context-push functions so rAF callbacks always use latest closures.
  const pushDragUpdateRef = useRef<() => void>(() => {});
  pushDragUpdateRef.current = () => {
    startTransition(() => {
      if (harmonyMethod !== "auto") {
        const primaryHex = hslToHex(
          hueRef.current.Primary,
          slRef.current.s,
          slRef.current.l,
          100,
        );
        if (!primaryHex) return;
        updateRowRootColor("Primary", primaryHex);
        alignWithHarmony("Primary");
      } else {
        const row = draggingRow.current;
        if (!row) return;
        const newHex = hslToHex(
          hueRef.current[row],
          slRef.current.s,
          slRef.current.l,
          100,
        );
        if (!newHex) return;
        updateRowRootColor(row, newHex);
        alignNeutralWithPrimary();
      }
    });
  };

  const pushSLUpdateRef = useRef<() => void>(() => {});
  pushSLUpdateRef.current = () => {
    const { s, l } = slRef.current;
    lastPushedSL.current = { s, l };
    startTransition(() => {
      setNonNeutralSaturationLightness(s, l);
    });
  };

  // Sync hue + S/L from context when colorRows change externally.
  useEffect(() => {
    if (isDragging.current) return;
    const primary =
      colorRows.find((r) => r.title === "Primary")?.rootColor ?? "#000000";
    const secondary =
      colorRows.find((r) => r.title === "Secondary")?.rootColor ?? "#000000";
    const tertiary =
      colorRows.find((r) => r.title === "Tertiary")?.rootColor ?? "#000000";
    const primaryHsl = hexToHsl(primary);
    setHue((prev) => ({
      Primary: primaryHsl?.h ?? prev.Primary,
      Secondary: hexToHsl(secondary)?.h ?? prev.Secondary,
      Tertiary: hexToHsl(tertiary)?.h ?? prev.Tertiary,
    }));
    if (primaryHsl != null) {
      const pushed = lastPushedSL.current;
      const isOwnEcho =
        pushed != null &&
        Math.abs(pushed.s - primaryHsl.s) < 1 &&
        Math.abs(pushed.l - primaryHsl.l) < 1;
      if (!isOwnEcho) {
        setSaturation(primaryHsl.s);
        setLightness(primaryHsl.l);
      }
    }
  }, [colorRows]);

  // Conic gradient driven by local S/L.
  useEffect(() => {
    if (!pieBackground.current) return;
    pieBackground.current.style.background = `conic-gradient(from 90deg, hsl(0,${saturation}%,${lightness}%) 0deg, hsl(60,${saturation}%,${lightness}%) 60deg, hsl(120,${saturation}%,${lightness}%) 120deg, hsl(180,${saturation}%,${lightness}%) 180deg, hsl(240,${saturation}%,${lightness}%) 240deg, hsl(300,${saturation}%,${lightness}%) 300deg, hsl(360,${saturation}%,${lightness}%) 360deg)`;
  }, [saturation, lightness]);

  // Cleanup rAF on unmount.
  useEffect(
    () => () => {
      if (dragRafId.current != null) cancelAnimationFrame(dragRafId.current);
      if (slRafId.current != null) cancelAnimationFrame(slRafId.current);
    },
    [],
  );

  const syncIndicatorPosition = useCallback(
    (indicator: React.RefObject<HTMLDivElement | null>, h: number) => {
      if (!indicator.current || !pieBackground.current) return;
      const rect = pieBackground.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const outerRadius = rect.width / 2;
      const innerRadius = outerRadius * (9 / 12);
      const pathCenterRadius = (outerRadius + innerRadius) / 2;
      const angle = (h * Math.PI) / 180;
      const x = centerX + Math.cos(angle) * pathCenterRadius;
      const y = centerY + Math.sin(angle) * pathCenterRadius;
      indicator.current.style.left = `${x}px`;
      indicator.current.style.top = `${y}px`;
      indicator.current.style.transform = `translate(-50%, -50%)`;
    },
    [],
  );

  useLayoutEffect(() => {
    if (!pieBackground.current || !width || !height) return;
    syncIndicatorPosition(primaryIndicator, hue.Primary);
    syncIndicatorPosition(secondaryIndicator, hue.Secondary);
    syncIndicatorPosition(tertiaryIndicator, hue.Tertiary);
  }, [
    hue.Primary,
    hue.Secondary,
    hue.Tertiary,
    syncIndicatorPosition,
    width,
    height,
  ]);

  const updateHueFromPointer = useCallback(
    (clientX: number, clientY: number, row: RowKey) => {
      const el = pieBackground.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
      const angleDeg = (angleRad * 180) / Math.PI;
      const newHue = (angleDeg + 360) % 360;

      if (harmonyMethod !== "auto") {
        hueRef.current.Primary = newHue;
        const { secondary, tertiary } = getHarmonyRootsFromHsl(
          { h: newHue, s: slRef.current.s, l: slRef.current.l },
          harmonyMethod,
        );
        hueRef.current.Secondary = secondary.h;
        hueRef.current.Tertiary = tertiary.h;
      } else {
        hueRef.current[row] = newHue;
      }

      syncIndicatorPosition(primaryIndicator, hueRef.current.Primary);
      syncIndicatorPosition(secondaryIndicator, hueRef.current.Secondary);
      syncIndicatorPosition(tertiaryIndicator, hueRef.current.Tertiary);

      if (primaryIndicatorChip.current) {
        primaryIndicatorChip.current.style.background = `hsl(${hueRef.current.Primary}, ${slRef.current.s}%, ${slRef.current.l}%)`;
      }
    },
    [syncIndicatorPosition, harmonyMethod],
  );

  const scheduleDragPush = useCallback(() => {
    if (dragRafId.current != null) return;
    dragRafId.current = requestAnimationFrame(() => {
      pushDragUpdateRef.current();
      dragRafId.current = null;
    });
  }, []);

  const scheduleSLPush = useCallback(() => {
    if (slRafId.current != null) return;
    slRafId.current = requestAnimationFrame(() => {
      pushSLUpdateRef.current();
      slRafId.current = null;
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, row: RowKey) => {
      e.preventDefault();
      isDragging.current = true;
      draggingRow.current = row;
      lastUpdatePos.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updateHueFromPointer(e.clientX, e.clientY, row);
      scheduleDragPush();
    },
    [updateHueFromPointer, scheduleDragPush],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent, row: RowKey) => {
      if (!isDragging.current) return;
      updateHueFromPointer(e.clientX, e.clientY, row);

      if (lastUpdatePos.current) {
        const dx = e.clientX - lastUpdatePos.current.x;
        const dy = e.clientY - lastUpdatePos.current.y;
        if (
          dx * dx + dy * dy >=
          DRAG_UPDATE_THRESHOLD_PX * DRAG_UPDATE_THRESHOLD_PX
        ) {
          lastUpdatePos.current = { x: e.clientX, y: e.clientY };
          scheduleDragPush();
        }
      }
    },
    [updateHueFromPointer, scheduleDragPush],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent, row: RowKey) => {
      isDragging.current = false;
      lastUpdatePos.current = null;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);

      if (dragRafId.current != null) {
        cancelAnimationFrame(dragRafId.current);
        dragRafId.current = null;
      }

      setHue({ ...hueRef.current });

      if (harmonyMethod !== "auto") {
        const primaryHex = hslToHex(
          hueRef.current.Primary,
          saturation,
          lightness,
          100,
        );
        if (primaryHex) {
          updateRowRootColor("Primary", primaryHex);
          alignWithHarmony("Primary");
        }
      } else {
        const newHex = hslToHex(
          hueRef.current[row],
          saturation,
          lightness,
          100,
        );
        if (newHex) {
          updateRowRootColor(row, newHex);
          alignNeutralWithPrimary();
        }
      }

      draggingRow.current = null;
    },
    [
      harmonyMethod,
      saturation,
      lightness,
      updateRowRootColor,
      alignWithHarmony,
      alignNeutralWithPrimary,
    ],
  );

  const hueGradient = `linear-gradient(to right, hsl(0,${saturation}%,${lightness}%), hsl(60,${saturation}%,${lightness}%), hsl(120,${saturation}%,${lightness}%), hsl(180,${saturation}%,${lightness}%), hsl(240,${saturation}%,${lightness}%), hsl(300,${saturation}%,${lightness}%), hsl(360,${saturation}%,${lightness}%))`;

  return (
    <div className="grid md:grid-cols-2 lg:flex lg:flex-col gap-4">
      <div className="flex flex-col gap-1.5 row-span-4">
        <div
          id="hue-slider"
          className="w-full rounded-full bg-neutral-200 relative touch-none select-none"
        >
          <div
            ref={pieBackground}
            id="gradient-background"
            className="aspect-square inset-0 rounded-full drop-shadow-lg shadow-neutral-100"
            style={{
              background: `conic-gradient(from 90deg, hsl(0,${saturation}%,${lightness}%) 0deg, hsl(60,${saturation}%,${lightness}%) 60deg, hsl(120,${saturation}%,${lightness}%) 120deg, hsl(180,${saturation}%,${lightness}%) 180deg, hsl(240,${saturation}%,${lightness}%) 240deg, hsl(300,${saturation}%,${lightness}%) 300deg, hsl(360,${saturation}%,${lightness}%) 360deg)`,
            }}
          />
          <div
            id="inner-piece"
            className="size-9/12 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "white" }}
          />
          <div
            ref={primaryIndicator}
            id="primary-color-value-chip"
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              ref={primaryIndicatorChip}
              className="size-8 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing touch-none select-none border border-white shadow-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1 pointer-events-auto"
              style={{
                background: `hsl(${hue.Primary}, ${saturation}%, ${lightness}%)`,
                borderColor: getTextColorOnBackground(
                  baseColorRow?.rootColor ?? "#000000",
                ),
                color: getTextColorOnBackground(
                  baseColorRow?.rootColor ?? "#000000",
                ),
              }}
              role="slider"
              aria-label="Primary hue"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={Math.round(hue.Primary)}
              tabIndex={0}
              onPointerDown={(e) => handlePointerDown(e, "Primary")}
              onPointerMove={(e) => handlePointerMove(e, "Primary")}
              onPointerUp={(e) => handlePointerUp(e, "Primary")}
              onPointerCancel={(e) => handlePointerUp(e, "Primary")}
              {...CHIP_HOVER_TAP_ANIMATION}
            >
              1
            </motion.div>
          </div>
          <div
            ref={secondaryIndicator}
            id="secondary-color-value-chip"
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              className="size-8 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing touch-none select-none border border-neutral-300 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1 pointer-events-auto"
              style={{
                background: "transparent",
                borderColor: getTextColorOnBackground(
                  secondaryColorRow?.rootColor ?? "#000000",
                ),
                color: getTextColorOnBackground(
                  secondaryColorRow?.rootColor ?? "#000000",
                ),
              }}
              role="slider"
              aria-label="Secondary hue"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={Math.round(hue.Secondary)}
              onPointerDown={(e) => handlePointerDown(e, "Secondary")}
              onPointerMove={(e) => handlePointerMove(e, "Secondary")}
              onPointerUp={(e) => handlePointerUp(e, "Secondary")}
              onPointerCancel={(e) => handlePointerUp(e, "Secondary")}
              {...CHIP_HOVER_TAP_ANIMATION}
            >
              2
            </motion.div>
          </div>
          <div
            ref={tertiaryIndicator}
            id="tertiary-color-value-chip"
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              className="size-8 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing touch-none select-none border border-neutral-300 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1 pointer-events-auto"
              style={{
                background: "transparent",
                borderColor: getTextColorOnBackground(
                  tertiaryColorRow?.rootColor ?? "#000000",
                ),
                color: getTextColorOnBackground(
                  tertiaryColorRow?.rootColor ?? "#000000",
                ),
              }}
              role="slider"
              aria-label="Tertiary hue"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={Math.round(hue.Tertiary)}
              onPointerDown={(e) => handlePointerDown(e, "Tertiary")}
              onPointerMove={(e) => handlePointerMove(e, "Tertiary")}
              onPointerUp={(e) => handlePointerUp(e, "Tertiary")}
              onPointerCancel={(e) => handlePointerUp(e, "Tertiary")}
              {...CHIP_HOVER_TAP_ANIMATION}
            >
              3
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-600">Hue</span>
          <span className="text-xs tabular-nums text-neutral-500">
            {Math.round(hue.Primary)}°
          </span>
        </div>
        <Slider.Root
          value={hue.Primary}
          min={0}
          max={360}
          onValueChange={(v) => setHue((prev) => ({ ...prev, Primary: v }))}
          className="w-full touch-none select-none"
        >
          <Slider.Control className="flex items-center w-full h-5 cursor-pointer">
            <Slider.Track
              className="relative flex-1 h-3 lg:h-2 rounded-full"
              style={{ background: hueGradient }}
            >
              <Slider.Indicator className="h-full rounded-full bg-transparent" />
              <Slider.Thumb
                aria-label="Hue"
                className="block size-5 lg:size-4 rounded-full border-2 border-white shadow-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1"
                style={{
                  background: `hsl(${hue.Primary}, ${saturation}%, ${lightness}%)`,
                }}
              />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="saturation-slider"
            className="text-base lg:text-xs font-mono text-neutral-600"
          >
            Saturation
          </label>
          <span className="text-base lg:text-xs font-mono tabular-nums text-neutral-500">
            {Math.round(saturation)}%
          </span>
        </div>
        <Slider.Root
          id="saturation-slider"
          value={saturation}
          min={0}
          max={100}
          onValueChange={(v) => {
            setSaturation(v);
            scheduleSLPush();
          }}
          className="w-full touch-none select-none"
        >
          <Slider.Control className="flex items-center w-full h-5 cursor-pointer">
            <Slider.Track
              className="relative flex-1 h-3 lg:h-2 rounded-full"
              style={{ background: lightShade }}
            >
              <Slider.Indicator
                className="h-full rounded-full"
                style={{ background: baseShade }}
              />
              <Slider.Thumb
                aria-label="Saturation"
                style={{ background: baseShade }}
                className="block size-5 lg:size-4 rounded-full border-2 border-white shadow-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1"
              />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="lightness-slider"
            className="text-base lg:text-xs font-mono text-neutral-600"
          >
            Lightness
          </label>
          <span className="text-base lg:text-xs font-mono tabular-nums text-neutral-500">
            {Math.round(lightness)}%
          </span>
        </div>
        <Slider.Root
          id="lightness-slider"
          value={lightness}
          min={0}
          max={100}
          onValueChange={(v) => {
            setLightness(v);
            scheduleSLPush();
          }}
          className="w-full touch-none select-none"
        >
          <Slider.Control className="flex items-center w-full h-5 cursor-pointer">
            <Slider.Track className="relative flex-1 h-3 lg:h-2 rounded-full bg-linear-to-r from-neutral-100 to-neutral-400">
              <Slider.Indicator className="h-full rounded-full bg-neutral-900" />
              <Slider.Thumb
                aria-label="Lightness"
                className="block size-5 lg:size-4 rounded-full border-2 border-white bg-neutral-700 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1"
              />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </div>

      <HarmonyInput />
    </div>
  );
};
