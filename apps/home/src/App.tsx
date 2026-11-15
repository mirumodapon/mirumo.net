import { AcScreen } from '@mirumo/arcade-ui'
import type { ComponentType } from 'react'
import type { HomeLayout } from './config'
import { ClockLayout } from './layouts/ClockLayout'
import { DefaultLayout } from './layouts/DefaultLayout'
import type { LayoutProps } from './layouts/LayoutProps'
import { MarqueeReveal } from './layouts/MarqueeReveal'
import { TimeOnlyLayout } from './layouts/TimeOnlyLayout'

const layouts: Record<HomeLayout, ComponentType<LayoutProps>> = {
  default: DefaultLayout,
  clock: ClockLayout,
  'time-only': TimeOnlyLayout,
}

export function App(props: LayoutProps) {
  const { global, workspace } = props
  const Layout = layouts[workspace.layout]
  const marqueeOnPage =
    workspace.layout === 'clock' ? workspace.clockLayout.marquee : global.marquee.visible
  return (
    <AcScreen scanlines={global.screen.scanlines} className="ac:[@media(hover:none)]:pb-16">
      {!marqueeOnPage && <MarqueeReveal {...props} />}
      <Layout {...props} />
    </AcScreen>
  )
}
