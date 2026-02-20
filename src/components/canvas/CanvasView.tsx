import { useEffect, useRef, useState } from "react"
import { type Camera } from "../../models/camera"
import { useBoard } from "../../contexts/BoardContext"
import type { Vec2 } from "../../models/geometry"
import { renderScene } from "../../engine/renderer"

export default function CanvasView() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const { board, setCamera } = useBoard()
  const camera = board.camera

  const [isPanning, setIsPanning] = useState<boolean>(false)
  const lastPos = useRef<Vec2 | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const resize = () => {
      const parent = canvas.parentElement!
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight

      draw()
    }

    resize()

    window.addEventListener("resized", resize)

    return () => window.removeEventListener("resize", resize)
  }, [])

  useEffect(() => {
    draw()
  }, [board])

  const draw = () => {
    const canvas = canvasRef.current!
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    renderScene(ctx, board, { width: canvas.width, height: canvas.height })
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.ctrlKey) {
      setIsPanning(true)
      lastPos.current = { x: e.clientX, y: e.clientY }
    }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !lastPos.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }

    setCamera({
      ...camera,
      x: camera.x - dx / camera.zoom,
      y: camera.y - dy / camera.zoom,
    })
  }

  const onMouseUp = () => {
    setIsPanning(false)
    lastPos.current = null
  }
  
  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return

    const onWheelNative = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault()
      handleWheel(e)
    }

    canvas.addEventListener("wheel", onWheelNative, { passive: false })

    return () => canvas.removeEventListener("wheel", onWheelNative)
  }, [camera])

  const handleWheel = (e: WheelEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    if (e.ctrlKey) {
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9
      const newZoom = Math.min(8, Math.max(0.1, camera.zoom * zoomFactor))

      // World position under cursor BEFORE zoom
      const wx = mx / camera.zoom + camera.x
      const wy = my / camera.zoom + camera.y

      // Adjust camera so that (wx, wy) stays under cursor
      const nextCamera: Camera = {
        zoom: newZoom,
        x: wx - mx / newZoom,
        y: wy - my / newZoom,
      }

      setCamera(nextCamera)
      return
    }

    const panSpeed = 10

    const dx = e.shiftKey ? e.deltaY : e.deltaX
    const dy = e.shiftKey ? 0 : e.deltaY

    setCamera({
      ...camera,
      x: camera.x - (dx * panSpeed) / camera.zoom,
      y: camera.y - (dy * panSpeed) / camera.zoom
    })
  }

  return (
    <canvas
      ref={canvasRef}
      className="canvas"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    />
  )
}
