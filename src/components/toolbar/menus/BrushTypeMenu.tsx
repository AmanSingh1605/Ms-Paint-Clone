"use client";
import { BRUSH_ORDER } from "@/lib/brushes/types";
import { useTools } from "@/state";
import { DropdownItem, DropdownMenu } from "./DropdownMenu";

export function BrushTypeMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { brushType, setBrushType } = useTools();

  return (
    <DropdownMenu open={open} onClose={onClose}>
      {BRUSH_ORDER.map((name) => (
        <DropdownItem
          key={name}
          selected={brushType === name}
          onSelect={() => {
            // setBrushType also switches the active mode to the brush, so a
            // previously selected tool cannot keep painting.
            setBrushType(name);
            onClose();
          }}
        >
          {name}
        </DropdownItem>
      ))}
    </DropdownMenu>
  );
}
