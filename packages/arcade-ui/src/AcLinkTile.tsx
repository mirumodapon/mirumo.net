import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'

export const acLinkTileColors = ['info', 'secondary', 'warning', 'danger', 'primary'] as const
export type AcLinkTileColor = (typeof acLinkTileColors)[number]

export type AcLinkTileProps = Omit<ComponentProps<'a'>, 'color'> & {
  color?: AcLinkTileColor
  badge?: ReactNode
  shortcut?: string
}

const tile = clsx(
  'ac:flex ac:min-w-0 ac:items-center ac:gap-3 ac:rounded-tile ac:border-2 ac:border-wall/55 ac:px-3 ac:py-3.5',
  'ac:text-ink ac:no-underline ac:transition-[translate,border-color,box-shadow] ac:duration-150',
  'ac:hover:-translate-y-0.5 ac:hover:border-(--ac-tile) ac:hover:shadow-[0_0_14px_var(--ac-tile)]',
  'ac:focus-visible:-translate-y-0.5 ac:focus-visible:border-(--ac-tile) ac:focus-visible:shadow-[0_0_14px_var(--ac-tile)] ac:focus-visible:outline-none',
  'ac:motion-reduce:hover:translate-y-0 ac:motion-reduce:focus-visible:translate-y-0',
)

const colors: Record<AcLinkTileColor, string> = {
  info: 'ac:[--ac-tile:var(--ac-color-info)]',
  secondary: 'ac:[--ac-tile:var(--ac-color-secondary)]',
  warning: 'ac:[--ac-tile:var(--ac-color-warning)]',
  danger: 'ac:[--ac-tile:var(--ac-color-danger)]',
  primary: 'ac:[--ac-tile:var(--ac-color-primary)]',
}

const badgeClass = clsx(
  'ac:grid ac:size-8.5 ac:flex-none ac:place-items-center ac:rounded-[8px_8px_3px_3px] ac:bg-(--ac-tile)',
  'ac:font-pixel ac:text-[14px] ac:text-surface',
)

const nameClass = 'ac:min-w-0 ac:truncate ac:font-body ac:text-[14px] ac:font-bold'

const shortcutClass = 'ac:ml-auto ac:font-pixel ac:text-[9px] ac:text-muted'

function initial(children: ReactNode) {
  if (typeof children !== 'string') return undefined
  return [...children.trim()][0]?.toUpperCase()
}

export function AcLinkTile({
  color = 'info',
  badge,
  shortcut,
  className,
  children,
  ...props
}: AcLinkTileProps) {
  const badgeContent = badge ?? initial(children)
  return (
    <a className={clsx(tile, colors[color], className)} {...props}>
      {badgeContent != null && (
        <span className={badgeClass} aria-hidden>
          {badgeContent}
        </span>
      )}
      <span className={nameClass}>{children}</span>
      {shortcut && (
        <span className={shortcutClass} aria-hidden>
          {shortcut}
        </span>
      )}
    </a>
  )
}
