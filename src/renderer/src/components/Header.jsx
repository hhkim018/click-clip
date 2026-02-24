import { ClipboardCheckIcon, PlusIcon, BroadcastIcon, TrashIcon } from './Icons'

const Header = ({ onAdd, onToggleListening, onClearAll }) => {
  return (
    <div className="header">
      <div className="header-title">
        <ClipboardCheckIcon size={20} />
        <span>clck-clip</span>
      </div>
      <div className="header-actions">
        <button title="추가" onClick={onAdd}>
          <PlusIcon size={18} />
        </button>
        <button title="클립보드 감시" onClick={onToggleListening}>
          <BroadcastIcon size={18} />
        </button>
        <button title="전체 삭제" onClick={onClearAll}>
          <TrashIcon size={18} />
        </button>
      </div>
    </div>
  )
}

export default Header
