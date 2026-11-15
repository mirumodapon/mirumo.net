import type { AcPanelCorner } from '@mirumo/arcade-ui'

export type HomeLayout = 'default' | 'time-only' | 'clock'

export type WeatherSource = 'fixed' | 'current'

export type HomeLink = { name: string; url: string; icon?: string }

export type HomeLinkGroup = { title: string; items: HomeLink[] }

export type HomeSocial = { name: string; url: string; icon?: string }

export type GlobalConfig = {
  title: string
  player: { label: string; text: string }
  stage: { label: string }
  screen: { scanlines: boolean }
  marquee: { visible: boolean }
}

export type WorkspaceConfig = {
  layout: HomeLayout
  clock: {
    title: string
    pellets: AcPanelCorner[]
    seconds: boolean
    date: boolean
  }
  weather: {
    title: string
    place: string
    source: WeatherSource
    latitude: number
    longitude: number
  }
  clockLayout: { marquee: boolean }
  linkGroups: HomeLinkGroup[]
  socials: HomeSocial[]
}

export type HomeSettings = { global: GlobalConfig; workspaces: WorkspaceConfig[] }

export const defaultGlobal: GlobalConfig = {
  title: 'MIRUMO',
  player: { label: '1UP', text: '' },
  stage: { label: 'STAGE' },
  screen: { scanlines: true },
  marquee: { visible: true },
}

export const defaultWorkspace: WorkspaceConfig = {
  layout: 'default',
  clock: {
    title: 'TIME',
    pellets: ['tl', 'br'],
    seconds: true,
    date: true,
  },
  weather: {
    title: 'WEATHER',
    place: 'TAIPEI',
    source: 'current',
    latitude: 25.033,
    longitude: 121.5654,
  },
  clockLayout: { marquee: false },
  linkGroups: [
    {
      title: 'LINKS',
      items: [],
    },
  ],
  socials: [
    { name: 'GitHub', url: 'https://github.com/mirumodapon', icon: 'brand-github' },
    { name: 'Instagram', url: 'https://www.instagram.com/mirumo_0915', icon: 'brand-instagram' },
    { name: 'X', url: 'https://x.com/mirudapon', icon: 'brand-x' },
  ],
}
