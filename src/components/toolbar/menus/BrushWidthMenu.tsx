"use client";
import { useRef } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useTools } from "@/state";

const WIDTHS = [2, 4, 6, 8];

export function BrushWidthMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { brushWidth, setBrushWidth } = useTools();
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, onClose, open);

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 w-56 rounded border border-gray-200 bg-white p-2 ${open ? "" : "hidden"}`}
    >
      <div className="flex w-full flex-col gap-2">
        {WIDTHS.map((width) => (
          <button
            key={width}
            type="button"
            aria-label={`${width} pixel brush`}
            className={`cursor-pointer rounded px-1 py-2 transition-colors hover:bg-blue-100 ${
              brushWidth === width ? "bg-blue-200" : "bg-white"
            }`}
            onClick={() => {
              setBrushWidth(width);
              onClose();
            }}
          >
            <div className="w-full bg-black" style={{ height: width }} />
          </button>
        ))}
      </div>
    </div>
  );
}
