import { clsx } from 'clsx'

export const mazeFrame = clsx(
  'ac:rounded-maze ac:border-3 ac:border-wall ac:shadow-maze',
  'ac:px-6 ac:pt-6.5 ac:pb-5.5 ac:text-ink',
)

export const mazeHeading = clsx(
  'ac:m-0 ac:mb-4.5 ac:flex ac:flex-wrap ac:items-baseline ac:gap-3',
  'ac:font-pixel ac:text-[12px] ac:font-normal ac:text-info',
)
