"use client";
import type { ReactNode } from "react";
import { FaCaretDown } from "react-icons/fa";

// Transparent borders reserve the active state's box, so selecting a button
// does not nudge its neighbours.
const BASE = "rounded border border-transparent";
const ACTIVE = "bg-tool-icon-color-active bg-tool-icon-active border-amber-300";
const HOVER = "hover:bg-icon-hover hover:border-sky-200";
const DISABLED = "text-slate-400";

type LargeProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  // Adds the split-button caret that opens a menu below.
  onCaret?: () => void;
  menu?: ReactNode;
};

export function LargeButton({
  icon,
  label,
  active,
  disabled,
  onClick,
  onCaret,
  menu,
}: LargeProps) {
  const state = disabled ? DISABLED : active ? ACTIVE : HOVER;

  return (
    <div className="relative flex w-16 flex-col items-center">
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        onClick={onClick}
        className={`${BASE} ${state} flex w-full flex-col items-center gap-0.5 px-1 py-1 ${
          disabled ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <span className="flex h-8 items-center justify-center text-[26px] leading-none">
          {icon}
        </span>
        <span className="flex items-center gap-0.5 text-[11px] leading-none">
          {label}
          {onCaret ? <FaCaretDown className="text-[9px]" /> : null}
        </span>
      </button>

      {onCaret ? (
        <button
          type="button"
          aria-label={`${label} options`}
          onClick={onCaret}
          className="absolute inset-x-0 bottom-0 h-4 cursor-pointer"
        />
      ) : null}

      {/* Anchor for the dropdown, which positions itself bottom left. */}
      {menu ? <div className="relative w-full">{menu}</div> : null}
    </div>
  );
}

type SmallProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function SmallButton({
  icon,
  label,
  active,
  disabled,
  onClick,
}: SmallProps) {
  const state = disabled ? DISABLED : active ? ACTIVE : HOVER;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`${BASE} ${state} flex w-full items-center gap-1.5 px-1.5 py-[3px] text-left text-[12px] leading-none ${
        disabled ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <span className="text-[13px]">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export function IconTile({
  icon,
  label,
  active,
  disabled,
  onClick,
}: SmallProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      title={label}
      className={`flex h-[26px] w-[26px] items-center justify-center border border-gray-400 text-[15px] ${
        disabled
          ? "cursor-default bg-white text-slate-400"
          : "cursor-pointer hover:bg-icon-hover"
      } ${
        active
          ? "bg-tool-icon-color-active bg-tool-icon-active"
          : "bg-tool-icon-color bg-tool-icon"
      }`}
    >
      {icon}
    </button>
  );
}
