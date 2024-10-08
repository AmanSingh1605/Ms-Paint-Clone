"use client";
import { createContext, useState } from "react";

export const MainContext = createContext(null);

function MainContextProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState("#000000ff");
  const [secondaryColor, setSecondaryColor] = useState("#ffffffff");
  const [currentTool, setCurrentTool] = useState(null);
  const [brushWidth, setBrushWidth] = useState("2");
  const [currentBrushType, setCurrentBrushType] = useState({
    name: "Normal Brush",
    value: "round",
    status: true,
  });

  const [currentShapeTool, setCurrentShapeTool] = useState({
    name: null,
    icon: null,
    disable: true,
    status: false,
  });

  const [paperDimensions, setPaperDimensions] = useState({
    height: 0,
    width: 0,
    boundingArea: { top: 0, left: 0 },
  });

  return (
    <MainContext.Provider
      value={{
        primaryColor,
        secondaryColor,
        setSecondaryColor,
        setPrimaryColor,
        brushWidth,
        setBrushWidth,
        currentTool,
        setCurrentTool,
        currentBrushType,
        setCurrentBrushType,
        paperDimensions,
        setPaperDimensions,
        currentShapeTool,
        setCurrentShapeTool,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export function MainContextWrapper({ children }) {
  return <MainContextProvider>{children}</MainContextProvider>;
}
