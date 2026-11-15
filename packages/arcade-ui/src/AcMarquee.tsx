import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'
import { useDoubleTap } from './doubleTap'

export type AcMarqueeScore = {
  label: ReactNode
  value: ReactNode
  hint?: string
  onDoubleTap?: () => void
}

export type AcMarqueeProps = Omit<ComponentProps<'header'>, 'title'> & {
  title: ReactNode
  start?: AcMarqueeScore
  end?: AcMarqueeScore
}

const marquee = clsx(
  'ac:grid ac:grid-cols-1 ac:items-end ac:gap-4 ac:text-center',
  'ac:md:grid-cols-[1fr_auto_1fr] ac:md:text-left',
  'ac:font-pixel ac:text-[12px] ac:leading-[1.6] ac:text-ink',
)

const heading = clsx(
  'ac:m-0 ac:font-normal ac:whitespace-nowrap ac:text-primary',
  'ac:text-[length:clamp(18px,4vw,34px)] ac:tracking-[2px] ac:text-shadow-marquee',
)

const tappable = 'ac:cursor-pointer ac:select-none'

function ScoreLine({ score }: { score: AcMarqueeScore }) {
  const tap = useDoubleTap<HTMLSpanElement>(score.onDoubleTap)
  return (
    <span
      className={clsx('ac:inline-flex ac:items-baseline ac:gap-1.5', {
        [tappable]: score.onDoubleTap,
      })}
      title={score.hint}
      {...tap}
    >
      <span className="ac:text-danger">{score.label}</span>
      <span>{score.value}</span>
    </span>
  )
}

function ScoreColumn({ score, className }: { score: AcMarqueeScore; className?: string }) {
  const tap = useDoubleTap<HTMLDivElement>(score.onDoubleTap)
  return (
    <div
      className={clsx('ac:flex-col ac:gap-1.5', { [tappable]: score.onDoubleTap }, className)}
      title={score.hint}
      {...tap}
    >
      <span className="ac:text-danger">{score.label}</span>
      <span>{score.value}</span>
    </div>
  )
}

const placeholder = <div className="ac:hidden ac:md:block" />

export function AcMarquee({ title, start, end, className, ...props }: AcMarqueeProps) {
  return (
    <header className={clsx(marquee, className)} {...props}>
      {(start || end) && (
        <div className="ac:flex ac:flex-wrap ac:items-baseline ac:justify-center ac:gap-x-3 ac:gap-y-1 ac:md:hidden">
          {start && <ScoreLine score={start} />}
          {start && end && <span className="ac:text-muted">·</span>}
          {end && <ScoreLine score={end} />}
        </div>
      )}
      {start ? (
        <ScoreColumn score={start} className="ac:hidden ac:md:flex ac:md:items-start" />
      ) : (
        placeholder
      )}
      <h1 className={heading}>{title}</h1>
      {end ? (
        <ScoreColumn score={end} className="ac:hidden ac:md:flex ac:md:items-end" />
      ) : (
        placeholder
      )}
    </header>
  )
}
