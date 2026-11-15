import file from '../../home.config'
import { resolveSettings } from './resolve'

export type {
  GlobalConfig,
  HomeLayout,
  HomeLink,
  HomeLinkGroup,
  HomeSettings,
  HomeSocial,
  WorkspaceConfig,
} from './defaults'
export { defaultGlobal, defaultWorkspace } from './defaults'
export type { DeepPartial, HomeConfigFile } from './resolve'
export { resolveSettings } from './resolve'

export const fileSettings = resolveSettings(file)
