import React, { createContext, useContext, useMemo, useState } from "react";
import { DefaultTool, type ToolState } from "../models/tool";

interface ToolContextValue {
    tool: ToolState,
    setTool: (tool: ToolState) => void
}

const ToolContext = createContext<ToolContextValue | null>(null)

export default function ToolProvider({ children }: { children: React.ReactNode }) {
    const [tool, setTool] = useState<ToolState>(DefaultTool)

    const value = useMemo<ToolContextValue>(
        () => ({
            tool,
            setTool
        }),
        [tool]
    )

    return <ToolContext.Provider value={value}>{children}</ToolContext.Provider>
}

export function useTool() {
    const ctx = useContext(ToolContext)
    if (!ctx) throw new Error("useTool must be used within ToolContext")

    return ctx
}