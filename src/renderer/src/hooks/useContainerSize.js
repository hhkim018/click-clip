import { useState, useRef, useEffect, useCallback } from 'react'

export default function useContainerSize() {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const updateSize = useCallback(() => {
    if (ref.current) {
      setSize({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight
      })
    }
  }, [])

  useEffect(() => {
    updateSize()

    const observer = new ResizeObserver(updateSize)
    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [updateSize])

  return [ref, size]
}
