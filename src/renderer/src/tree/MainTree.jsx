import React, { useState, useEffect } from 'react'
import { Tree } from 'react-arborist'
import NodeItem from './NodeItem'

const MainTree = () => {
  // ID autoIncrease
  const [data, setData] = useState([])
  useEffect(() => {
    const listener = () => {
      const fetchData = async () => {
        const siteInfos = await window.electron.ipcRenderer.invoke('get-site-info')
        const siteTree = []

        siteInfos.forEach((site) => {
          if (!site.parent_id) {
            siteTree.push({ id: String(site.id), name: site.name, children: [] }) // root 디렉토리 부분
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
        console.log(siteTree)
        setData(siteTree)
      }
      fetchData()
    }

    listener()
    window.electron.ipcRenderer.on('site-info-updated', listener)
    return () => window.electron.ipcRenderer.removeListener('site-info-updated', listener)
  }, [])

  const [menu, setMenu] = useState(null)

  function updateNodeData(nodes, id, newName) {
    return nodes.map((node) => {
      if (node.id === id) return { ...node, name: newName }
      if (node.children) return { ...node, children: updateNodeData(node.children, id, newName) }
      return node
    })
  }

  function onRename({ id, name }) {
    setData((prev) => {
      // TODO children객체 flat로 만들어서 비교하기

      const q = prev.map((val) => {
        const obj = {}

        console.log(obj)

        return { ...obj, ...val }
      })

      console.log(q)
      const a = updateNodeData(prev, id, name)
      const map = new Map(prev.map((item) => [item.id, item.name]))

      const b = a.filter((val) => {
        const isSameValue = map.get(val.id).name !== val.name
        return isSameValue
      })
      return a
    }) // 수정 후 데이터 업데이트하기
  }

  function onMove({ dragIds, parentId, index }) {
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

  return (
    <div onClick={() => setMenu(null)}>
      <Tree data={data} onRename={onRename} onMove={onMove}>
        {({ node, style, dragHandle }) => (
          <NodeItem node={node} style={style} setMenu={setMenu} dragHandle={dragHandle} />
        )}
      </Tree>
      {menu && (
        <div
          style={{
            position: 'fixed',
            top: menu.y,
            left: menu.x,
            background: 'white',
            border: '1px solid #444',
            borderRadius: 4,
            padding: 4,
            zIndex: 1000
          }}
        >
          <div style={{ padding: '4px 12px', cursor: 'pointer' }} onClick={handleRename}>
            이름 수정
          </div>
          {menu.node.data.url && (
            <div style={{ padding: '4px 12px', cursor: 'pointer' }} onClick={handleOpen}>
              이동
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MainTree
