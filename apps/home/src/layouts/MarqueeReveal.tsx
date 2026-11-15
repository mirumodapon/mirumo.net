import { clsx } from 'clsx'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type { LayoutProps } from './LayoutProps'
import { PageMarquee } from './PageMarquee'

export const revealDelay = 2000

export function MarqueeReveal(props: LayoutProps) {
  const [shown, setShown] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const onEnter = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setShown(true), revealDelay)
  }
  const onLeave = () => {
    clearTimeout(timer.current)
    setShown(false)
  }

  return (
    <div
      data-marquee-reveal
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={clsx(
        'ac:fixed ac:inset-x-0 ac:top-0 ac:z-[105]',
        shown
          ? 'ac:bg-surface/95 ac:px-4 ac:pt-6 ac:pb-4 ac:shadow-[0_2px_0_var(--ac-color-wall)]'
          : 'ac:h-10',
      )}
    >
      {shown && <PageMarquee {...props} />}
    </div>
  )
}
