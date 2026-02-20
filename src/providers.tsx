import type React from "react";
import { createEmptyBoard } from "./models/board";
import HistoryProvider from "./contexts/HistoryContext";
import BoardProvider from "./contexts/BoardContext";
import SelectionProvider from "./contexts/SelectionContext";
import ToolProvider from "./contexts/ToolContext";

export function AppProviders({ children } : { children: React.ReactNode }) {
    const initial = createEmptyBoard()

    return (
        <HistoryProvider initialBoard={initial}>
            <BoardProvider>
                <ToolProvider>
                    <SelectionProvider>
                        {children}
                    </SelectionProvider>
                </ToolProvider>
            </BoardProvider>
        </HistoryProvider>
    )
}