import { createDefaultCamera, type Camera } from "./camera"
import type { BoardObject, ObjectId } from "./objects"

export const BOARD_VERSION = 1 as const;

export type BoardVersion = Readonly<typeof BOARD_VERSION>;

export type BoardMeta = {
    id: string,
    name: string,
    createdAt: number,
    updatedAt: number
}

export type Board = {
    version: BoardVersion,
    meta: BoardMeta,

    objects: Record<ObjectId, BoardObject>,

    order: ObjectId[],

    camera: Camera,

    settings: {
        backgroundColor: string,
        showGrid: boolean,
        gridSize: number
    }
}

export function createEmptyBoard(): Board {
    const now = Date.now()

    return {
        version: BOARD_VERSION,
        meta: {
            id: crypto.randomUUID(),
            name: "Untitled Board",
            createdAt: now,
            updatedAt: now
        },
        objects: {},
        order: [],
        camera: createDefaultCamera(),
        settings: {
            backgroundColor: "#000000",
            showGrid: false,
            gridSize: 50
        }
    }
}