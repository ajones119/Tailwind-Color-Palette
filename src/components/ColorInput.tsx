import { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { DEBOUNCE_MS } from "../constants/debounce";
import { SHADE_KEYS } from "../constants/palette";
import { getTextColorOnBackground } from "../lib/color";

type ColorInputProps = {
  value: string;
  onChange: (value: string) => void;
  shadeIndex: number;
  isRootColor: boolean;
};

const ColorInput = ({
  value,
  onChange,
  shadeIndex,
  isRootColor,
}: ColorInputProps) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedOnChange = useDebounceCallback(onChange, DEBOUNCE_MS);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (next: string) => {
    setLocalValue(next);
    debouncedOnChange(next);
  };

  const textColor = getTextColorOnBackground(localValue);
  const pickerValue =
    localValue.length === 9 ? localValue.slice(0, 7) : localValue;

  return (
    <label
      data-is-root-color={isRootColor}
      className="relative block size-20 lg:size-full aspect-square rounded-sm overflow-hidden cursor-pointer border border-neutral-300 shrink-0 data-[is-root-color=true]:border-2"
    >
      <span className="sr-only">Pick color</span>
      <span
        className="block size-full rounded-sm"
        style={{ backgroundColor: localValue }}
        aria-hidden
      />
      <div
        className="absolute inset-0 flex flex-col items-start justify-end gap-1 text-sm size-full p-2 font-semibold"
        style={{ color: textColor }}
      >
        <span className="text-xs">{isRootColor ? "*" : ""}</span>
        <span className="text-xs">{SHADE_KEYS[shadeIndex]}</span>
        <span className="text-xs truncate max-w-full">{localValue}</span>
      </div>
      <input
        type="color"
        value={pickerValue}
        onChange={(e) => handleChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </label>
  );
};

export default ColorInput;
