"use client";
import DropDownBrushTypeMenu from "@/Components/DropDownMenu/dropDownBrushTypeMenu";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { PiPaintBrushDuotone } from "react-icons/pi";

export default function Pannel6() {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <div className="h-full w-fit px-2 py-2 items-end justify-center">
      <div className="flex flex-col justify-center items-center">
        <PiPaintBrushDuotone className="border-2 border-white rounded bg-white h-full w-full p-2" />
        <div className="text-sm">{"Brushes"}</div>
        <FaCaretDown onClick={() => setMenuVisible(!menuVisible)} />
        <div className="relative flex justify-center ">
          <DropDownBrushTypeMenu
            active={menuVisible}
            resetState={() => setMenuVisible(false)}
          />
        </div>
      </div>
    </div>
  );
}
