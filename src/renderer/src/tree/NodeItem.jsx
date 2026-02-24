import { GlobeIcon, ExternalLinkIcon, ChevronDownIcon } from '../components/Icons'

const NodeItem = ({ node, style, setMenu, dragHandle }) => {
  const isParent = !node.data.url
  const isOpen = node.isOpen

  function handleContextMenu(e, node) {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, node })
  }

  function handleClick(node) {
    if (node.data.url) {
      window.electron.ipcRenderer.send('open-url', node.data.url)
    }
  }

  function handleToggle(e) {
    e.stopPropagation()
    node.toggle()
  }

  return (
    <div ref={dragHandle} style={style} onContextMenu={(e) => handleContextMenu(e, node)}>
      {node.isEditing ? (
        <div className="node-row">
          <input
            className="node-edit-input"
            defaultValue={node.data.name}
            onBlur={(e) => node.submit(e.target.value)}
            onKeyDown={(e) => (e.key === 'Enter' ? e.target.blur() : '')}
            autoFocus
          />
        </div>
      ) : (
        <div
          className={`node-row ${isParent ? 'parent-node' : ''}`}
          onClick={() => (isParent ? node.toggle() : handleClick(node))}
        >
          {isParent && (
            <span className={`node-chevron ${!isOpen ? 'collapsed' : ''}`} onClick={handleToggle}>
              <ChevronDownIcon size={14} />
            </span>
          )}
          <span className="node-icon">
            {isParent ? <GlobeIcon size={16} /> : <ExternalLinkIcon size={14} />}
          </span>
          <span className={`node-name ${isParent ? 'is-parent' : 'is-link'}`}>
            {node.data.name}
          </span>
          {isParent && node.children && node.children.length > 0 && (
            <span className="node-child-count">({node.children.length})</span>
          )}
        </div>
      )}
    </div>
  )
}

export default NodeItem
