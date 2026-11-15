export type TooltipState = { open: boolean; pinned: boolean }

export type TooltipEvent =
  | 'hover-in'
  | 'hover-out'
  | 'focus'
  | 'blur'
  | 'tap'
  | 'escape'
  | 'outside'

export function tooltipReducer(state: TooltipState, event: TooltipEvent): TooltipState {
  switch (event) {
    case 'hover-in':
    case 'focus':
      return { open: true, pinned: state.pinned }
    case 'hover-out':
    case 'blur':
      return state.pinned ? state : { open: false, pinned: false }
    case 'tap':
      return state.pinned ? { open: false, pinned: false } : { open: true, pinned: true }
    case 'escape':
    case 'outside':
      return { open: false, pinned: false }
  }
}

export function fitShift(left: number, right: number, viewportWidth: number, margin = 8): number {
  if (left < margin) return margin - left
  if (right > viewportWidth - margin) return viewportWidth - margin - right
  return 0
}
