import React, { createContext, useContext, useMemo, useState } from "react";
import type { ObjectId } from "../models/objects";

interface SelectionContextValue {
    selected: Set<ObjectId>,
    isSelected: (id: ObjectId) => boolean,
    setSelection: (ids: Iterable<ObjectId>) => void,
    clear: () => void
}

const SelectionContext = createContext<SelectionContextValue | null>(null)

export default function SelectionProvider({ children }: { children: React.ReactNode }) {
    const [selected, setSelected] = useState<Set<ObjectId>>(new Set())

    const value = useMemo<SelectionContextValue>(
        () => ({
            selected,
            isSelected: (id) => selected.has(id),
            setSelection: (ids) => setSelected(new Set(ids)),
            clear: () => setSelected(new Set())
        }),
        [selected]
    )

    return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export function useSelection() {
    const ctx = useContext(SelectionContext)
    if (!ctx) throw new Error("useSelection must be used within SelectionContext")

    return ctx
}