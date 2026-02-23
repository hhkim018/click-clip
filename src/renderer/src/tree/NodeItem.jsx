const NodeItem = ({ node, style, setMenu, dragHandle }) => {
  function handleContextMenu(e, node) {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, node })
  }

  function handleClick(node) {
    if (node.data.url) {
      window.electron.ipcRenderer.send('open-url', node.data.url)
    }
  }

  return (
    <div ref={dragHandle} style={style} onContextMenu={(e) => handleContextMenu(e, node)}>
      {node.isEditing ? (
        <input
          defaultValue={node.data.name}
          onBlur={(e) => node.submit(e.target.value)} // 변경된 데이터 저장까지
          onKeyDown={(e) => (e.key === 'Enter' ? e.target.blur() : '')}
          autoFocus
        />
      ) : (
        <span
          style={node && node.data.url ? { textDecoration: 'underline', cursor: 'pointer' } : {}}
          onClick={() => handleClick(node)}
        >
          {node.data.name}
          {node.children && node.children.length !== 0 ? `(${node.children.length})` : ''}
        </span>
      )}
    </div>
  )
}

export default NodeItem
