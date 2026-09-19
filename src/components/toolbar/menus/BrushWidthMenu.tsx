"use client";
import { useTools } from "@/state";
import { DropdownItem, DropdownMenu } from "./DropdownMenu";

const WIDTHS = [2, 4, 6, 8];

export function BrushWidthMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { brushWidth, setBrushWidth } = useTools();

  return (
    <DropdownMenu open={open} onClose={onClose} className="w-44">
      {WIDTHS.map((width) => (
        <DropdownItem
          key={width}
          label={`${width} pixel brush`}
          selected={brushWidth === width}
          onSelect={() => {
            setBrushWidth(width);
            onClose();
          }}
        >
          <span className="flex h-4 w-full items-center">
            <span className="w-full bg-black" style={{ height: width }} />
          </span>
        </DropdownItem>
      ))}
    </DropdownMenu>
  );
}
