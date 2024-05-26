"use client";
import { IoColorFillOutline } from "react-icons/io5";
import { BiPencil } from "react-icons/bi";
import { LuEraser } from "react-icons/lu";
import { ImTextColor } from "react-icons/im";
import { CiPickerHalf } from "react-icons/ci";
import { useContext } from "react";
import { MainContext } from "@/Contexts/mainContext";

export default function Pannel3() {
  const { currentTool, setCurrentBrushType, setCurrentTool } =
    useContext(MainContext);
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
  ];

  const paintToolTiles = paintToolsData.map((item, index) => {
    return (
      <div
        className={`border p-2 border-blue-300 cursor-pointer w-fit ${
          currentTool && currentTool.name === item.name
            ? "bg-blue-400"
            : "bg-blue-200"
        }`}
        key={index}
        onClick={() => {
          setCurrentTool(item);
          setCurrentBrushType(null);
        }}
      >
        {item.icon}
      </div>
    );
  });
  return (
    <div className="h-full w-fit px-2 flex items-center justify-center">
      <div className="grid grid-cols-3">{paintToolTiles}</div>
    </div>
  );
}
