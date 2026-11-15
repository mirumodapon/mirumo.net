import { AcScreen } from '@mirumo/arcade-ui'
import type { ComponentType } from 'react'
import type { HomeConfig, HomeLayout } from './config'
import { ClockLayout } from './layouts/ClockLayout'
import { PanelLayout } from './layouts/PanelLayout'

const layouts: Record<HomeLayout, ComponentType<{ config: HomeConfig }>> = {
  panel: PanelLayout,
  clock: ClockLayout,
}

export function App({ config }: { config: HomeConfig }) {
  const Layout = layouts[config.layout]
  return (
    <AcScreen scanlines={config.screen.scanlines}>
      <Layout config={config} />
    </AcScreen>
  )
}
