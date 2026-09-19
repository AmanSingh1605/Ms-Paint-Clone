"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ShapeTypes } from "@/lib/shapes/types";
import { BrushName, ToolName } from "@/lib/tools/names";

// Exactly one input mode is active at a time. A single discriminator makes
// that an invariant rather than something each panel has to maintain.
export type InputMode = "tool" | "brush" | "shape";

type ToolState = {
  mode: InputMode;
  tool: ToolName | null;
  shape: ShapeTypes | null;
  // Remembered across mode switches so the menu keeps its selection.
  brushType: BrushName;
  brushWidth: number;
};

export type ToolContextValue = ToolState & {
  // Null unless the matching mode is active.
  activeTool: ToolName | null;
  activeShape: ShapeTypes | null;
  isBrushActive: boolean;
  selectTool: (tool: ToolName) => void;
  selectShape: (shape: ShapeTypes) => void;
  selectBrush: () => void;
  setBrushType: (brushType: BrushName) => void;
  setBrushWidth: (width: number) => void;
};

const ToolContext = createContext<ToolContextValue | null>(null);

const INITIAL: ToolState = {
  mode: "brush",
  tool: null,
  shape: null,
  brushType: BrushName.Normal,
  brushWidth: 2,
};

export function ToolProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToolState>(INITIAL);

  const selectTool = useCallback(
    (tool: ToolName) => setState((s) => ({ ...s, mode: "tool", tool })),
    []
  );
  const selectShape = useCallback(
    (shape: ShapeTypes) => setState((s) => ({ ...s, mode: "shape", shape })),
    []
  );
  const selectBrush = useCallback(
    () => setState((s) => ({ ...s, mode: "brush" })),
    []
  );
  const setBrushType = useCallback(
    (brushType: BrushName) =>
      setState((s) => ({ ...s, mode: "brush", brushType })),
    []
  );
  const setBrushWidth = useCallback(
    (brushWidth: number) => setState((s) => ({ ...s, brushWidth })),
    []
  );

  const value = useMemo<ToolContextValue>(
    () => ({
      ...state,
      activeTool: state.mode === "tool" ? state.tool : null,
      activeShape: state.mode === "shape" ? state.shape : null,
      isBrushActive: state.mode === "brush",
      selectTool,
      selectShape,
      selectBrush,
      setBrushType,
      setBrushWidth,
    }),
    [state, selectTool, selectShape, selectBrush, setBrushType, setBrushWidth]
  );

  return <ToolContext.Provider value={value}>{children}</ToolContext.Provider>;
}

export function useTools() {
  const value = useContext(ToolContext);
  if (!value) throw new Error("useTools must be used inside <PaintProvider>");
  return value;
}
