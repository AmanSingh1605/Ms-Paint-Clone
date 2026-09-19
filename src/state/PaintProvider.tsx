"use client";
import type { ReactNode } from "react";
import { ColorProvider } from "./ColorContext";
import { PaperProvider } from "./PaperContext";
import { ToolProvider } from "./ToolContext";

// Slices stay separate so resizing the paper does not re-render the palette.
export function PaintProvider({ children }: { children: ReactNode }) {
  return (
    <ColorProvider>
      <ToolProvider>
        <PaperProvider>{children}</PaperProvider>
      </ToolProvider>
    </ColorProvider>
  );
}
