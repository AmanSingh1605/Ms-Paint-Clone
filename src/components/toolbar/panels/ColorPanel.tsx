"use client";
import { useEffect, useState } from "react";
import { openColorDialog } from "@/lib/tools/colorDialog";
import { useColors } from "@/state";
import { PanelSection } from "../PanelSection";
import { PALETTE, RECENT_SLOTS } from "../palette";

type Slot = "primary" | "secondary";

export function ColorPanel() {
  const { primary, secondary, setPrimary, setSecondary } = useColors();
  const [slot, setSlot] = useState<Slot>("primary");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    // Registers the <color-picker> custom element, browser side only.
    if (typeof window !== "undefined") import("color-dialog-box");
  }, []);

  const applyColor = (color: string) =>
    slot === "primary" ? setPrimary(color) : setSecondary(color);

  const pickCustomColor = () =>
    openColorDialog(slot === "primary" ? primary : secondary, (hex) => {
      applyColor(hex);
      setRecent((list) => [hex, ...list.filter((c) => c !== hex)].slice(0, RECENT_SLOTS));
    });

  return (
    <PanelSection label="Colors">
      <div className="flex items-center gap-1">
        <SlotSwatch
          label="Color 1"
          selected={slot === "primary"}
          onSelect={() => setSlot("primary")}
          swatchStyle={{ backgroundColor: primary }}
        />
        <SlotSwatch
          label="Color 2"
          selected={slot === "secondary"}
          onSelect={() => setSlot("secondary")}
          swatchStyle={{ backgroundColor: secondary }}
        />
      </div>

      {/* Row major: the first ten entries sit above the next ten. */}
      <div className="grid grid-cols-10 gap-[3px] rounded-sm border border-gray-400 bg-white p-[3px]">
        {PALETTE.map(({ color, name }) => (
          <button
            key={name}
            type="button"
            aria-label={name}
            title={name}
            className="h-[17px] w-[17px] cursor-pointer border border-gray-500"
            style={{ backgroundColor: color }}
            onClick={() => applyColor(color)}
          />
        ))}
      </div>

      <div className="grid grid-flow-col grid-rows-2 gap-[3px] rounded-sm border border-gray-400 bg-white p-[3px]">
        {Array.from({ length: RECENT_SLOTS }, (_, index) => {
          const color = recent[index];
          return color ? (
            <button
              key={index}
              type="button"
              aria-label={`Recent colour ${color}`}
              title={color}
              className="h-[17px] w-[17px] cursor-pointer border border-gray-500"
              style={{ backgroundColor: color }}
              onClick={() => applyColor(color)}
            />
          ) : (
            <span
              key={index}
              aria-hidden
              className="h-[17px] w-[17px] border border-gray-300 bg-slate-50"
            />
          );
        })}
      </div>

      <button
        type="button"
        className="flex w-16 cursor-pointer flex-col items-center gap-0.5 rounded border border-transparent px-1 py-1 hover:border-sky-200 hover:bg-icon-hover"
        onClick={pickCustomColor}
      >
        <span
          className="h-8 w-8 rounded-full border border-white bg-contain outline outline-1 outline-gray-500"
          style={{ backgroundImage: "url(/color-wheel.svg)" }}
        />
        <span className="text-center text-[11px] leading-tight">
          Edit colors
        </span>
      </button>

      <color-picker />
    </PanelSection>
  );
}

function SlotSwatch({
  label,
  selected,
  onSelect,
  swatchStyle,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  swatchStyle: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex w-[52px] cursor-pointer flex-col items-center gap-1 rounded border px-1 py-1 ${
        selected
          ? "bg-tool-icon-color-active bg-tool-icon-active border-amber-300"
          : "border-transparent hover:border-sky-200 hover:bg-icon-hover"
      }`}
    >
      <span
        className="h-7 w-7 rounded-sm border border-gray-500 shadow-inner"
        style={swatchStyle}
      />
      <span className="text-[11px] leading-none">{label}</span>
    </button>
  );
}
