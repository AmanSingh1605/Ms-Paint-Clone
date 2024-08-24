"use client";
import { MainContext } from "@/Contexts/mainContext";
import { shapesList } from "@/Service/Data/shapeToolArray";
import { useContext } from "react";

export default function Pannel7() {
  const {
    setCurrentShapeTool,
    currentShapeTool,
    currentBrushType,
    setCurrentBrushType,
    setCurrentTool,
  } = useContext(MainContext);

  const shapeElementList = shapesList.map((item, index) => {
    return (
      <div
        key={index}
        className="p-0.5"
        onClick={() => {
          setCurrentShapeTool({ ...item, status: true });
          setCurrentBrushType({ ...currentBrushType, status: false });
          setCurrentTool(null);
        }}
      >
        <button
          className={` ${item.disable ? " text-gray-400" : " text-blue-500"} p-0.5 border  ${currentShapeTool.status && currentShapeTool.name === item.name ? "border-blue-300" : "border-slate-100"} h-fit w-fit `}
        >
          {item.icon}
        </button>
      </div>
    );
  });
  return (
    <div className="h-full w-fit">
      <div className="h-full w-fit grid grid-cols-7 overflow-y-scroll border border-gray-400 bg-slate-100">
        {shapeElementList}
      </div>
    </div>
  );
}
