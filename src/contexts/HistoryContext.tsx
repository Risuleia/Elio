import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Board } from "../models/board";
import { createHistoryState, type HistoryCommand, type HistoryState } from "../models/history";

interface HistoryContextValue {
    state: HistoryState,
    canUndo: boolean,
    canRedo: boolean,
    execute: (cmd: HistoryCommand) => void,
    undo: () => void,
    redo: () => void,
    reset: (board: Board) => void
}

const HistoryContext = createContext<HistoryContextValue | null>(null)

export default function HistoryProvider({
    initialBoard,
    children
}: {
    initialBoard: Board,
    children: React.ReactNode
}) {
    const [state, setState] = useState<HistoryState>(() => createHistoryState(initialBoard))

    const execute = useCallback((cmd: HistoryCommand) => {
        setState(prev => {
            const nextBoard = cmd.do(prev.present)

            return {
                past: [...prev.past, cmd],
                present: nextBoard,
                future: []
            }
        })
    }, [])

    const undo = useCallback(() => {
        setState(prev => {
            if (prev.past.length < 1) return prev

            const last = prev.past[prev.past.length - 1]
            const newPast = prev.past.slice(0, -1)
            const reverted = last.undo(prev.present)

            return {
                past: newPast,
                present: reverted,
                future: [last, ...prev.future]
            }
        })
    }, [])

    const redo = useCallback(() => {
        setState(prev => {
            if (prev.future.length < 1) return prev

            const next = prev.future[0]
            const newFuture = prev.future.slice(1)
            const applied = next.do(prev.present)

            return {
                past: [...prev.past, next],
                present: applied,
                future: newFuture
            }
        })
    }, [])

    const reset = useCallback((board: Board) => setState(createHistoryState(board)), [])

    const value = useMemo<HistoryContextValue>(
        () => ({
            state,
            canUndo: state.past.length > 0,
            canRedo: state.future.length > 0,
            execute,
            undo,
            redo,
            reset
        }),
        [state, execute, undo, redo, reset]
    )

    return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export function useHistory() {
    const ctx = useContext(HistoryContext)
    if (!ctx) throw new Error("useHistory must be used within HistoryProvider")

    return ctx
}