import { clsx } from 'clsx'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { mazeFrame, mazeHeading } from './maze'

export const acPanelCorners = ['tl', 'tr', 'bl', 'br'] as const
export type AcPanelCorner = (typeof acPanelCorners)[number]

export type AcPanelProps = Omit<ComponentProps<'section'>, 'title'> & {
  title?: ReactNode
  pellets?: AcPanelCorner[]
}

const panel = clsx(mazeFrame, 'ac:relative ac:bg-surface/85')

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
        <h2 id={titleId} className={mazeHeading}>
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
