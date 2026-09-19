import type { ReactNode } from "react";
import { BiMessage, BiMessageRounded, BiPolygon } from "react-icons/bi";
import { BsHexagon, BsPentagon, BsTriangle } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { FaSlash } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";
import { GoDiamond } from "react-icons/go";
import { LuRectangleHorizontal, LuTriangleRight } from "react-icons/lu";
import {
  PiArrowFatDownLight,
  PiArrowFatLeftLight,
  PiArrowFatRightLight,
  PiArrowFatUpLight,
  PiPathFill,
  PiRectangle,
  PiStarFourThin,
  PiStarLight,
} from "react-icons/pi";
import { TbJewishStar } from "react-icons/tb";
import { shapeGeometry } from "@/lib/shapes/geometry";
import { ShapeTypes } from "@/lib/shapes/types";

export type ShapeCatalogEntry = {
  name: ShapeTypes;
  icon: ReactNode;
  disabled: boolean;
};

const ICONS: Record<ShapeTypes, ReactNode> = {
  [ShapeTypes.Line]: <FaSlash />,
  [ShapeTypes.CurveLine]: <PiPathFill />,
  [ShapeTypes.Circle]: <FaRegCircle />,
  [ShapeTypes.Rectangle]: <PiRectangle />,
  [ShapeTypes.RoundedRectangle]: <LuRectangleHorizontal />,
  [ShapeTypes.Polygon]: <BiPolygon />,
  [ShapeTypes.Triangle]: <BsTriangle />,
  [ShapeTypes.RightTriangle]: <LuTriangleRight />,
  [ShapeTypes.Diamond]: <GoDiamond />,
  [ShapeTypes.Pentagon]: <BsPentagon />,
  [ShapeTypes.Hexagon]: <BsHexagon />,
  [ShapeTypes.RightArrow]: <PiArrowFatRightLight />,
  [ShapeTypes.LeftArrow]: <PiArrowFatLeftLight />,
  [ShapeTypes.UpArrow]: <PiArrowFatUpLight />,
  [ShapeTypes.DownArrow]: <PiArrowFatDownLight />,
  [ShapeTypes.FourPointStar]: <PiStarFourThin />,
  [ShapeTypes.FivePointStar]: <PiStarLight />,
  [ShapeTypes.SixPointStar]: <TbJewishStar />,
  [ShapeTypes.RoundedRectangularCallout]: <BiMessage />,
  [ShapeTypes.OvalCallout]: <BiMessageRounded />,
  [ShapeTypes.Heart]: <CiHeart />,
};

// Availability comes from the geometry table, so adding geometry for a shape
// is all it takes to enable it.
export const SHAPE_CATALOG: ShapeCatalogEntry[] = Object.values(ShapeTypes).map(
  (name) => ({
    name,
    icon: ICONS[name],
    disabled: !shapeGeometry[name],
  })
);
