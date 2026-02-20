import { useBoard } from "../../contexts/BoardContext";
import { useSelection } from "../../contexts/SelectionContext";
import { getObjectBounds } from "../../engine/bounds";

export default function CanvasOverlay() {
    const { board } = useBoard()
    const { selected } = useSelection()

    if (selected.size === 0) return null

    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity
    
    for (const id of selected) {
        const o = board.objects[id]
        if (!o) continue

        const b = getObjectBounds(o)
        minX = Math.min(minX, b.x)
        minY = Math.min(minY, b.y)
        maxX = Math.max(maxX, b.x + b.width)
        maxY = Math.max(maxY, b.y + b.height)
    }

    const cam = board.camera

    const x = (minX - cam.x) * cam.zoom
    const y = (minY - cam.y) * cam.zoom
    const w = (maxX - minX) * cam.zoom
    const h = (maxY - minY) * cam.zoom

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                height: h,
                border: "1px solid #3b82f6",
                pointerEvents: "none",
                zIndex: 10
            }}
        />
    )
}