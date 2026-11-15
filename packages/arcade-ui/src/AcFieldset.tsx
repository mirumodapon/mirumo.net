import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'

export type AcFieldsetProps = ComponentProps<'fieldset'> & {
  legend?: ReactNode
}

const fieldset = clsx(
  'ac:min-w-0 ac:rounded-tile ac:border-2 ac:border-dashed ac:border-wall/60 ac:p-3.5',
  'ac:font-body ac:text-[13px] ac:text-ink',
  'ac:disabled:opacity-50',
)

const legendClass = 'ac:px-1.5 ac:font-bold ac:text-secondary'

export function AcFieldset({ legend, className, children, ...props }: AcFieldsetProps) {
  return (
    <fieldset className={clsx(fieldset, className)} {...props}>
      {legend != null && <legend className={legendClass}>{legend}</legend>}
      {children}
    </fieldset>
  )
}
