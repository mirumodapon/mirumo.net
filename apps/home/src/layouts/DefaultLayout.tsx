import { AcPanel } from '@mirumo/arcade-ui'
import { LinksPanel } from '../blocks/LinksPanel'
import { SocialFooter } from '../blocks/SocialFooter'
import { WeatherPanel } from '../blocks/WeatherPanel'
import { Clock } from '../clock/Clock'
import { usePosition } from '../weather/usePosition'
import { useWeather } from '../weather/useWeather'
import type { LayoutProps } from './LayoutProps'
import { PageMarquee } from './PageMarquee'

export function DefaultLayout(props: LayoutProps) {
  const { global, workspace } = props
  const { clock, weather, linkGroups, socials } = workspace
  const position = usePosition(weather.source === 'current')
  const coords =
    weather.source === 'fixed'
      ? { latitude: weather.latitude, longitude: weather.longitude }
      : position.coords
  const weatherState = useWeather(coords)
  return (
    <div className="ac:flex ac:min-h-[calc(100dvh_-_3.5rem)] ac:flex-col ac:gap-5">
      {global.marquee.visible && <PageMarquee {...props} />}
      <div className="ac:grid ac:gap-5 ac:md:grid-cols-[1.1fr_1fr]">
        <AcPanel title={clock.title} pellets={clock.pellets}>
          <Clock seconds={clock.seconds} date={clock.date} />
        </AcPanel>
        <WeatherPanel
          title={weather.title}
          place={weather.place}
          state={position.pending ? { status: 'loading' } : weatherState}
        />
      </div>
      {linkGroups.map((group, index) => (
        <LinksPanel key={`${index}-${group.title}`} title={group.title} items={group.items} />
      ))}
      <SocialFooter socials={socials} className="ac:mt-auto" />
    </div>
  )
}
