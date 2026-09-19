"use client";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ColorContextValue = {
  // Stroke: brush strokes, shape outlines, text and bucket fill.
  primary: string;
  // Fill: the eraser's paper colour and the text background.
  secondary: string;
  setPrimary: (color: string) => void;
  setSecondary: (color: string) => void;
};

const ColorContext = createContext<ColorContextValue | null>(null);

export function ColorProvider({ children }: { children: ReactNode }) {
  const [primary, setPrimary] = useState("#000000ff");
  const [secondary, setSecondary] = useState("#ffffffff");

  const value = useMemo(
    () => ({ primary, secondary, setPrimary, setSecondary }),
    [primary, secondary]
  );

  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
}

export function useColors() {
  const value = useContext(ColorContext);
  if (!value) throw new Error("useColors must be used inside <PaintProvider>");
  return value;
}
