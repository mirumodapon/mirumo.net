import { clsx } from 'clsx'
import type { ComponentProps } from 'react'
import { AcIcon } from './AcIcon'

export const acChipColors = ['pellet', 'primary', 'secondary', 'info', 'warning', 'danger'] as const
export type AcChipColor = (typeof acChipColors)[number]

export type AcChipProps = Omit<ComponentProps<'a'>, 'prefix' | 'color'> & {
  color?: AcChipColor
  prefix?: string
}

const chip = clsx(
  'ac:inline-flex ac:items-center ac:gap-1.5 ac:rounded-full ac:border-2 ac:px-3 ac:py-2',
  'ac:font-pixel ac:text-[10px] ac:leading-[1.6] ac:whitespace-nowrap ac:no-underline',
  'ac:transition-colors',
  'ac:hover:text-surface ac:focus-visible:text-surface ac:focus-visible:outline-none',
)

const colors: Record<AcChipColor, string> = {
  pellet:
    'ac:border-wall ac:text-pellet ac:hover:border-pellet ac:hover:bg-pellet ac:focus-visible:border-pellet ac:focus-visible:bg-pellet',
  primary: 'ac:border-primary ac:text-primary ac:hover:bg-primary ac:focus-visible:bg-primary',
  secondary:
    'ac:border-secondary ac:text-secondary ac:hover:bg-secondary ac:focus-visible:bg-secondary',
  info: 'ac:border-info ac:text-info ac:hover:bg-info ac:focus-visible:bg-info',
  warning: 'ac:border-warning ac:text-warning ac:hover:bg-warning ac:focus-visible:bg-warning',
  danger: 'ac:border-danger ac:text-danger ac:hover:bg-danger ac:focus-visible:bg-danger',
}

export function AcChip({ color = 'pellet', prefix, className, children, ...props }: AcChipProps) {
  return (
    <a className={clsx(chip, colors[color], className)} {...props}>
      {prefix && <AcIcon name={prefix} className="ac:text-[14px]" />}
      {children}
    </a>
  )
}
