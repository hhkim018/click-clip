const ConfirmModal = ({ title, message, onConfirm, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        <div className="modal-message">{message}</div>
        <div className="modal-actions">
          <button type="button" className="modal-btn cancel" onClick={onClose}>
            취소
          </button>
          <button type="button" className="modal-btn confirm danger" onClick={onConfirm}>
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
