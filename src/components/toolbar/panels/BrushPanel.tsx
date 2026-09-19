"use client";
import Image from "next/image";
import { useState } from "react";
import { useTools } from "@/state";
import { PanelSection } from "../PanelSection";
import { LargeButton } from "../RibbonButton";
import { BrushTypeMenu } from "../menus/BrushTypeMenu";

export function BrushPanel() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isBrushActive, selectBrush } = useTools();

  return (
    <PanelSection label="Brushes">
      <LargeButton
        icon={
          <Image
            src="/paint-brush.jpg"
            width={28}
            height={28}
            style={{ width: 28, height: 28 }}
            className="rounded-sm"
            alt=""
            priority
          />
        }
        label="Brushes"
        active={isBrushActive}
        onClick={selectBrush}
        onCaret={() => setMenuOpen((open) => !open)}
        menu={
          <BrushTypeMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        }
      />
    </PanelSection>
  );
}
