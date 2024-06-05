"use client";
import DropDownBrushWidthMenu from "@/Components/DropDownMenu/dropDownBrushWidthMenu";
import Image from "next/image";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

export default function Pannel4() {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <div className="group relative px-2 h-full flex items-end">
      <div className="flex flex-col items-center">
        <Image src="/width-icon-topbar.svg" alt="width_icon" height={30} width={40} />
        <div className="text-sm ">{"Size"}</div>
        <FaCaretDown onClick={() => setMenuVisible(!menuVisible)} />
        <div className="relative flex justify-center">
          <DropDownBrushWidthMenu
            active={menuVisible}
            resetState={() => setMenuVisible(false)}
          />
        </div>
      </div>
    </div>
  );
}
