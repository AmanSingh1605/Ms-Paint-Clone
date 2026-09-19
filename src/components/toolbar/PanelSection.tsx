"use client";
import type { ReactNode } from "react";

// A ribbon group. Captions share a baseline so the groups line up.
export function PanelSection({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex h-full w-fit flex-col px-2 ${className}`}>
      <div className="flex flex-1 items-center justify-center gap-1">
        {children}
      </div>
      <div className="pt-0.5 text-center text-[11px] leading-none text-slate-600">
        {label}
      </div>
    </div>
  );
}
