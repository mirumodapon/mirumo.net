import { clsx } from 'clsx'
import type { ComponentProps } from 'react'
import { AcIcon } from './AcIcon'

export const acInputVariants = ['box', 'underline'] as const
export type AcInputVariant = (typeof acInputVariants)[number]

export const acInputSizes = ['sm', 'md', 'lg'] as const
export type AcInputSize = (typeof acInputSizes)[number]

export type AcInputProps = Omit<ComponentProps<'input'>, 'prefix' | 'size'> & {
  variant?: AcInputVariant
  size?: AcInputSize
  prefix?: string
}

const field = clsx(
  'ac:flex ac:min-w-0 ac:items-center ac:text-ink ac:transition-colors',
  'ac:focus-within:border-primary',
  'ac:has-[[aria-invalid=true]]:border-danger',
  'ac:has-disabled:cursor-not-allowed ac:has-disabled:opacity-50',
)

const variants: Record<AcInputVariant, string> = {
  box: 'ac:rounded-button ac:border-2 ac:border-wall/60 ac:bg-field ac:px-2.5 ac:font-body',
  underline: 'ac:border-b-2 ac:border-wall ac:bg-transparent ac:px-1 ac:font-pixel',
}

const sizes: Record<AcInputSize, { field: string; icon: string }> = {
  sm: { field: 'ac:h-7 ac:gap-1.5 ac:text-[10px]', icon: 'ac:text-[12px]' },
  md: { field: 'ac:h-10 ac:gap-2 ac:text-[12px]', icon: 'ac:text-[14px]' },
  lg: { field: 'ac:h-13 ac:gap-2.5 ac:text-[14px]', icon: 'ac:text-[18px]' },
}

const input = clsx(
  'ac:h-full ac:min-w-0 ac:flex-1 ac:bg-transparent ac:outline-none',
  'ac:placeholder:text-muted ac:disabled:cursor-not-allowed',
)

export function AcInput({
  variant = 'box',
  size = 'md',
  prefix,
  className,
  ...props
}: AcInputProps) {
  const scale = sizes[size]
  return (
    <span className={clsx(field, variants[variant], scale.field, className)}>
      {prefix && <AcIcon name={prefix} className={clsx('ac:text-primary', scale.icon)} />}
      <input className={input} {...props} />
    </span>
  )
}
