import { useCallback, useEffect, useRef, useState } from "react";
import { useColors } from "../../contexts/ColorsContext";
import { Tooltip } from "@base-ui/react";
import { getTextColorOnBackground, hexToColorName } from "../../lib/color";
import { motion } from "framer-motion";

export const BaseColorDisplay = () => {
  const { colorRows } = useColors();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback((color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopiedColor(null);
      timeoutRef.current = null;
    }, 1500);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return (
    <div>
      <div className="grid grid-cols-4 max-w-5xl">
        {colorRows.map((row) => {
          const color = row.rootColor;
          const isOpen = hoveredColor === row.title || copiedColor === color;
          const colorName = hexToColorName(color);
          const tooltipContent =
            copiedColor === color ? "Copied!" : (colorName ?? color);
          return (
            <Tooltip.Root
              key={row.title}
              open={isOpen}
              onOpenChange={(open) => {
                if (open) setHoveredColor(row.title);
                else
                  setHoveredColor((prev) => (prev === row.title ? null : prev));
              }}
            >
              <Tooltip.Trigger
                delay={0}
                className="group hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => handleClick(color)}
              >
                <div
                  className="w-full h-32 md:h-24 lg:h-16 flex items-center justify-center line-clamp-1 transition-colors duration-300"
                  style={{
                    background: color,
                    color: getTextColorOnBackground(color),
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {colorName ?? color}
                  </motion.span>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner side="top" sideOffset={8}>
                  <Tooltip.Popup
                    className="z-50 font-body rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-sm text-neutral-800 shadow-md
                                        transition-all duration-100 ease-out
                                        data-starting-style:opacity-0 data-starting-style:scale-95 data-starting-style:translate-y-2
                                        data-ending-style:opacity-0 data-ending-style:scale-95 data-ending-style:translate-y-2"
                  >
                    {tooltipContent}
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
      </div>
    </div>
  );
};
