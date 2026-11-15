import { AcScreen } from '@mirumo/arcade-ui'
import type { ComponentType } from 'react'
import type { HomeLayout } from './config'
import { ClockLayout } from './layouts/ClockLayout'
import { DefaultLayout } from './layouts/DefaultLayout'
import type { LayoutProps } from './layouts/LayoutProps'
import { TimeOnlyLayout } from './layouts/TimeOnlyLayout'

const layouts: Record<HomeLayout, ComponentType<LayoutProps>> = {
  default: DefaultLayout,
  clock: ClockLayout,
  'time-only': TimeOnlyLayout,
}

export function App({ global, workspace, stage }: LayoutProps) {
  const Layout = layouts[workspace.layout]
  return (
    <AcScreen scanlines={global.screen.scanlines}>
      <Layout global={global} workspace={workspace} stage={stage} />
    </AcScreen>
  )
}
