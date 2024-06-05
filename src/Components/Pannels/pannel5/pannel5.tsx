"use client";
import { MainContext } from "@/Contexts/mainContext";
import { useContext, useState } from "react";

export default function Pannel5() {
  const { primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor } =
    useContext(MainContext);
  const [colorType, setColorType] = useState("primary");

  const paintArray = [
    { color: "#000000FF", name: "Black" },
    { color: "#FFFFFFFF", name: "White" },
    { color: "#808080FF", name: "Gray" },
    { color: "#C0C0C0FF", name: "Silver" },
    { color: "#800000FF", name: "Maroon" },
    { color: "#FF0000FF", name: "Red" },
    { color: "#808000FF", name: "Olive" },
    { color: "#FFFF00FF", name: "Yellow" },
    { color: "#008000FF", name: "Dark Green" },
    { color: "#00FF00FF", name: "Green" },
    { color: "#008080FF", name: "Teal" },
    { color: "#00FFFFFF", name: "Cyan" },
    { color: "#000080FF", name: "Navy blue" },
    { color: "#0000FFFF", name: "Blue" },
    { color: "#800080FF", name: "Purple" },
    { color: "#FF00FFFF", name: "Magenta" },
    { color: "#FFD700FF", name: "Old Gold" },
    { color: "#FFFACDFF", name: "Lemon Yellow" },
    { color: "#708090FF", name: "Slate grey" },
    { color: "#008000FF", name: "Kelly green" },
    { color: "#99BADDFF", name: "Dark Carolina blue" },
    { color: "#7FFFD4FF", name: "Aquamarine" },
    { color: "#191970FF", name: "Midnight blue" },
    { color: "#CCCCFFFF", name: "Periwinkle" },
    { color: "#8A2BE2FF", name: "Violet-blue" },
    { color: "#FF6B53FF", name: "Coral" },
    { color: "#FF7518FF", name: "Pumpkin orange" },
  ];

  const handlePaintColor = (value: string) => {
    if (colorType == "primary") setPrimaryColor(value);
    else setSecondaryColor(value);
  };

  const paintTray = paintArray.map((item, index) => {
    return (
      <div
        className="relative group h-4 w-4 border-2 cursor-pointer"
        key={index}
        style={{ backgroundColor: item.color }}
        onClick={() => handlePaintColor(item.color)}
      ></div>
    );
  });

  return (
    <div className="flex gap-2 px-2 h-full items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-2">
        <div
          className={`h-10 w-10 border border-white outline-black ${
            colorType === "primary" ? "outline" : ""
          }`}
          onClick={() => setColorType("primary")}
          style={{ backgroundColor: primaryColor }}
        ></div>
        <div className="text-xs ">{"Primary"}</div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <div
          className={`h-10 w-10 border border-white outline-black ${
            colorType === "secondary" ? "outline" : ""
          }`}
          onClick={() => setColorType("secondary")}
          style={{ backgroundColor: secondaryColor }}
        ></div>
        <div className="text-xs ">{"Secondary"}</div>
      </div>
      <div className="grid gap-1 grid-cols-12">{paintTray}</div>
    </div>
  );
}
