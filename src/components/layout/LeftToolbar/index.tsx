import { useState } from 'react'
import { useHistory } from '../../../contexts/HistoryContext'
import IconButton from '../../ui/IconButton'
import './styles.css'

export default function LeftToolbar() {
  const [fullscreen, setFullscreen] = useState(false)
  const { undo, redo, canUndo, canRedo } = useHistory()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setFullscreen(true))
        .catch((e) => console.error(e))
    } else {
      document.exitFullscreen()
        .then(() => setFullscreen(false))
        .catch((e) => console.error(e))
    }
  }

  return (
    <div className="left-toolbar">
      <div>

        <IconButton
          behavior='action'
          func={() => {}}
        >
          <img
            src='/logoNeutral.svg'
            alt='logo'
            style={{
              width: "22px",
            }}
          />
        </IconButton>
        <span className="divider" />
        <IconButton
          icon='undo'
          behavior='action'
          disabled={!canUndo}
          func={() => undo()}
        />
        <IconButton
          icon='redo'
          behavior='action'
          disabled={!canRedo}
          func={() => redo()}
        />
        <span className="divider" />
      </div>
      <div>
        <span className="divider" />
        <IconButton
          icon='fit_page_width'
          behavior='action'
          func={() => {}}
        />
        <IconButton
          behavior='action'
          func={() => toggleFullscreen()}
        >
          <span className="material-symbols-rounded">
            {fullscreen ? "close_fullscreen" : "open_in_full"}
          </span>
        </IconButton>
        <span className="divider" />
        <IconButton
          icon='settings'
          behavior='action'
          func={() => {}}
        />
      </div>
    </div>
  )
}