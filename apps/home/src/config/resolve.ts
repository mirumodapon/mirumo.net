import type { GlobalConfig, HomeSettings, WorkspaceConfig } from './defaults'
import { defaultGlobal, defaultWorkspace } from './defaults'

export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

export type HomeConfigFile = {
  global?: DeepPartial<GlobalConfig>
  workspaces?: DeepPartial<WorkspaceConfig>[]
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function sameKind(base: unknown, value: unknown): boolean {
  if (Array.isArray(base)) return Array.isArray(value)
  if (isPlainObject(base)) return isPlainObject(value)
  return typeof base === typeof value
}

function merge<T>(base: T, overrides: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(overrides)) return structuredClone(base)
  const result: Record<string, unknown> = {}
  for (const [key, baseValue] of Object.entries(base)) {
    const value = overrides[key]
    if (value === undefined || !sameKind(baseValue, value)) {
      result[key] = structuredClone(baseValue)
    } else if (isPlainObject(baseValue)) {
      result[key] = merge(baseValue, value)
    } else {
      result[key] = structuredClone(value)
    }
  }
  return result as T
}

export function resolveSettings(file: unknown): HomeSettings {
  const source = isPlainObject(file) ? file : {}
  const workspaces =
    Array.isArray(source.workspaces) && source.workspaces.length ? source.workspaces : [{}]
  return {
    global: merge(defaultGlobal, source.global),
    workspaces: workspaces.map((workspace) => merge(defaultWorkspace, workspace)),
  }
}
