import type { WorkspaceConfig } from '../config'

export function placeLabel(
  { source, place }: Pick<WorkspaceConfig['weather'], 'source' | 'place'>,
  lookup: { name?: string; failed: boolean },
): string {
  if (source === 'fixed') return place
  if (lookup.name) return lookup.name
  return lookup.failed ? 'HERE' : ''
}
