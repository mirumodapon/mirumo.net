import type { AcPanelCorner } from '@mirumo/arcade-ui'

export type HomeLayout = 'time-only' | 'clock'

export type HomeConfig = {
  title: string
  player: { label: string; text: string }
  layout: HomeLayout
  screen: { scanlines: boolean }
  clock: {
    title: string
    pellets: AcPanelCorner[]
    seconds: boolean
    date: boolean
  }
}

export const defaultConfig: HomeConfig = {
  title: 'MIRUMO',
  player: { label: '1UP', text: 'HELLO' },
  layout: 'time-only',
  screen: { scanlines: true },
  clock: {
    title: 'TIME',
    pellets: ['tl', 'br'],
    seconds: true,
    date: true,
  },
}
