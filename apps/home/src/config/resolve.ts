import type { HomeConfig } from './defaults'
import { defaultConfig } from './defaults'

export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

export type HomeConfigOverrides = DeepPartial<HomeConfig>

export type HomeConfigFile = { workspaces?: HomeConfigOverrides[] }

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function merge<T>(base: T, overrides: DeepPartial<T> | undefined): T {
  if (!isPlainObject(base) || !isPlainObject(overrides)) return base
  const result: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue
    result[key] = isPlainObject(value) ? merge(result[key], value) : value
  }
  return result as T
}

export function resolveConfig(overrides: HomeConfigOverrides): HomeConfig {
  return merge<HomeConfig>(defaultConfig, overrides)
}

export function resolveWorkspaces(file: HomeConfigFile): HomeConfig[] {
  const list = file.workspaces?.length ? file.workspaces : [{}]
  return list.map(resolveConfig)
}
