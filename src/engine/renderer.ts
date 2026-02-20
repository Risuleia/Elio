import type { Board } from "../models/board"
import type { Camera } from "../models/camera"
import type { RectObject, EllipseObject, LineObject, ArrowObject, PenObject, TextObject, ImageObject, BoardObject } from "../models/objects"

export type RenderOptions = {
    showGrid?: boolean
}

export function renderScene(
    ctx: CanvasRenderingContext2D,
    board: Board,
    viewport: { width: number, height: number },
    options: RenderOptions = {}
) {
    const { width, height } = viewport

    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.fillStyle = board.settings.backgroundColor || "#00000000"
    ctx.fillRect(0, 0, width, height)
    ctx.restore()

    ctx.save()
    applyCameraTransform(ctx, board.camera)

    if (options.showGrid ?? board.settings.showGrid) {
        drawGrid(ctx, board.camera, width, height, board.settings.gridSize)
    }

    for (const id of board.order) {
        const obj = board.objects[id]
        if (!obj || !obj.visible) continue

        drawObject(ctx, obj)
    }

    ctx.restore()
}

function applyCameraTransform(ctx: CanvasRenderingContext2D, cam: Camera) {
    ctx.translate(-cam.x * cam.zoom, -cam.y * cam.zoom)
    ctx.scale(cam.zoom, cam.zoom)
}

function drawGrid(
    ctx: CanvasRenderingContext2D,
    cam: Camera,
    width: number,
    height: number,
    gridSize: number
) {
    const startX = Math.floor(cam.x / gridSize) * gridSize
    const startY = Math.floor(cam.y / gridSize) * gridSize
    const endX = cam.x + width / cam.zoom
    const endY = cam.y + height / cam.zoom

    ctx.save()

    ctx.strokeStyle = "#ffffff11"
    ctx.lineWidth = 1 / cam.zoom

    for (let x = startX; x < endX; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, startY)
        ctx.lineTo(x, endY)
        ctx.stroke()
    }

    for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(startX, y)
        ctx.lineTo(endX, y)
        ctx.stroke()
    }

    ctx.restore()
}

function drawObject(ctx: CanvasRenderingContext2D, obj: BoardObject) {
    ctx.save()

    ctx.translate(obj.x, obj.y)
    if (obj.rotation !== 0) ctx.rotate(obj.rotation)
    ctx.globalAlpha = obj.opacity ?? 1

    switch (obj.type) {
        case "rect":
            drawRect(ctx, obj)
            break
        case "ellipse":
            drawEllipse(ctx, obj)
            break
        case "line":
            drawLine(ctx, obj)
            break
        case "arrow":
            drawArrow(ctx, obj)
            break
        case "pen":
            drawPen(ctx, obj)
            break
        case "text":
            drawText(ctx, obj)
            break
        case "image":
            drawImage(ctx, obj)
            break
        default:
            const _exhaustive: never = obj
            return _exhaustive
    }

    ctx.restore()
}

function drawRect(ctx: CanvasRenderingContext2D, o: RectObject) {
  const { width, height, fill, stroke, strokeWidth, cornerRadius } = o;

  ctx.beginPath();
  if (cornerRadius > 0) {
    const r = Math.min(cornerRadius, width / 2, height / 2);
    roundedRectPath(ctx, 0, 0, width, height, r);
  } else {
    ctx.rect(0, 0, width, height);
  }

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke && strokeWidth > 0) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

function drawEllipse(ctx: CanvasRenderingContext2D, o: EllipseObject) {
  const { width, height, fill, stroke, strokeWidth } = o;

  ctx.beginPath();
  ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke && strokeWidth > 0) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

function drawLine(ctx: CanvasRenderingContext2D, o: LineObject) {
  if (o.points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(o.points[0].x, o.points[0].y);
  for (let i = 1; i < o.points.length; i++) {
    ctx.lineTo(o.points[i].x, o.points[i].y);
  }
  ctx.strokeStyle = o.stroke || "#00000000";
  ctx.lineWidth = o.strokeWidth;
  ctx.stroke();
}

function drawArrow(ctx: CanvasRenderingContext2D, o: ArrowObject) {
  // Draw shaft like a line
  if (o.points.length < 2) return;
  drawLine(ctx, o as unknown as LineObject);

  // Draw simple arrow head at last segment
  const p0 = o.points[o.points.length - 2];
  const p1 = o.points[o.points.length - 1];
  const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  const size = 10;

  ctx.save();
  ctx.translate(p1.x, p1.y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-size, size / 2);
  ctx.lineTo(-size, -size / 2);
  ctx.closePath();
  ctx.fillStyle = o.stroke  || "#00000000";
  ctx.fill();
  ctx.restore();
}

function drawPen(ctx: CanvasRenderingContext2D, o: PenObject) {
  if (o.points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(o.points[0].x, o.points[0].y);
  for (let i = 1; i < o.points.length; i++) {
    ctx.lineTo(o.points[i].x, o.points[i].y);
  }
  ctx.strokeStyle = o.stroke  || "#00000000";
  ctx.lineWidth = o.strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

function drawText(ctx: CanvasRenderingContext2D, o: TextObject) {
  ctx.fillStyle = o.color;
  ctx.textAlign = o.align;
  ctx.textBaseline = "top";
  ctx.font = `${o.fontWeight} ${o.fontSize}px ${o.fontFamily}`;

  // Simple single-line for now; wrapping later
  ctx.fillText(o.text, 0, 0, o.width);
}

function drawImage(ctx: CanvasRenderingContext2D, o: ImageObject) {
  const img = new Image();
  img.src = o.src;
  // Draw when loaded; for now naive (you can cache later)
  if (img.complete) {
    ctx.drawImage(img, 0, 0, o.width, o.height);
  } else {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, o.width, o.height);
    };
  }
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}
