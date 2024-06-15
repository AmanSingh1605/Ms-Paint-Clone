"use client";
import { MainContext } from "@/Contexts/mainContext";
import handleColorPicker from "@/Service/Functions/colorPicker";
import React, { useContext, useState } from "react";
import "color-dialog-box";

export default function Pannel5() {
  const { primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor } =
    useContext(MainContext);
  const [colorType, setColorType] = useState("primary");
  const [display, setDisplay] = useState(true);

  const paintArray = [
    { color: "#000000FF", name: "Black" },
    { color: "#575757FF", name: "Dark Gray" },
    { color: "#FF0000FF", name: "Red" },
    { color: "#FFA500FF", name: "Orange" },
    { color: "#FFFF00FF", name: "Yellow" },
    { color: "#00FF00FF", name: "Lime Green" },
    { color: "#008000FF", name: "Green" },
    { color: "#008080FF", name: "Teal" },
    { color: "#0000FFFF", name: "Blue" },
    { color: "#000080FF", name: "Navy Blue" },
    { color: "#FFFFFFFF", name: "White" },
    { color: "#800080FF", name: "Purple" },
    { color: "#D3D3D3FF", name: "Light Gray 1" },
    { color: "#C0C0C0FF", name: "Light Gray 2" },
    { color: "#FFC0CBFF", name: "Pink" },
    { color: "#FFE4B5FF", name: "Peach" },
    { color: "#FFFFE0FF", name: "Light Yellow" },
    { color: "#CCFFCCFF", name: "Light Lime Green" },
    { color: "#AFEEEEFF", name: "Light Teal" },
    { color: "#ADD8E6FF", name: "Light Blue" },
    { color: "#00000000", name: "Blank Color" },
    { color: "#00000000", name: "Blank Color" },
    { color: "#00000000", name: "Blank Color" },
    { color: "#00000000", name: "Blank Color" },
    { color: "#00000000", name: "Blank Color" },
    { color: "#00000000", name: "Blank Color" },
    { color: "#00000000", name: "Blank Color" },
    { color: "#00000000", name: "Blank Color" },
    { color: "#00000000", name: "Blank Color" },
    { color: "#00000000", name: "Blank Color" },
  ];
  const handlePaintColor = (value: string) => {
    if (colorType == "primary") setPrimaryColor(value);
    else setSecondaryColor(value);
  };

  const handleColorPickerDiplay = () => {
    setDisplay(() => !display);
    if (display) {
      handleColorPicker(primaryColor, setPrimaryColor);
    }
  };

  const paintTray = paintArray.map((item, index) => {
    return (
      <div
        className="group relative h-[18px] w-[18px] cursor-pointer rounded-sm border-2 border-gray-200"
        key={index}
        style={{ backgroundColor: item.color }}
        onClick={() => handlePaintColor(item.color)}
      ></div>
    );
  });

  return (
    <div className="flex h-full items-center justify-center gap-2 px-2">
      <div
        className={`flex h-full cursor-pointer flex-col items-center justify-start gap-2 rounded px-2 py-1 ${
          colorType === "primary"
            ? "bg-tool-icon-color-active bg-tool-icon-active"
            : ""
        }`}
      >
        <div
          className={`h-10 w-10 rounded-sm border-8 outline-gray-500 ${colorType === "primary" ? "outline outline-2" : ""} `}
          onClick={() => setColorType("primary")}
          style={{ borderColor: primaryColor, backgroundColor: secondaryColor }}
        ></div>
        <div className="font- text-xs">{"Stroke"}</div>
      </div>
      <div
        className={`flex h-full cursor-pointer flex-col items-center justify-start gap-2 rounded px-2 py-1 ${
          colorType === "secondary"
            ? "bg-tool-icon-color-active bg-tool-icon-active"
            : ""
        }`}
      >
        <div
          className={`h-10 w-10 rounded-sm outline-gray-500 ${colorType === "secondary" ? "outline outline-2" : ""} `}
          onClick={() => setColorType("secondary")}
          style={{ backgroundColor: secondaryColor }}
        ></div>
        <div className="font- text-xs">{"Fill"}</div>
      </div>
      <div className="flex h-full flex-col items-center justify-between">
        <div className="grid h-fit grid-cols-10 gap-[4px] bg-white p-1">
          {paintTray}
        </div>
        <div className="text-xs text-slate-500">{"Colors"}</div>
      </div>
      <div
        className="flex h-full cursor-pointer flex-col items-center justify-center gap-1 rounded-sm px-2 py-1 hover:bg-icon-hover"
        onClick={handleColorPickerDiplay}
      >
        <div
          className="h-10 w-10 rounded-full border border-white bg-contain outline outline-1 outline-gray-500"
          style={{ backgroundImage: "url(/color-wheel.svg)" }}
        ></div>
        <div className="w-min text-center text-xs text-slate-500">
          {"Edit Colors"}
        </div>
        {/* 
  // @ts-ignore */}
        <color-picker></color-picker>
      </div>
    </div>
  );
}
