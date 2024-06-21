"use client";
import DropDownBrushTypeMenu from "@/Components/DropDownMenu/dropDownBrushTypeMenu";
import { MainContext } from "@/Contexts/mainContext";
import Image from "next/image";
import { useContext, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

export default function Pannel6() {
  const [menuVisible, setMenuVisible] = useState(false);
  const {
    setCurrentTool,
    currentBrushType,
    setCurrentBrushType,
    setCurrentShapeTool,
    currentShapeTool,
  } = useContext(MainContext);

  // function setBrushActive()
  return (
    <div
      className={`h-full w-fit py-1 px-2 flex flex-col items-center justify-start rounded cursor-pointer ${
        currentBrushType.status
          ? " bg-tool-icon-active bg-icon-active"
          : "hover:bg-icon-hover"
      }`}
    >
      <div
        className="flex flex-col justify-start items-center"
        onClick={() => {
          setCurrentTool(null);
          setCurrentBrushType({ ...currentBrushType, status: true });
          setCurrentShapeTool({ ...currentShapeTool, status: false });
        }}
      >
        <Image
          src="/paint-brush.jpg"
          width={50}
          height={50}
          className="rounded mb-1"
          alt="brush"
        />
        <div className="text-sm">{"Brushes"}</div>
        <FaCaretDown
          className=""
          onClick={() => setMenuVisible(!menuVisible)}
        />
      </div>
      <div className="relative flex justify-center ">
        <DropDownBrushTypeMenu
          active={menuVisible}
          resetState={() => setMenuVisible(false)}
        />
      </div>
    </div>
  );
}
