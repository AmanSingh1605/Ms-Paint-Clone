//icon imports
import { BiPolygon } from "react-icons/bi";
import { BsTriangle } from "react-icons/bs";
import { FaSlash } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";
import { LuRectangleHorizontal } from "react-icons/lu";
import { PiPathFill, PiRectangle } from "react-icons/pi";

//function imports
import { DrawLine } from "../Functions/drawLine";

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
    shapeFunction: DrawLine,
  },
  {
    name: ShapeTypes.CurveLine,
    icon: <PiPathFill />,
    disable: true,
    shapeFunction: null,
  },
  {
    name: ShapeTypes.Circle,
    icon: <FaRegCircle />,
    disable: true,
    shapeFunction: null,
  },
  {
    name: ShapeTypes.Rectangle,
    icon: <PiRectangle />,
    disable: true,
    shapeFunction: null,
  },
  {
    name: ShapeTypes.RoundedRectangle,
    icon: <LuRectangleHorizontal />,
    disable: true,
    shapeFunction: null,
  },
  {
    name: ShapeTypes.Polygon,
    icon: <BiPolygon />,
    disable: true,
    shapeFunction: null,
  },
  {
    name: ShapeTypes.Triangle,
    icon: <BsTriangle />,
    disable: true,
    shapeFunction: null,
  },
];
