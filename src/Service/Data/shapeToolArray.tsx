//icon imports
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

export enum ShapeTypes {
  Line = "Line",
  CurveLine = "CurveLine",
  Circle = "Circle",
  Rectangle = "Rectangle",
  RoundedRectangle = "Rounded Rectangle",
  Polygon = "Polygon",
  Triangle = "Triangle",
  RightTriangle = "Right Triangle",
  Diamond = "Diamond",
  Pentagon = "Pentagon",
  Hexagon = "Hexagon",
  RightArrow = "Right Arrow",
  LeftArrow = "Left Arrow",
  UpArrow = "Up Arrow",
  DownArrow = "Down Arrow",
  FourPointStar = "Four-Point Star",
  FivePointStar = "Five-Point Star",
  SixPointStar = "Six-Point Star",
  RoundedRectangularCallout = "Rounded Rectangular Callout",
  OvalCallout = "Oval Callout",
  Heart = "Heart",
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
    disable: false,
  },
  {
    name: ShapeTypes.RoundedRectangle,
    icon: <LuRectangleHorizontal />,
    disable: false,
  },
  {
    name: ShapeTypes.Polygon,
    icon: <BiPolygon />,
    disable: true,
  },
  {
    name: ShapeTypes.Triangle,
    icon: <BsTriangle />,
    disable: false,
  },
  {
    name: ShapeTypes.RightTriangle,
    icon: <LuTriangleRight />,
    disable: false,
  },
  {
    name: ShapeTypes.Diamond,
    icon: <GoDiamond />,
    disable: false,
  },
  {
    name: ShapeTypes.Pentagon,
    icon: <BsPentagon />,
    disable: false,
  },
  {
    name: ShapeTypes.Hexagon,
    icon: <BsHexagon />,
    disable: false,
  },
  {
    name: ShapeTypes.RightArrow,
    icon: <PiArrowFatRightLight />,
    disable: false,
  },
  {
    name: ShapeTypes.LeftArrow,
    icon: <PiArrowFatLeftLight />,
    disable: false,
  },
  {
    name: ShapeTypes.UpArrow,
    icon: <PiArrowFatUpLight />,
    disable: false,
  },
  {
    name: ShapeTypes.DownArrow,
    icon: <PiArrowFatDownLight />,
    disable: false,
  },
  {
    name: ShapeTypes.FourPointStar,
    icon: <PiStarFourThin />,
    disable: false,
  },
  {
    name: ShapeTypes.FivePointStar,
    icon: <PiStarLight />,
    disable: false,
  },
  {
    name: ShapeTypes.SixPointStar,
    icon: <TbJewishStar />,
    disable: false,
  },
  {
    name: ShapeTypes.RoundedRectangularCallout,
    icon: <BiMessage />,
    disable: true,
  },
  {
    name: ShapeTypes.OvalCallout,
    icon: <BiMessageRounded />,
    disable: true,
  },
  {
    name: ShapeTypes.Heart,
    icon: <CiHeart />,
    disable: true,
  },
];
