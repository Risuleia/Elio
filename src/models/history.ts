import type { Board } from "./board";

export interface HistoryCommand {
    id: string,
    name: string,
    timestamp: number,

    do(board: Board): Board,
    undo(board: Board): Board
}

export type HistoryState = {
    past: HistoryCommand[],
    present: Board,
    future: HistoryCommand[]
}

export function createHistoryState(initial: Board): HistoryState {
    return {
        past: [],
        present: initial,
        future: []
    }
}