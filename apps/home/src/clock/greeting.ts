export function greetingFor(hour: number): string {
  if (hour < 5) return 'LATE NIGHT'
  if (hour < 12) return 'GOOD MORNING'
  if (hour < 18) return 'GOOD AFTERNOON'
  return 'GOOD EVENING'
}
