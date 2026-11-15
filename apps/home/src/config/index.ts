import file from '../../home.config'
import { resolveWorkspaces } from './resolve'

export type { HomeConfig, HomeLayout, HomeLink, HomeSocial } from './defaults'
export { defaultConfig } from './defaults'
export type { DeepPartial, HomeConfigFile, HomeConfigOverrides } from './resolve'
export { resolveConfig, resolveWorkspaces } from './resolve'

export const workspaces = resolveWorkspaces(file)
