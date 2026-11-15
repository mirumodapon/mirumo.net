import overrides from '../../home.config'
import { resolveConfig } from './resolve'

export type { HomeConfig, HomeLayout } from './defaults'
export { defaultConfig } from './defaults'
export type { DeepPartial, HomeConfigOverrides } from './resolve'
export { resolveConfig } from './resolve'

export const config = resolveConfig(overrides)
