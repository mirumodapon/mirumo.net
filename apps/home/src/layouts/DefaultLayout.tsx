import { AcMarquee, AcPanel } from '@mirumo/arcade-ui'
import { useState } from 'react'
import { LinksPanel } from '../blocks/LinksPanel'
import { SocialFooter } from '../blocks/SocialFooter'
import { WeatherPanel } from '../blocks/WeatherPanel'
import { Clock } from '../clock/Clock'
import type { HomeConfig } from '../config'
import { createMockWeather } from '../weather/mock'
import { formatStage } from '../workspace/stage'

export function DefaultLayout({ config, stage }: { config: HomeConfig; stage: number }) {
  const { title, player, clock, weather, links, socials } = config
  const [weatherData] = useState(() => createMockWeather(new Date()))
  return (
    <div className="ac:grid ac:gap-5">
      <AcMarquee
        title={title}
        start={{ label: player.label, value: player.text }}
        end={{ label: config.stage.label, value: formatStage(stage) }}
      />
      <div className="ac:grid ac:gap-5 ac:md:grid-cols-[1.1fr_1fr]">
        <AcPanel title={clock.title} pellets={clock.pellets}>
          <Clock seconds={clock.seconds} date={clock.date} />
        </AcPanel>
        <WeatherPanel title={weather.title} place={weather.place} data={weatherData} />
      </div>
      <LinksPanel title={links.title} items={links.items} />
      <SocialFooter socials={socials} />
    </div>
  )
}
