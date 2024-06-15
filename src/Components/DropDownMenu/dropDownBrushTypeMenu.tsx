"use client";
import { MainContext } from "@/Contexts/mainContext";
import { useContext } from "react";

export default function DropDownBrushTypeMenu({ active, resetState }) {
  const { currentBrushType, setCurrentTool, setCurrentBrushType } =
    useContext(MainContext);
  const brushTypeArray = [
    { name: "Brush", value: "round" },
    { name: "Thick Brush", value: "square" },
    { name: "Smooth Brush", value: "butt" },
    { name: "Caligraphy Pen", value: "none" },
  ];
  const brushMenuArray = brushTypeArray.map((item, index) => {
    return (
      <div
        className={`p-1 text-sm w-36 hover:bg-blue-200 cursor-pointer ${
          currentBrushType.name === item.name ? "bg-blue-200 " : "bg-white"
        }`}
        key={index}
        onClick={() => {
          setCurrentBrushType({
            name: item.name,
            value: item.value,
            status: true,
            });
            resetState();
        }}
      >
        {item.name}
      </div>
    );
  });

  return (
    <div
      className={`absolute z-50 border rounded p-2 h-fit bg-white ${
        !active ? "hidden" : ""
      }`}
    >
      <div className="w-full h-full flex flex-col ">{brushMenuArray}</div>
    </div>
  );
}
