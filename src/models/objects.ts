import type { Color, Vec2 } from "./geometry"

export type ObjectId = string

export type BaseObject = {
    id: ObjectId,
    type: BoardObjectType,

    x: number,
    y: number,
    rotation: number,

    zIndex: number,
    opacity: number,
    visible: boolean,
    locked: boolean,

    createdAt: number,
    updatedAt: number
}

export type BoardObjectType = 
    | "rect"
    | "ellipse"
    | "line"
    | "arrow"
    | "pen"
    | "text"
    | "image"

export type RectObject = BaseObject & {
    type: "rect",
    width: number,
    height: number,
    fill: Color | null,
    stroke: Color | null,
    strokeWidth: number,
    cornerRadius: number
}

export type EllipseObject = BaseObject & {
  type: "ellipse",
  width: number,
  height: number,
  fill: Color | null,
  stroke: Color | null,
  strokeWidth: number,
}

export type LineObject = BaseObject & {
  type: "line",
  points: Vec2[],
  stroke: Color | null,
  strokeWidth: number,
}

export type ArrowObject = BaseObject & {
  type: "arrow",
  points: Vec2[],
  stroke: Color | null,
  strokeWidth: number,
}

export type PenObject = BaseObject & {
  type: "pen",
  points: Vec2[],
  stroke: Color | null,
  strokeWidth: number,
}

export type TextObject = BaseObject & {
  type: "text",
  text: string,
  fontFamily: string,
  fontSize: number,
  fontWeight: number | "normal" | "bold",
  color: Color,
  align: "left" | "center" | "right",
  width: number,
}

export type ImageObject = BaseObject & {
  type: "image",
  width: number,
  height: number,
  src: string,
}

export type BoardObject = 
    | RectObject
    | EllipseObject
    | LineObject
    | ArrowObject
    | PenObject
    | TextObject
    | ImageObject