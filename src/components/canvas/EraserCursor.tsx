"use client";
import { forwardRef } from "react";

export const EraserCursor = forwardRef<HTMLDivElement, { size: number }>(
  function EraserCursor({ size }, ref) {
    return (
      <div
        ref={ref}
        className="absolute hidden border border-black"
        style={{ height: size, width: size, pointerEvents: "none" }}
      />
    );
  }
);
