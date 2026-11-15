import { AcPanel } from '@mirumo/arcade-ui'
import { useState } from 'react'
import { LinksPanel } from '../blocks/LinksPanel'
import { SocialFooter } from '../blocks/SocialFooter'
import { WeatherPanel } from '../blocks/WeatherPanel'
import { Clock } from '../clock/Clock'
import { createMockWeather } from '../weather/mock'
import type { LayoutProps } from './LayoutProps'
import { PageMarquee } from './PageMarquee'

export function DefaultLayout(props: LayoutProps) {
  const { global, workspace } = props
  const { clock, weather, linkGroups, socials } = workspace
  const [weatherData] = useState(() => createMockWeather(new Date()))
  return (
    <div className="ac:flex ac:min-h-[calc(100dvh_-_3.5rem)] ac:flex-col ac:gap-5">
      {global.marquee.visible && <PageMarquee {...props} />}
      <div className="ac:grid ac:gap-5 ac:md:grid-cols-[1.1fr_1fr]">
        <AcPanel title={clock.title} pellets={clock.pellets}>
          <Clock seconds={clock.seconds} date={clock.date} />
        </AcPanel>
        <WeatherPanel title={weather.title} place={weather.place} data={weatherData} />
      </div>
      {linkGroups.map((group, index) => (
        <LinksPanel key={`${index}-${group.title}`} title={group.title} items={group.items} />
      ))}
      <SocialFooter socials={socials} className="ac:mt-auto" />
    </div>
  )
}
