import { clsx } from 'clsx'
import { useEffect, useRef, useState, type ComponentProps, type CSSProperties } from 'react'
import { AcIcon } from './AcIcon'

export type AcPelletBarGlyph = { icon: string; src?: never } | { src: string; icon?: never }

export type AcPelletBarProps = Omit<ComponentProps<'div'>, 'children'> & {
  value: number
  max?: number
  pellet?: AcPelletBarGlyph
  marker?: AcPelletBarGlyph
}

const slotWidth = 18

const bar = 'ac:relative ac:h-2.5'

const track = clsx(
  'ac:absolute ac:inset-0 ac:flex ac:items-center ac:overflow-hidden',
  'ac:[clip-path:inset(0_0_0_var(--ac-pellet-progress))]',
  'ac:transition-[clip-path] ac:duration-500 ac:motion-reduce:transition-none',
)

const slot = 'ac:flex ac:h-full ac:w-[18px] ac:flex-none ac:items-center ac:justify-center'

const markerSlot = clsx(
  'ac:absolute ac:top-1/2 ac:left-(--ac-pellet-progress) ac:flex ac:-translate-1/2 ac:items-center ac:justify-center',
  'ac:transition-[left] ac:duration-500 ac:motion-reduce:transition-none',
)

const pelletGlyph = {
  dot: 'ac:size-[5px] ac:rounded-full ac:bg-pellet',
  icon: 'ac:text-[10px] ac:leading-none ac:text-pellet',
  image: 'ac:size-2.5 ac:object-contain',
}

const markerGlyph = {
  square: 'ac:size-3 ac:rounded-[3px] ac:bg-primary ac:shadow-marker',
  icon: 'ac:text-[14px] ac:leading-none ac:text-primary ac:drop-shadow-[0_0_6px_var(--ac-color-primary)]',
  image: 'ac:size-3.5 ac:object-contain',
}

function Glyph({
  glyph,
  fallback,
  styles,
}: {
  glyph?: AcPelletBarGlyph
  fallback: string
  styles: { icon: string; image: string }
}) {
  if (glyph?.icon) return <AcIcon name={glyph.icon} className={styles.icon} />
  if (glyph?.src) return <img src={glyph.src} alt="" className={styles.image} />
  return <span className={fallback} />
}

function useSlotCount() {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => setCount(Math.floor(node.clientWidth / slotWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, count] as const
}

export function AcPelletBar({
  value,
  max = 100,
  pellet,
  marker,
  className,
  style,
  ...props
}: AcPelletBarProps) {
  const [ref, count] = useSlotCount()
  const clamped = Math.min(Math.max(value, 0), max)
  const percent = max > 0 ? (clamped / max) * 100 : 0
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      className={clsx(bar, className)}
      style={{ '--ac-pellet-progress': `${percent}%`, ...style } as CSSProperties}
      {...props}
    >
      <span className={track} aria-hidden>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={slot}>
            <Glyph glyph={pellet} fallback={pelletGlyph.dot} styles={pelletGlyph} />
          </span>
        ))}
      </span>
      <span className={markerSlot} aria-hidden>
        <Glyph glyph={marker} fallback={markerGlyph.square} styles={markerGlyph} />
      </span>
    </div>
  )
}
