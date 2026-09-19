"use client";
import { ImCopy } from "react-icons/im";
import { LuClipboardList } from "react-icons/lu";
import { TfiCut } from "react-icons/tfi";
import { PanelSection } from "../PanelSection";
import { LargeButton, SmallButton } from "../RibbonButton";

// Not implemented yet, greyed out to keep the ribbon's shape.
export function ClipboardPanel() {
  return (
    <PanelSection label="Clipboard">
      <LargeButton icon={<LuClipboardList />} label="Paste" disabled />
      <div className="flex w-[74px] flex-col gap-0.5">
        <SmallButton icon={<TfiCut />} label="Cut" disabled />
        <SmallButton icon={<ImCopy />} label="Copy" disabled />
      </div>
    </PanelSection>
  );
}
