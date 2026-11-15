import { AcScreen } from '@mirumo/arcade-ui'
import type { ComponentType } from 'react'
import type { HomeConfig, HomeLayout } from './config'
import { ClockLayout } from './layouts/ClockLayout'
import { TimeOnlyLayout } from './layouts/TimeOnlyLayout'

const layouts: Record<HomeLayout, ComponentType<{ config: HomeConfig }>> = {
  clock: ClockLayout,
  'time-only': TimeOnlyLayout,
}

export function App({ config }: { config: HomeConfig }) {
  const Layout = layouts[config.layout]
  return (
    <AcScreen scanlines={config.screen.scanlines}>
      <Layout config={config} />
    </AcScreen>
  )
}
