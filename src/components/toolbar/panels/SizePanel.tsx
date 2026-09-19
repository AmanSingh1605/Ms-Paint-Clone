"use client";
import Image from "next/image";
import { useState } from "react";
import { PanelSection } from "../PanelSection";
import { LargeButton } from "../RibbonButton";
import { BrushWidthMenu } from "../menus/BrushWidthMenu";

export function SizePanel() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <PanelSection label="Size">
      <LargeButton
        icon={
          <Image
            src="/width-icon-topbar.svg"
            width={28}
            height={22}
            style={{ width: 28, height: 22 }}
            alt=""
            priority
          />
        }
        label="Size"
        onCaret={() => setMenuOpen((open) => !open)}
        menu={
          <BrushWidthMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        }
      />
    </PanelSection>
  );
}
