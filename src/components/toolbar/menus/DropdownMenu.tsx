"use client";
import { useRef, type ReactNode } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

type MenuProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  // Widen past the button when the items need it.
  className?: string;
};

// Anchors to the bottom left of the nearest positioned ancestor.
export function DropdownMenu({
  open,
  onClose,
  children,
  className = "",
}: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(menuRef, onClose, open);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      className={`animate-dropdown absolute left-0 top-full z-50 mt-1.5 flex min-w-[10.5rem] origin-top flex-col gap-0.5 rounded-md border border-slate-400 bg-white p-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.18)] ${className}`}
    >
      {children}
    </div>
  );
}

type ItemProps = {
  selected?: boolean;
  onSelect: () => void;
  children: ReactNode;
  label?: string;
};

export function DropdownItem({
  selected,
  onSelect,
  children,
  label,
}: ItemProps) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      aria-label={label}
      onClick={onSelect}
      className={`flex w-full cursor-pointer items-center rounded border px-3 py-2 text-left text-[12px] leading-none transition-colors duration-150 ease-out active:bg-sky-200 ${
        selected
          ? "border-sky-400 bg-sky-100"
          : "border-transparent hover:border-sky-200 hover:bg-icon-hover"
      }`}
    >
      {children}
    </button>
  );
}
