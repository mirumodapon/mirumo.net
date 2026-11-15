import type { AcPanelCorner } from '@mirumo/arcade-ui'

export type HomeLayout = 'default' | 'time-only' | 'clock'

export type HomeLink = { name: string; url: string; icon?: string }

export type HomeSocial = { name: string; url: string; icon?: string }

export type HomeConfig = {
  title: string
  player: { label: string; text: string }
  stage: { label: string }
  layout: HomeLayout
  screen: { scanlines: boolean }
  clock: {
    title: string
    pellets: AcPanelCorner[]
    seconds: boolean
    date: boolean
  }
  weather: { title: string; place: string }
  links: { title: string; items: HomeLink[] }
  socials: HomeSocial[]
}

export const defaultConfig: HomeConfig = {
  title: 'MIRUMO',
  player: { label: '1UP', text: 'HELLO' },
  stage: { label: 'STAGE' },
  layout: 'default',
  screen: { scanlines: true },
  clock: {
    title: 'TIME',
    pellets: ['tl', 'br'],
    seconds: true,
    date: true,
  },
  weather: { title: 'WEATHER', place: 'TAIPEI' },
  links: {
    title: 'LINKS',
    items: [
      { name: 'Gmail', url: 'https://mail.google.com/', icon: 'brand-gmail' },
      { name: 'Calendar', url: 'https://calendar.google.com/', icon: 'calendar' },
      { name: 'GitHub', url: 'https://github.com/', icon: 'brand-github' },
      { name: 'Drive', url: 'https://drive.google.com/', icon: 'brand-google-drive' },
      { name: 'Notion', url: 'https://www.notion.so/', icon: 'brand-notion' },
      { name: 'Claude', url: 'https://claude.ai/', icon: 'sparkles' },
    ],
  },
  socials: [
    { name: 'GitHub', url: 'https://github.com/', icon: 'brand-github' },
    { name: 'X', url: 'https://x.com/', icon: 'brand-x' },
    { name: 'Instagram', url: 'https://www.instagram.com/', icon: 'brand-instagram' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/', icon: 'brand-linkedin' },
  ],
}
