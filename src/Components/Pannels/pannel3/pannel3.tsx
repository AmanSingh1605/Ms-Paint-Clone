"use client";
import { IoColorFillOutline } from "react-icons/io5";
import { BiPencil } from "react-icons/bi";
import { LuEraser } from "react-icons/lu";
import { ImTextColor } from "react-icons/im";
import { CiPickerHalf } from "react-icons/ci";
import { useContext } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MainContext } from "@/Contexts/mainContext";

export default function Pannel3() {
  const {
    currentTool,
    currentBrushType,
    setCurrentBrushType,
    setCurrentTool,
    setCurrentShapeTool,
    currentShapeTool,
  } = useContext(MainContext);
  const paintToolsData = [
    {
      name: "Pencil",
      icon: <BiPencil />,
    },
    {
      name: "Fill",
      icon: <IoColorFillOutline />,
    },
    {
      name: "Eraser",
      icon: <LuEraser />,
    },
    {
      name: "Text",
      icon: <ImTextColor />,
    },
    {
      name: "Picker",
      icon: <CiPickerHalf />,
    },
    {
      name: "Magnify",
      icon: <FaMagnifyingGlass className="text-slate-400" />,
    },
  ];

  const paintToolTiles = paintToolsData.map((item, index) => {
    return (
      <div
        className={`w-fit cursor-pointer border-y border-gray-400 p-2 ${
          currentTool && currentTool.name === item.name
            ? "bg-tool-icon-color-active bg-tool-icon-active"
            : "bg-tool-icon-color bg-tool-icon"
        }`}
        key={index}
        onClick={() => {
          setCurrentTool(item);
          setCurrentBrushType({ ...currentBrushType, status: false });
          setCurrentShapeTool({ ...currentShapeTool, status: false });
        }}
      >
        {item.icon}
      </div>
    );
  });
  return (
    <div className="flex h-full w-fit flex-col items-center justify-between gap-2 px-2">
      <div className="grid grid-cols-3 gap-y-1 [&>*:nth-child(3n)]:rounded-e [&>*:nth-child(3n)]:border-e [&>*:nth-child(3n+1)]:rounded-s [&>*:nth-child(3n+1)]:border-s [&>*:nth-child(3n+2)]:border-x">
        {paintToolTiles}
      </div>
      <div className="text-xs text-slate-500">{"Tools"}</div>
    </div>
  );
}
