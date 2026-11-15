import { defaultWorkspace, type HomeLink, type HomeSettings } from '../config'

export function moveItem<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) return list.slice()
  const next = list.slice()
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  return next
}

export function removeAt<T>(list: T[], index: number): T[] {
  return list.filter((_, i) => i !== index)
}

export function addWorkspace(settings: HomeSettings): HomeSettings {
  return { ...settings, workspaces: [...settings.workspaces, structuredClone(defaultWorkspace)] }
}

export function deleteWorkspace(settings: HomeSettings, index: number): HomeSettings {
  if (settings.workspaces.length <= 1) return settings
  return { ...settings, workspaces: removeAt(settings.workspaces, index) }
}

function trimDeep<T>(value: T): T {
  if (typeof value === 'string') return value.trim() as T
  if (Array.isArray(value)) return value.map(trimDeep) as T
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, trimDeep(item)]),
    ) as T
  }
  return value
}

const safeUrl = /^https?:\/\//i

function cleanRows(rows: HomeLink[]): HomeLink[] {
  return rows
    .filter((row) => safeUrl.test(row.url))
    .map(({ name, url, icon }) => ({ name: name || url, url, ...(icon ? { icon } : {}) }))
}

export function normalizeSettings(settings: HomeSettings): HomeSettings {
  const trimmed = trimDeep(settings)
  return {
    ...trimmed,
    workspaces: trimmed.workspaces.map((workspace) => ({
      ...workspace,
      linkGroups: workspace.linkGroups.map((group) => ({
        ...group,
        items: cleanRows(group.items),
      })),
      socials: cleanRows(workspace.socials),
    })),
  }
}
