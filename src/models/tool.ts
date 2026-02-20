export type Tool = 
    | "select"
    | "pan"
    | "pen"
    | "rect"
    | "ellipse"
    | "line"
    | "arrow"
    | "text"
    | "image"

export type ToolState = { type: Tool }

export const DefaultTool: ToolState = { type: "select" }