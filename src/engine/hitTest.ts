import type { Board } from "../models/board";
import type { Vec2 } from "../models/geometry";
import { getObjectBounds, pointInAABB } from "./bounds";

export function hitTest(board: Board, world: Vec2): string | null {
    for (let i = board.order.length - 1; i >= 0; i--) {
        const id = board.order[i]
        const obj = board.objects[id]
        if (!obj || !obj.visible || obj.locked) continue

        const b = getObjectBounds(obj)
        if (pointInAABB(world.x, world.y, b)) return id
    }

    return null
}