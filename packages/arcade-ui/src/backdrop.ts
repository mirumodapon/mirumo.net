export type Rect = { left: number; top: number; right: number; bottom: number }

export function isOutsideRect(rect: Rect, x: number, y: number): boolean {
  return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom
}
