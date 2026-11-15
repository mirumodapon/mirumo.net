import { clsx } from 'clsx'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type { LayoutProps } from './LayoutProps'
import { PageMarquee } from './PageMarquee'

export const revealDelay = 2000
const pressSlop = 10

type Shown = false | 'mouse' | 'touch'

export function MarqueeReveal(props: LayoutProps) {
  const [shown, setShown] = useState<Shown>(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const press = useRef<{ x: number; y: number } | undefined>(undefined)
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (shown !== 'touch') return
    const onOutside = (event: globalThis.PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setShown(false)
    }
    document.addEventListener('pointerdown', onOutside)
    return () => document.removeEventListener('pointerdown', onOutside)
  }, [shown])

  const cancelPress = () => {
    clearTimeout(timer.current)
    press.current = undefined
  }

  const onEnter = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setShown('mouse'), revealDelay)
  }
  const onLeave = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    clearTimeout(timer.current)
    setShown(false)
  }
  const onDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch' || shown) return
    press.current = { x: event.clientX, y: event.clientY }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      press.current = undefined
      setShown('touch')
    }, revealDelay)
  }
  const onMove = (event: PointerEvent) => {
    const start = press.current
    if (!start) return
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > pressSlop) cancelPress()
  }

  return (
    <div
      ref={container}
      data-marquee-reveal
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={() => press.current && cancelPress()}
      onPointerCancel={cancelPress}
      onContextMenu={(event) => event.preventDefault()}
      className={clsx(
        'ac:fixed ac:inset-x-0 ac:top-0 ac:z-[105] ac:select-none ac:[-webkit-touch-callout:none]',
        shown
          ? 'ac:bg-surface/95 ac:px-4 ac:pt-6 ac:pb-4 ac:shadow-[0_2px_0_var(--ac-color-wall)]'
          : 'ac:h-10',
      )}
    >
      {shown && <PageMarquee {...props} />}
    </div>
  )
}
