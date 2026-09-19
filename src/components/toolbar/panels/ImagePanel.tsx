"use client";
import { FiCrop } from "react-icons/fi";
import { GiResize } from "react-icons/gi";
import { LuSquareDashed } from "react-icons/lu";
import { MdRotate90DegreesCw } from "react-icons/md";
import { ToolName } from "@/lib/tools/names";
import { useTools } from "@/state";
import { PanelSection } from "../PanelSection";
import { LargeButton, SmallButton } from "../RibbonButton";

export function ImagePanel() {
  const { activeTool, selectTool } = useTools();

  return (
    <PanelSection label="Image">
      <LargeButton
        icon={<LuSquareDashed />}
        label="Select"
        active={activeTool === ToolName.Select}
        onClick={() => selectTool(ToolName.Select)}
      />
      <div className="flex w-[74px] flex-col gap-0.5">
        <SmallButton icon={<FiCrop />} label="Crop" disabled />
        <SmallButton icon={<GiResize />} label="Resize" disabled />
        <SmallButton icon={<MdRotate90DegreesCw />} label="Rotate" disabled />
      </div>
    </PanelSection>
  );
}
