"use client";
import { useRef } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { BrushName } from "@/lib/tools/names";
import { useTools } from "@/state";

const BRUSHES: BrushName[] = [
  BrushName.Normal,
  BrushName.Square,
  BrushName.Smooth,
  BrushName.Caligraphy,
];

export function BrushTypeMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { brushType, setBrushType } = useTools();
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, onClose, open);

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 h-fit rounded border border-gray-200 bg-white p-2 ${open ? "" : "hidden"}`}
    >
      <div className="flex h-full w-full flex-col">
        {BRUSHES.map((name) => (
          <button
            key={name}
            type="button"
            className={`w-36 cursor-pointer rounded p-1 text-left text-sm transition-colors hover:bg-blue-100 ${
              brushType === name ? "bg-blue-200" : "bg-white"
            }`}
            onClick={() => {
              // setBrushType also switches the active mode to the brush, so a
              // previously selected tool cannot keep painting.
              setBrushType(name);
              onClose();
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
