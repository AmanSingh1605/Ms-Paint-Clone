//icon imports
import { BiPolygon } from "react-icons/bi";
import { BsTriangle } from "react-icons/bs";
import { FaSlash } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";
import { LuRectangleHorizontal } from "react-icons/lu";
import { PiPathFill, PiRectangle } from "react-icons/pi";

export enum ShapeTypes {
  Line = "Line",
  CurveLine = "CurveLine",
  Circle = "Circle",
  Rectangle = "Rectangle",
  RoundedRectangle = "Rounded Rectangle",
  Polygon = "Polygon",
  Triangle = "Triangle",
}

export const shapesList = [
  {
    name: ShapeTypes.Line,
    icon: <FaSlash />,
    disable: false,
  },
  {
    name: ShapeTypes.CurveLine,
    icon: <PiPathFill />,
    disable: true,
  },
  {
    name: ShapeTypes.Circle,
    icon: <FaRegCircle />,
    disable: false,
  },
  {
    name: ShapeTypes.Rectangle,
    icon: <PiRectangle />,
    disable: true,
  },
  {
    name: ShapeTypes.RoundedRectangle,
    icon: <LuRectangleHorizontal />,
    disable: true,
  },
  {
    name: ShapeTypes.Polygon,
    icon: <BiPolygon />,
    disable: true,
  },
  {
    name: ShapeTypes.Triangle,
    icon: <BsTriangle />,
    disable: true,
  },
];
