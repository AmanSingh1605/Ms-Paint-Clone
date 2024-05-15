"use client";
import { createContext, useState } from "react";

export const MainContext = createContext(null);

function MainContextProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [currentTool, setCurrentTool] = useState(null);
  const [brushWidth, setBrushWidth] = useState("2");
  const [currentBrushType, setCurrentBrushType] = useState({
    name: "Brush",
    value: "round",
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
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export function MainContextWrapper({ children }) {
  return <MainContextProvider>{children}</MainContextProvider>;
}
