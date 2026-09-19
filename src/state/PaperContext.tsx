"use client";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Size } from "@/lib/canvas/bounds";

export type PaperContextValue = {
  // Canvas size in pixels. Overlays clamp themselves to it.
  size: Size;
  setSize: (size: Size) => void;
};

const PaperContext = createContext<PaperContextValue | null>(null);

export function PaperProvider({ children }: { children: ReactNode }) {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const value = useMemo(() => ({ size, setSize }), [size]);

  return (
    <PaperContext.Provider value={value}>{children}</PaperContext.Provider>
  );
}

export function usePaper() {
  const value = useContext(PaperContext);
  if (!value) throw new Error("usePaper must be used inside <PaintProvider>");
  return value;
}
