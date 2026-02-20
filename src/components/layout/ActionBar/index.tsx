import { useMemo } from 'react'
import './styles.css'
import type { Tool } from '../../../models/tool'
import IconButton from '../../ui/IconButton'
import { useTool } from '../../../contexts/ToolContext'
import Button from '../../ui/Button'

export default function ActionBar() {
  const { tool, setTool } = useTool()

  const toolOptions = useMemo<{ name: Tool, icon: string }[]>(() => [
    {
      name: "select",
      icon: "arrow_selector_tool"
    },
    {
      name: "pan",
      icon: "pan_tool"
    },
    {
      name: "rect",
      icon: "rectangle"
    },
    {
      name: "ellipse",
      icon: "circle"
    },
    {
      name: "line",
      icon: "diagonal_line"
    },
    {
      name: "arrow",
      icon: "north_east"
    },
    {
      name: "pen",
      icon: "stylus_fountain_pen"
    },
    {
      name: "text",
      icon: "text_fields"
    },
    {
      name: "image",
      icon: "image"
    }
  ], [])

  return (
    <div className="action-bar">
      {toolOptions.map((t, idx) => (
        <IconButton
          key={idx}
          icon={t.icon}
          behavior="toggle"
          active={tool.type == t.name}
          func={() => setTool({ type: t.name })}
        />
      ))}
      <span className='divider' />
      <Button
        text="Export"
        func={() => {}}
      />
    </div>
  )
}