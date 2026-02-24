import './styles.css'

export default function Button({
  text,
  func
}: {
  text: string,
  func: () => void
}) {
  return (
    <button
      className='btn'
      onClick={(e) => {
        func()
        e.currentTarget.blur()
      }}
    >
      {text}
    </button>
  )
}