import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

export type AcIconProps = Omit<ComponentProps<'i'>, 'children'> & {
  name: string
}

export function AcIcon({ name, className, ...props }: AcIconProps) {
  return <i className={clsx('ti', `ti-${name}`, className)} aria-hidden {...props} />
}
