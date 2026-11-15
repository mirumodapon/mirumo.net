import { AcIcon, AcPanel } from '@mirumo/arcade-ui'
import { dayLabel, describeWeather } from '../weather/codes'
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
      <div className="ac:mt-4.5 ac:grid ac:grid-cols-3 ac:gap-2.5">
        {daily.time.map((date, i) => {
          const day = describeWeather(daily.weather_code[i] ?? -1)
          return (
            <div
              key={date}
              className="ac:rounded-[8px] ac:border-2 ac:border-dashed ac:border-wall/60 ac:px-2 ac:py-2.5 ac:text-center ac:text-[10px]"
            >
              <span>{dayLabel(date, i)}</span>
              <AcIcon
                name={day.icon}
                title={day.text}
                className="ac:my-1.5 ac:block ac:text-[22px]"
              />
              <span className="ac:text-warning">
                {Math.round(daily.temperature_2m_max[i] ?? 0)}°
              </span>
              {' / '}
              <span className="ac:text-info">{Math.round(daily.temperature_2m_min[i] ?? 0)}°</span>
              <span className="ac:mt-1 ac:block ac:text-muted">
                {daily.precipitation_probability_max[i] ?? 0}%
              </span>
            </div>
          )
        })}
      </div>
    </AcPanel>
  )
}
