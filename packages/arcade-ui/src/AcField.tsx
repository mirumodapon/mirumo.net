import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'

export type AcFieldProps = ComponentProps<'label'> & {
  label: ReactNode
}

const field = 'ac:flex ac:flex-col ac:gap-1.5 ac:font-body ac:text-[13px] ac:text-ink'

export function AcField({ label, className, children, ...props }: AcFieldProps) {
  return (
    <label className={clsx(field, className)} {...props}>
      <span>{label}</span>
      {children}
    </label>
  )
}
