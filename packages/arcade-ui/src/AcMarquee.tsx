import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'

export type AcMarqueeScore = {
  label: ReactNode
  value: ReactNode
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

const score = 'ac:items-baseline ac:justify-center ac:gap-1.5 ac:md:flex-col ac:md:justify-start'

function Score({
  score: { label, value },
  className,
}: {
  score: AcMarqueeScore
  className?: string
}) {
  return (
    <div className={clsx(score, className)}>
      <span className="ac:text-danger">{label}</span>
      <span>{value}</span>
    </div>
  )
}

export function AcMarquee({ title, start, end, className, ...props }: AcMarqueeProps) {
  return (
    <header className={clsx(marquee, className)} {...props}>
      {start ? (
        <Score score={start} className="ac:flex ac:md:items-start" />
      ) : (
        <div className="ac:hidden ac:md:block" />
      )}
      <h1 className={heading}>{title}</h1>
      {end ? (
        <Score score={end} className="ac:hidden ac:md:flex ac:md:items-end" />
      ) : (
        <div className="ac:hidden ac:md:block" />
      )}
    </header>
  )
}
