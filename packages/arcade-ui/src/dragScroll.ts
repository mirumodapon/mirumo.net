import { useRef, type MouseEvent, type PointerEvent, type WheelEvent } from 'react'

const threshold = 4

export function isDrag(distance: number): boolean {
  return Math.abs(distance) > threshold
}

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  return {
    ref,
    onPointerDown(event: PointerEvent<T>) {
      if (event.pointerType !== 'mouse' || event.button !== 0 || !ref.current) return
      drag.current = { x: event.clientX, left: ref.current.scrollLeft, moved: false }
    },
    onPointerMove(event: PointerEvent<T>) {
      const state = drag.current
      const node = ref.current
      if (!state || !node) return
      const distance = event.clientX - state.x
      if (!state.moved && !isDrag(distance)) return
      if (!state.moved) {
        state.moved = true
        node.setPointerCapture(event.pointerId)
      }
      node.scrollLeft = state.left - distance
    },
    onPointerUp() {
      if (drag.current && !drag.current.moved) drag.current = null
    },
    onClickCapture(event: MouseEvent<T>) {
      if (drag.current?.moved) {
        event.preventDefault()
        event.stopPropagation()
      }
      drag.current = null
    },
    onWheel(event: WheelEvent<T>) {
      const node = ref.current
      if (!node || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      node.scrollLeft += event.deltaY
    },
  }
}
