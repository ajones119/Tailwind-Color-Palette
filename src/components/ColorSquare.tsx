import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Tooltip } from "@base-ui/react";
import { SHADE_KEYS } from "../constants/palette";
import { getTextColorOnBackground, hexToColorName } from "../lib/color";

type ColorSquareProps = {
  value: string;
  shadeIndex: number;
  isRootColor: boolean;
};

const ColorSquare = memo(
  ({ value, shadeIndex, isRootColor }: ColorSquareProps) => {
    const [copied, setCopied] = useState(false);
    const [hoverOpen, setHoverOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleClick = useCallback(() => {
      navigator.clipboard.writeText(value);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 1500);
    }, [value]);

    useEffect(
      () => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      },
      [],
    );

    const textColor = getTextColorOnBackground(value);
    const shadeKey = SHADE_KEYS[shadeIndex];
    const colorName = hexToColorName(value);
    const tooltipContent = copied ? "Copied!" : (colorName ?? value);

    return (
      <Tooltip.Root open={hoverOpen || copied} onOpenChange={setHoverOpen}>
        <Tooltip.Trigger
          data-is-root-color={isRootColor}
          className="relative block size-20 min-w-4 lg:size-full aspect-square rounded-sm overflow-hidden cursor-pointer shrink-0 transition-transform duration-300 hover:scale-105 shadow-md shadow-neutral-200"
          onClick={handleClick}
          delay={0}
        >
          <span className="sr-only">Copy color</span>
          <span
            className="block size-full rounded-sm transition-colors duration-100"
            style={{ backgroundColor: value }}
            aria-hidden
          />
          <div
            className="absolute inset-0 flex flex-col items-start justify-end gap-0.5 text-sm size-full p-2 font-semibold font-mono tabular-nums"
            style={{ color: textColor }}
          >
            <span className="text-xs">{isRootColor ? "*" : ""}</span>
            <span className="text-xs">{shadeKey}</span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="top" sideOffset={8}>
            <Tooltip.Popup className="z-50 font-body rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-sm text-neutral-800 shadow-md">
              {tooltipContent}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  },
);

export default ColorSquare;
