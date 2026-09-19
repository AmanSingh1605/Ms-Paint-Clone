"use client";
import { useTools } from "@/state";
import { PanelSection } from "../PanelSection";
import { SHAPE_CATALOG } from "../shapeCatalog";

export function ShapesPanel() {
  const { activeShape, selectShape } = useTools();

  return (
    <PanelSection label="Shapes">
      <div className="no-scrollbar grid h-[68px] grid-cols-7 content-start gap-[2px] overflow-y-auto rounded-sm border border-gray-400 bg-white p-[3px]">
        {SHAPE_CATALOG.map(({ name, icon, disabled }) => (
          <button
            key={name}
            type="button"
            aria-label={name}
            aria-pressed={activeShape === name}
            title={name}
            disabled={disabled}
            onClick={() => selectShape(name)}
            className={`flex h-[19px] w-[19px] items-center justify-center rounded-sm border text-[12px] ${
              disabled
                ? "cursor-default border-transparent text-slate-300"
                : "cursor-pointer text-slate-700 hover:bg-icon-hover"
            } ${
              activeShape === name
                ? "bg-tool-icon-color-active bg-tool-icon-active border-amber-300"
                : "border-transparent"
            }`}
          >
            {icon}
          </button>
        ))}
      </div>
    </PanelSection>
  );
}
