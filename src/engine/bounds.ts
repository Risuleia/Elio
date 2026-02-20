import type { AABB } from "../models/geometry";
import type { BoardObject } from "../models/objects";

export function getObjectBounds(obj: BoardObject): AABB {
    switch (obj.type) {
        case "rect":
        case "ellipse":
        case "image":
            return { x: obj.x, y: obj.y, width: obj.width, height: obj.height }
        case "text":
            return { x: obj.x, y: obj.y, width: obj.width, height: obj.fontSize * 1.2 }
        case "line":
        case "arrow":
        case "pen": {
            const pts = obj.points
            if (pts.length === 0) return { x: obj.x, y: obj.y, width: 0, height: 0 }
            let minX = pts[0].x, minY = pts[0].y, maxX = pts[0].x, maxY = pts[0].y
            for (const p of pts) {
                minX = Math.min(minX, p.x)
                minY = Math.min(minY, p.y)
                maxX = Math.max(maxX, p.x)
                maxY = Math.max(maxY, p.y)
            }
            return { x: obj.x + minX, y: obj.y + minY, width: maxX - minX, height: maxY - minY }
        }
        default: {
            const _exhaustive: never = obj
            return _exhaustive
        }
    }
}

export function pointInAABB(x: number, y: number, b: AABB): boolean {
    return x >= b.x && y >= b.y && x <= b.x + b.width && y <= b.y + b.height
}