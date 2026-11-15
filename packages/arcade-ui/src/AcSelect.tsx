import { clsx } from 'clsx'
import type { ComponentProps } from 'react'
import { AcIcon } from './AcIcon'
import type { AcInputSize } from './AcInput'

export type AcSelectProps = Omit<ComponentProps<'select'>, 'size'> & {
  size?: AcInputSize
}

const field = clsx(
  'ac:relative ac:flex ac:min-w-0 ac:items-center ac:rounded-button ac:border-2 ac:border-wall/60 ac:bg-field',
  'ac:font-body ac:text-ink ac:transition-colors ac:focus-within:border-primary',
  'ac:has-disabled:cursor-not-allowed ac:has-disabled:opacity-50',
)

const sizes: Record<AcInputSize, { field: string; icon: string }> = {
  sm: { field: 'ac:h-7 ac:text-[10px]', icon: 'ac:right-2 ac:text-[12px]' },
  md: { field: 'ac:h-10 ac:text-[12px]', icon: 'ac:right-2.5 ac:text-[14px]' },
  lg: { field: 'ac:h-13 ac:text-[14px]', icon: 'ac:right-3 ac:text-[18px]' },
}

const select = clsx(
  'ac:h-full ac:w-full ac:min-w-0 ac:cursor-pointer ac:appearance-none ac:bg-transparent ac:pr-8 ac:pl-2.5 ac:outline-none',
  'ac:disabled:cursor-not-allowed',
)

export function AcSelect({ size = 'md', className, children, ...props }: AcSelectProps) {
  const scale = sizes[size]
  return (
    <span className={clsx(field, scale.field, className)}>
      <select className={select} {...props}>
        {children}
      </select>
      <AcIcon
        name="chevron-down"
        className={clsx('ac:pointer-events-none ac:absolute ac:text-muted', scale.icon)}
      />
    </span>
  )
}
