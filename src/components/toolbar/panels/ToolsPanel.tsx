"use client";
import type { ReactNode } from "react";
import { BiPencil } from "react-icons/bi";
import { CiPickerHalf } from "react-icons/ci";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ImTextColor } from "react-icons/im";
import { IoColorFillOutline } from "react-icons/io5";
import { LuEraser } from "react-icons/lu";
import { ToolName } from "@/lib/tools/names";
import { useTools } from "@/state";
import { PanelSection } from "../PanelSection";
import { IconTile } from "../RibbonButton";

const TOOLS: { name: ToolName; icon: ReactNode; disabled?: boolean }[] = [
  { name: ToolName.Pencil, icon: <BiPencil /> },
  { name: ToolName.Fill, icon: <IoColorFillOutline /> },
  { name: ToolName.Text, icon: <ImTextColor /> },
  { name: ToolName.Eraser, icon: <LuEraser /> },
  { name: ToolName.Picker, icon: <CiPickerHalf /> },
  { name: ToolName.Magnify, icon: <FaMagnifyingGlass />, disabled: true },
];

export function ToolsPanel() {
  const { activeTool, selectTool } = useTools();

  return (
    <PanelSection label="Tools">
      <div className="grid grid-cols-3 gap-[2px]">
        {TOOLS.map(({ name, icon, disabled }) => (
          <IconTile
            key={name}
            icon={icon}
            label={name}
            disabled={disabled}
            active={activeTool === name}
            onClick={() => selectTool(name)}
          />
        ))}
      </div>
    </PanelSection>
  );
}
