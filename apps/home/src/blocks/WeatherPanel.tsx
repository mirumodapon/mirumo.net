import { AcIcon, AcPanel } from '@mirumo/arcade-ui'
import { describeWeather } from '../weather/codes'
import type { WeatherData } from '../weather/types'

export type WeatherPanelProps = { title: string; place: string; data: WeatherData }

export function WeatherPanel({ title, place, data }: WeatherPanelProps) {
  const { current, daily } = data
  const now = describeWeather(current.weather_code)
  return (
    <AcPanel
      title={
        <>
          {title} <span className="ac:text-[12px] ac:text-secondary">{place}</span>
        </>
      }
      pellets={['tr', 'bl']}
    >
      <div className="ac:flex ac:items-center ac:gap-4.5">
        <AcIcon name={now.icon} className="ac:text-[46px] ac:leading-none ac:text-primary" />
        <div>
          <div className="ac:font-pixel ac:text-[32px] ac:text-primary">
            {Math.round(current.temperature_2m)}°C
          </div>
          <div>{now.text}</div>
        </div>
      </div>
      <div className="ac:mt-3 ac:flex ac:flex-wrap ac:gap-3.5 ac:text-[10px] ac:text-muted">
        <span>FEELS {Math.round(current.apparent_temperature)}°</span>
        <span>HUM {current.relative_humidity_2m}%</span>
        <span>WIND {Math.round(current.wind_speed_10m)}km/h</span>
      </div>
      <div className="ac:mt-1.5 ac:flex ac:flex-wrap ac:gap-3.5 ac:text-[10px] ac:text-muted">
        <span className="ac:text-warning">HI {Math.round(daily.temperature_2m_max[0] ?? 0)}°</span>
        <span className="ac:text-info">LO {Math.round(daily.temperature_2m_min[0] ?? 0)}°</span>
        <span>RAIN {daily.precipitation_probability_max[0] ?? 0}%</span>
      </div>
    </AcPanel>
  )
}
