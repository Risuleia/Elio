import React, { createContext, useContext, useMemo } from "react"
import type { Board } from "../models/board"
import type { Camera } from "../models/camera"
import type { BoardObject, ObjectId } from "../models/objects"
import { useHistory } from "./HistoryContext"
import type { HistoryCommand } from "../models/history"

interface BoardContextValue {
    board: Board,

    setCamera: (camera: Camera) => void,

    addObject: (obj: BoardObject) => void,
    updateObject: <T extends BoardObject["type"]>(
        id: ObjectId,
        patch: Partial<Omit<Extract<BoardObject, { type: T }>, "id" | "type">>
    ) => void,
    removeObject: (id: ObjectId) => void,

    setBoardSettings: (patch: Partial<Pick<Board, "settings">>) => void
}

const BoardContext = createContext<BoardContextValue | null>(null)

export default function BoardProvider({ children }: { children: React.ReactNode }) {
    const { state, execute } = useHistory()
    const board = state.present

    const setCamera = (camera: Camera) => {
        const prev = board.camera;
        const next = camera;

        const cmd: HistoryCommand = {
            id: crypto.randomUUID(),
            name: "Set Camera",
            timestamp: Date.now(),
            do: (b) => ({ ...b, camera: next }),
            undo: (b) => ({ ...b, camera: prev }),
        };

        execute(cmd)
    }

    const addObject = (obj: BoardObject) => {
        // const _prevBoard = board
        const cmd: HistoryCommand = {
            id: crypto.randomUUID(),
            name: "Add Object",
            timestamp: Date.now(),
            do: (b) => ({
                ...b,
                objects: { ...b.objects, [obj.id]: obj },
                order: [...b.order, obj.id],
                meta: { ...b.meta, updatedAt: Date.now() },
            }),
            undo: (b) => {
                const { [obj.id]: _, ...rest } = b.objects
                return {
                    ...b,
                    objects: rest,
                    order: b.order.filter((id) => id !== obj.id),
                    meta: { ...b.meta, updatedAt: Date.now() },
                }
            },
        }
        execute(cmd)
    }

    const updateObject = (id: ObjectId, patch: Partial<BoardObject>) => {
        const prev = board.objects[id]
        if (!prev) return

        const next = { ...prev, ...patch, updatedAt: Date.now() } as BoardObject

        const cmd: HistoryCommand = {
            id: crypto.randomUUID(),
            name: "Update Object",
            timestamp: Date.now(),
            do: (b) => ({
                ...b,
                objects: { ...b.objects, [id]: next },
                meta: { ...b.meta, updatedAt: Date.now() },
            }),
            undo: (b) => ({
                ...b,
                objects: { ...b.objects, [id]: prev },
                meta: { ...b.meta, updatedAt: Date.now() },
            }),
        }

        execute(cmd)
    }

    const removeObject = (id: ObjectId) => {
        const prev = board.objects[id]
        if (!prev) return
        const prevIndex = board.order.indexOf(id)

        const cmd: HistoryCommand = {
            id: crypto.randomUUID(),
            name: "Remove Object",
            timestamp: Date.now(),
            do: (b) => {
                const { [id]: _, ...rest } = b.objects
                return {
                    ...b,
                    objects: rest,
                    order: b.order.filter((x) => x !== id),
                    meta: { ...b.meta, updatedAt: Date.now() },
                }
            },
            undo: (b) => {
                const newOrder = [...b.order]
                if (prevIndex >= 0) newOrder.splice(prevIndex, 0, id)
                else newOrder.push(id)
                return {
                    ...b,
                    objects: { ...b.objects, [id]: prev },
                    order: newOrder,
                    meta: { ...b.meta, updatedAt: Date.now() },
                }
            },
        }

        execute(cmd)
    }

    const setBoardSettings = (patch: Partial<Pick<Board, "settings">>) => {
        const prev = board.settings
        const next = { ...prev, ...patch }

        const cmd: HistoryCommand = {
            id: crypto.randomUUID(),
            name: "Update Board Settings",
            timestamp: Date.now(),
            do: (b) => ({
                ...b,
                settings: next,
                meta: { ...b.meta, updatedAt: Date.now() },
            }),
            undo: (b) => ({
                ...b,
                settings: prev,
                meta: { ...b.meta, updatedAt: Date.now() },
            }),
        }

        execute(cmd)
    }

    
    // const testRect: RectObject = {
    //   id: crypto.randomUUID(),
    //   type: "rect",
    //   x: 100,
    //   y: 100,
    //   rotation: 0,
    //   zIndex: 0,
    //   opacity: 1,
    //   visible: true,
    //   locked: false,
    //   createdAt: Date.now(),
    //   updatedAt: Date.now(),
    //   width: 200,
    //   height: 120,
    //   fill: "#4f46e5",
    //   stroke: "#1f2937",
    //   strokeWidth: 2,
    //   cornerRadius: 12,
    // };
  
    // addObject(testRect)

    const value = useMemo<BoardContextValue>(
        () => ({
            board,
            setCamera,
            addObject,
            updateObject,
            removeObject,
            setBoardSettings
        }),
        [board]
    )

    return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}

export function useBoard() {
    const ctx = useContext(BoardContext)
    if (!ctx) throw new Error("useBoard must be used within HistoryProvider")

    return ctx
}