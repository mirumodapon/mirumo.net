import { useRef, type CSSProperties, type PointerEvent } from 'react'

export type Tap = { time: number; x: number; y: number }

const maxInterval = 300
const maxDistance = 24

export function isDoubleTap(previous: Tap | undefined, next: Tap): boolean {
  if (!previous) return false
  const distance = Math.hypot(next.x - previous.x, next.y - previous.y)
  return next.time - previous.time <= maxInterval && distance <= maxDistance
}

const manipulation: CSSProperties = { touchAction: 'manipulation' }

export function useDoubleTap<T extends HTMLElement>(
  handler?: () => void,
): { onPointerUp?: (event: PointerEvent<T>) => void; style?: CSSProperties } {
  const last = useRef<Tap | undefined>(undefined)
  if (!handler) return {}
  return {
    style: manipulation,
    onPointerUp(event) {
      if (event.button !== 0) return
      const tap = { time: event.timeStamp, x: event.clientX, y: event.clientY }
      if (isDoubleTap(last.current, tap)) {
        last.current = undefined
        handler()
      } else {
        last.current = tap
      }
    },
  }
}
