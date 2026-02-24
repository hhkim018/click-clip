import { useState, useEffect, useRef } from 'react'

const Modal = ({ title, placeholder, onSubmit, onClose }) => {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      onSubmit(trimmed)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="modal-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="modal-actions">
            <button type="button" className="modal-btn cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="modal-btn confirm" disabled={!value.trim()}>
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
