import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Tree } from 'react-arborist'
import NodeItem from './NodeItem'
import Header from '../components/Header'
import StatsBar from '../components/StatsBar'
import Modal from '../components/Modal'
import useContainerSize from '../hooks/useContainerSize'

const MainTree = () => {
  const [data, setData] = useState([])
  const [isListening, setIsListening] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [treeContainerRef, { width: treeWidth, height: treeHeight }] = useContainerSize()

  const [menu, setMenu] = useState(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const menuRef = useRef(null)
  const [detail, setDetail] = useState(null)
  const [detailPos, setDetailPos] = useState({ top: 0, left: 0 })
  const detailRef = useRef(null)

  useEffect(() => {
    const listener = () => {
      const fetchData = async () => {
        const siteInfos = await window.electron.ipcRenderer.invoke('get-site-info')
        const copySiteInfos = structuredClone(siteInfos)

        const siteTree = copySiteInfos
          .filter((site) => !site.parent_id)
          .map((site) => {
            return { id: String(site.id), name: site.name, children: [] }
          })

        copySiteInfos.forEach((site) => {
          const parent = copySiteInfos.filter((val) => String(val.id) === String(site.parent_id))

          if (parent.length === 0) return // 최상위 디렉토리

          if (!parent[0].children) {
            parent[0].children = []
          }

          parent[0].children.push({
            id: String(site.id),
            name: site.name,
            url: site.url,
            children: []
          })
        })

        siteTree.forEach((val) => {
          val.children = copySiteInfos.filter((copy) => val.id === String(copy.id))[0].children // TODO 2단계 디렉토리는 저굥ㅇ안되는문제발생
        })

        setData(siteTree)
      }
      fetchData()
    }

    listener()
    window.electron.ipcRenderer.on('site-info-updated', listener)
    return () => window.electron.ipcRenderer.removeListener('site-info-updated', listener)
  }, [])

  useLayoutEffect(() => {
    if (!menu || !menuRef.current) return
    const el = menuRef.current
    const { innerWidth, innerHeight } = window
    let top = menu.y
    let left = menu.x

    if (left + el.offsetWidth > innerWidth) {
      left = innerWidth - el.offsetWidth - 4
    }
    if (top + el.offsetHeight > innerHeight) {
      top = innerHeight - el.offsetHeight - 4
    }

    setMenuPos({ top, left })
  }, [menu])

  useLayoutEffect(() => {
    if (!detail || !detailRef.current) return
    const el = detailRef.current
    const { innerWidth, innerHeight } = window
    let top = detail.y
    let left = detail.x

    if (left + el.offsetWidth > innerWidth) {
      left = innerWidth - el.offsetWidth - 4
    }
    if (top + el.offsetHeight > innerHeight) {
      top = innerHeight - el.offsetHeight - 4
    }

    setDetailPos({ top, left })
  }, [detail])

  const domainCount = data.length
  const urlCount = data.reduce((sum, node) => sum + (node.children ? node.children.length : 0), 0)

  function updateNodeData(nodes, id, newName) {
    return nodes.map((node) => {
      if (node.id === id) return { ...node, name: newName }
      if (node.children) return { ...node, children: updateNodeData(node.children, id, newName) }
      return node
    })
  }

  function onRename({ id, name }) {
    if (name) {
      setData((prev) => {
        const newData = updateNodeData(prev, id, name)

        const newFlatData = toFlatData(newData)
        const prevFlatData = toFlatData(prev)

        const dimention2Array = prevFlatData.map((val) => [val.id, val.name])
        const map = new Map(dimention2Array)

        const result = newFlatData.filter((val) => map.get(val.id) !== val.name)

        if (result[0]) {
          window.electron.ipcRenderer.invoke('update-site-info-name', {
            id: Number(result[0].id),
            name: result[0].name
          })
        }

        return newData
      })
    }

    function toFlatData(datas) {
      return datas.flatMap((val) => [...val.children, { id: val.id, name: val.name }])
    }
  }

  function onMove({ dragIds, parentId, index }) {
    window.electron.ipcRenderer.invoke('update-parent-id', {
      ids: dragIds.map(Number),
      parentId: parentId ? Number(parentId) : null
    })
    setData((prev) => {
      let result = prev
      const nodesToMove = dragIds.map((id) => findNode(result, id))

      dragIds.forEach((id) => {
        result = removeNode(result, id)
      })
      nodesToMove.forEach((node, i) => {
        result = insertNode(result, parentId, index + i, node)
      })
      return result
    })
  }

  function findNode(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  function removeNode(nodes, id) {
    return nodes
      .filter((node) => node.id !== id)
      .map((node) => {
        if (node.children) return { ...node, children: removeNode(node.children, id) }
        return node
      })
  }

  function insertNode(nodes, parentId, index, nodeToInsert) {
    if (!parentId) {
      const result = [...nodes]
      result.splice(index, 0, nodeToInsert)
      return result
    }
    return nodes.map((node) => {
      if (node.id === parentId) {
        const children = [...(node.children || [])]
        children.splice(index, 0, nodeToInsert)
        return { ...node, children }
      }
      if (node.children)
        return { ...node, children: insertNode(node.children, parentId, index, nodeToInsert) }
      return node
    })
  }

  function handleRename() {
    menu.node.edit()
    setMenu(null)
  }

  function handleOpen() {
    if (menu.node.data.url) {
      window.electron.ipcRenderer.send('open-url', menu.node.data.url)
    }
    setMenu(null)
  }

  async function handleDelete() {
    const node = menu.node
    const ids = [Number(node.id)]
    if (node.children) {
      node.children.forEach((child) => ids.push(Number(child.id)))
    }
    await window.electron.ipcRenderer.invoke('delete-site-infos', { ids })
    setData((prev) => removeNode(prev, node.id))
    setMenu(null)
  }

  function handleDetail() {
    const url = new URL(menu.node.data.url)
    const params = []
    for (const [key, value] of url.searchParams) {
      params.push({ key, value })
    }
    setDetail({ x: menuPos.left, y: menuPos.top, pathname: url.pathname, params })
    setMenu(null)
  }

  async function handleAddDirectory(name) {
    await window.electron.ipcRenderer.invoke('insert-site-info', {
      parentId: null,
      name,
      url: null
    })
    const siteInfos = await window.electron.ipcRenderer.invoke('get-site-info')
    const siteTree = []
    siteInfos.forEach((site) => {
      if (!site.parent_id) {
        siteTree.push({ id: String(site.id), name: site.name, children: [] })
      } else {
        const parent = siteTree.filter((val) => val.id === String(site.parent_id))
        parent[0].children.push({
          id: String(site.id),
          name: site.name,
          url: site.url,
          children: []
        })
      }
    })
    setData(siteTree)
    setShowAddModal(false)
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      onClick={() => {
        setMenu(null)
        setDetail(null)
      }}
    >
      <Header onAdd={() => setShowAddModal(true)} />
      {/* TODO isListening 으로 기능 on/off 기능  */}
      <StatsBar domainCount={domainCount} urlCount={urlCount} isListening={isListening} />
      <div className="tree-container" ref={treeContainerRef}>
        <Tree
          data={data}
          onRename={onRename}
          onMove={onMove}
          rowHeight={36}
          indent={24}
          width={treeWidth}
          height={treeHeight}
        >
          {({ node, style, dragHandle }) => (
            <NodeItem node={node} style={style} setMenu={setMenu} dragHandle={dragHandle} />
          )}
        </Tree>
      </div>
      {menu && (
        <div
          className="context-menu"
          ref={menuRef}
          style={{ top: menuPos.top, left: menuPos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-menu-item" onClick={handleRename}>
            이름 수정
          </div>
          {menu.node.data.url && (
            <>
              <div className="context-menu-item" onClick={handleOpen}>
                이동
              </div>
              <div className="context-menu-item" onClick={handleDetail}>
                상세 정보
              </div>
            </>
          )}
          <div className="context-menu-item danger" onClick={handleDelete}>
            삭제
          </div>
        </div>
      )}
      {detail && (
        <div
          className="detail-popup"
          ref={detailRef}
          style={{ top: detailPos.top, left: detailPos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="detail-section">
            <div className="detail-label">경로</div>
            <div className="detail-value">{detail.pathname}</div>
          </div>
          {detail.params.length > 0 && (
            <div className="detail-section">
              <div className="detail-label">파라미터</div>
              {detail.params.map((p, i) => (
                <div key={i} className="detail-param">
                  <span className="detail-param-key">{p.key}</span>
                  <span className="detail-param-value">{p.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {showAddModal && (
        <Modal
          title="디렉토리 추가"
          placeholder="디렉토리 이름을 입력하세요"
          onSubmit={handleAddDirectory}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

export default MainTree
