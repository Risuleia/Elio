import type React from 'react'
import './styles.css'
import type { JSX } from 'react'

interface BaseProps {
    behavior: "toggle" | "action",
    active?: boolean,
    disabled?: boolean,
    func: () => void
}

interface IconProps extends BaseProps {
    icon: string,
    children?: never
}

interface ChildrenProps extends BaseProps {
    icon?: never,
    children: React.ReactNode
}

type IconButtonProps = IconProps | ChildrenProps

export function IconButton(props: IconProps): JSX.Element
export function IconButton(props: ChildrenProps): JSX.Element

export function IconButton({
    icon,
    children,
    behavior,
    disabled = false,
    active = false,
    func
}: IconButtonProps) {
  return (
    <button
        className='icon-btn'
        data-behavior={behavior}
        data-active={behavior == "toggle" ? active : false}
        onClick={(e) => {
            func()
            e.currentTarget.blur()
        }}
        disabled={disabled}
    >
        {icon ? (
            <span className="material-symbols-rounded">{icon}</span>
        ) : (
            children
        )}
    </button>
  )
}

export default IconButton