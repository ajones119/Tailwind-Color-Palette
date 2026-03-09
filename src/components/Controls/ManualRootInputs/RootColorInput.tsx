import { useRef, useState, useEffect } from "react";
import {
  parseColorToHex,
  hexToHsl,
  hexToRgb,
  hslToHex,
  rgbToHex,
} from "../../../lib/color";

type InputMode = "hex" | "hsl" | "rgb";

type RootColorInputProps = {
  value: string;
  onChange: (hex: string) => void;
};

export default function RootColorInput({
  value,
  onChange,
}: RootColorInputProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<InputMode>("hsl");
  const [text, setText] = useState(value);
  const [localValue, setLocalValue] = useState(value);
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0, a: 100 });
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0, a: 100 });
  const [isValid, setIsValid] = useState(true);

  const syncFromHex = (hex: string) => {
    setText(hex);
    setLocalValue(hex);
    const h = hexToHsl(hex);
    if (h) setHsl(h);
    const r = hexToRgb(hex);
    if (r) setRgb(r);
  };

  useEffect(() => {
    syncFromHex(value);
  }, [value]);

  const commitHex = (hex: string) => {
    if (hex) {
      setIsValid(true);
      syncFromHex(hex);
      onChange(hex);
    } else {
      setIsValid(false);
    }
  };

  const handleTextSubmit = () => {
    const hex = parseColorToHex(text);
    if (hex) {
      commitHex(hex);
    } else {
      setIsValid(false);
    }
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    syncFromHex(hex);
    onChange(hex);
  };

  const handleHslChange = (key: "h" | "s" | "l", v: number) => {
    if (Number.isNaN(v)) return;
    const clamped =
      key === "h"
        ? Math.max(0, Math.min(360, v))
        : Math.max(0, Math.min(100, v));
    const next = { ...hsl, [key]: clamped };
    setHsl(next);
    const hex = hslToHex(next.h, next.s, next.l, next.a);
    if (hex) {
      setText(hex);
      setLocalValue(hex);
      setIsValid(true);
      onChange(hex);
    }
  };

  const handleRgbChange = (key: "r" | "g" | "b", v: number) => {
    if (Number.isNaN(v)) return;
    const clamped = Math.max(0, Math.min(255, v));
    const next = { ...rgb, [key]: clamped };
    setRgb(next);
    const hex = rgbToHex(next.r, next.g, next.b, next.a);
    if (hex) {
      setText(hex);
      setLocalValue(hex);
      setIsValid(true);
      onChange(hex);
    }
  };

  const cycleMode = () => {
    setMode((m) => (m === "hex" ? "hsl" : m === "hsl" ? "rgb" : "hex"));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={cycleMode}
          className="cursor-pointer size-8 shrink-0 flex items-center justify-center rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-100 text-xs font-medium uppercase"
          title={`Input mode: ${mode} (click to cycle)`}
          aria-label="Cycle input mode"
        >
          {mode}
        </button>
        {mode === "hex" && (
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setIsValid(true);
            }}
            onBlur={handleTextSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder="e.g. #939e9d or coral"
            className={` grow rounded border px-1 py-1 text-sm outline-none ${
              isValid
                ? "border-neutral-300 focus:border-neutral-500"
                : "border-red-500"
            }`}
            aria-label="Root color (hex or name)"
          />
        )}
        {mode === "hsl" && (
          <div className="grow flex items-center gap-1">
            <label className="flex items-center gap-1">
              <span className="text-xs text-neutral-500 w-5">H</span>
              <input
                type="number"
                min={0}
                max={360}
                value={Math.round(hsl.h)}
                onChange={(e) => handleHslChange("h", Number(e.target.value))}
                className="w-12 rounded border border-neutral-300 px-1 py-1 text-xs outline-none focus:border-neutral-500"
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-xs text-neutral-500 w-5">S</span>
              <input
                type="number"
                min={0}
                max={100}
                value={Math.round(hsl.s)}
                onChange={(e) => handleHslChange("s", Number(e.target.value))}
                className="w-12 rounded border border-neutral-300 px-1 py-1 text-xs outline-none focus:border-neutral-500"
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-xs text-neutral-500 w-5">L</span>
              <input
                type="number"
                min={0}
                max={100}
                value={Math.round(hsl.l)}
                onChange={(e) => handleHslChange("l", Number(e.target.value))}
                className="w-12 rounded border border-neutral-300 px-1 py-1 text-xs outline-none focus:border-neutral-500"
              />
            </label>
          </div>
        )}
        {mode === "rgb" && (
          <div className="grow flex items-center gap-1">
            <label className="flex items-center gap-1">
              <span className="text-xs text-neutral-500 w-5">R</span>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.r}
                onChange={(e) => handleRgbChange("r", Number(e.target.value))}
                className="w-12 rounded border border-neutral-300 px-1 py-1 text-xs outline-none focus:border-neutral-500"
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-xs text-neutral-500 w-5">G</span>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.g}
                onChange={(e) => handleRgbChange("g", Number(e.target.value))}
                className="w-12 rounded border border-neutral-300 px-1 py-1 text-xs outline-none focus:border-neutral-500"
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-xs text-neutral-500 w-5">B</span>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.b}
                onChange={(e) => handleRgbChange("b", Number(e.target.value))}
                className="w-12 rounded border border-neutral-300 px-1 py-1 text-xs outline-none focus:border-neutral-500"
              />
            </label>
          </div>
        )}

        <button
          type="button"
          onClick={() => colorInputRef.current?.click()}
          className="size-8 shrink-0 rounded border border-neutral-300 overflow-hidden cursor-pointer hover:opacity-90"
          style={{ backgroundColor: localValue }}
          title="Open color picker"
          aria-label="Pick root color"
        />
        <input
          ref={colorInputRef}
          type="color"
          value={localValue.length === 9 ? localValue.slice(0, 7) : localValue}
          onChange={handlePickerChange}
          className="sr-only"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
