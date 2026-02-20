import './styles.css'

export default function IconButton({
    icon,
    behavior,
    active = false,
    func
}: {
    icon: string,
    behavior: "toggle" | "action",
    active?: boolean,
    func: () => void
}) {
  return (
    <button
        className='icon-btn'
        data-behavior={behavior}
        data-active={behavior == "toggle" ? active : false}
        onClick={(e) => {
            func()
            e.currentTarget.blur()
        }}
    >
        <span className="material-symbols-rounded">
            {icon}
        </span>
    </button>
  )
}
