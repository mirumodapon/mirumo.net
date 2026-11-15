import { clsx } from 'clsx'
import { useId, type ComponentProps, type ReactNode } from 'react'

export const acPanelCorners = ['tl', 'tr', 'bl', 'br'] as const
export type AcPanelCorner = (typeof acPanelCorners)[number]

export type AcPanelProps = Omit<ComponentProps<'section'>, 'title'> & {
  title?: ReactNode
  pellets?: AcPanelCorner[]
}

const panel = clsx(
  'ac:relative ac:rounded-maze ac:border-3 ac:border-wall ac:bg-surface/85 ac:shadow-maze',
  'ac:px-6 ac:pt-6.5 ac:pb-5.5 ac:text-ink',
)

const heading = clsx(
  'ac:m-0 ac:mb-4.5 ac:flex ac:flex-wrap ac:items-baseline ac:gap-3',
  'ac:font-pixel ac:text-[12px] ac:font-normal ac:text-info',
)

const pellet = clsx(
  'ac:absolute ac:size-3 ac:rounded-full ac:bg-pellet ac:shadow-pellet',
  'ac:animate-pulse-soft ac:motion-reduce:animate-none',
)

const corners: Record<AcPanelCorner, string> = {
  tl: 'ac:top-2.5 ac:left-2.5',
  tr: 'ac:top-2.5 ac:right-2.5',
  bl: 'ac:bottom-2.5 ac:left-2.5',
  br: 'ac:bottom-2.5 ac:right-2.5',
}

export function AcPanel({ title, pellets = [], className, children, ...props }: AcPanelProps) {
  const titleId = useId()
  const labelled = title != null && props['aria-label'] == null && props['aria-labelledby'] == null
  return (
    <section
      aria-labelledby={labelled ? titleId : undefined}
      className={clsx(panel, className)}
      {...props}
    >
      {pellets.map((corner) => (
        <span key={corner} className={clsx(pellet, corners[corner])} aria-hidden />
      ))}
      {title != null && (
        <h2 id={titleId} className={heading}>
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
