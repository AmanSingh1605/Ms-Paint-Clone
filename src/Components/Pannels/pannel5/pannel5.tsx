"use client";
import { MainContext } from "@/Contexts/mainContext";
import { useContext, useState } from "react";

export default function Pannel5() {
  const { primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor } =
    useContext(MainContext);
  const [colorType, setColorType] = useState("primary");

  const paintArray = [
    { color: "#000000", name: "Black" },
    { color: "#FFFFFF", name: "White" },
    { color: "#808080", name: "Gray" },
    { color: "#C0C0C0", name: "Silver" },
    { color: "#800000", name: "Maroon" },
    { color: "#FF0000", name: "Red" },
    { color: "#808000", name: "Olive" },
    { color: "#FFFF00", name: "Yellow" },
    { color: "#008000", name: "Dark Green" },
    { color: "#00FF00", name: "Green" },
    { color: "#008080", name: "Teal" },
    { color: "#00FFFF", name: "Cyan" },
    { color: "#000080", name: "Navy blue" },
    { color: "#0000FF", name: "Blue" },
    { color: "#800080", name: "Purple" },
    { color: "#FF00FF", name: "Magenta" },
    { color: "#FFD700", name: "Old Gold" },
    { color: "#FFFACD", name: "Lemon Yellow" },
    { color: "#708090", name: "Slate grey" },
    { color: "#008000", name: "Kelly green" },
    { color: "#99BADD", name: "Dark Carolina blue" },
    { color: "#7FFFD4", name: "Aquamarine" },
    { color: "#191970", name: "Midnight blue" },
    { color: "#CCCCFF", name: "Periwinkle" },
    { color: "#8A2BE2", name: "Violet-blue" },
    { color: "#FF6B53", name: "Coral" },
    { color: "#FF7518", name: "Pumpkin orange" },
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
