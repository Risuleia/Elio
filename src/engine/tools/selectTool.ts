import type { Board } from "../../models/board"
import type { Vec2 } from "../../models/geometry"
import type { HistoryCommand } from "../../models/history"
import type { ObjectId } from "../../models/objects"
import { hitTest } from "../hitTest"

export type SelectToolState = {
    dragging: boolean,
    dragStartWorld: Vec2 | null,
    originalPositions: Map<ObjectId, Vec2> | null
}

export function createSelectToolState(): SelectToolState {
    return { dragging: false, dragStartWorld: null, originalPositions: null }
}

export function onPointerDown(
    board: Board,
    world: Vec2,
    selected: Set<ObjectId>,
    setSelection: (ids: Iterable<ObjectId>) => void,
    state: SelectToolState
) {
    const hit = hitTest(board, world)
    if (hit) {
        if (!selected.has(hit)) {
            setSelection([hit])
        }

        state.dragging = true
        state.dragStartWorld = world
        state.originalPositions = new Map()

        for (const id of (selected.size ? selected : new Set([hit]))) {
            const o = board.objects[id]
            if (o) state.originalPositions.set(id, { x: o.x, y: o.y })
        }
    } else {
        setSelection([])
    }
}

export function onPointerMove(
    _board: Board,
    world: Vec2,
    state: SelectToolState,
    setTempPositions: (updates: Map<ObjectId, Vec2>) => void
) {
    if (!state.dragging || !state.dragStartWorld || !state.originalPositions) return

    const dx = world.x - state.dragStartWorld.x
    const dy = world.y - state.dragStartWorld.y

    const updates = new Map<ObjectId, Vec2>()
    for (const [id, pos] of state.originalPositions.entries()) {
        updates.set(id, { x: pos.x + dx, y: pos.y + dy })
    }

    setTempPositions(updates)
}

export function onPointerUp(
    _board: Board,
    state: SelectToolState,
    tempPositions: Map<ObjectId, Vec2> | null,
    commit: (cmd: HistoryCommand) => void
) {
    if (!state.dragging || !state.originalPositions || !tempPositions) {
        state.dragging = false
        state.dragStartWorld = null
        state.originalPositions = null

        return
    }

    const before = new Map(state.originalPositions)
    const after = new Map(tempPositions)

    const cmd: HistoryCommand = {
        id: crypto.randomUUID(),
        name: "Move Selection",
        timestamp: Date.now(),
        do: (b) => {
            const objects = { ...b.objects }
            for (const [id, p] of after.entries()) {
                const o = objects[id]
                if (o) objects[id] = { ...o, x: p.x, y: p.y, updatedAt: Date.now() }
            }
            return { ...b, objects }
        },
        undo: (b) => {
            const objects = { ...b.objects }
            for (const [id, p] of before.entries()) {
                const o = objects[id]
                if (o) objects[id] = { ...o, x: p.x, y: p.y, updatedAt: Date.now() }
            }
            return { ...b, objects }
        },
    }

    commit(cmd)

    state.dragging = false
    state.dragStartWorld = null
    state.originalPositions = null
}