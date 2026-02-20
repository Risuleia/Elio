import CanvasOverlay from "../../canvas/CanvasOverlay";
import CanvasView from "../../canvas/CanvasView";

import './styles.css'

export default function Workspace() {
  return (
    <div className="workspace">
      <CanvasOverlay />
      <CanvasView />
    </div>
  )
}
