import { AcScreen } from '@mirumo/arcade-ui'
import type { ComponentType } from 'react'
import type { HomeConfig, HomeLayout } from './config'
import { ClockLayout } from './layouts/ClockLayout'
import { TimeOnlyLayout } from './layouts/TimeOnlyLayout'

const layouts: Record<HomeLayout, ComponentType<{ config: HomeConfig; stage: number }>> = {
  clock: ClockLayout,
  'time-only': TimeOnlyLayout,
}

export function App({ config, stage }: { config: HomeConfig; stage: number }) {
  const Layout = layouts[config.layout]
  return (
    <AcScreen scanlines={config.screen.scanlines}>
      <Layout config={config} stage={stage} />
    </AcScreen>
  )
}
