import { AcIcon, AcPanel, AcTooltip, useDoubleTap } from '@mirumo/arcade-ui'
import { describeWeather } from '../weather/codes'
import type { WeatherData } from '../weather/types'
import type { WeatherState } from '../weather/useWeather'

export type WeatherPanelProps = {
  title: string
  place: string
  state: WeatherState
  onRefresh?: () => void
}

const messages = {
  loading: 'LOADING',
  unavailable: 'WEATHER UNAVAILABLE',
  'no-location': 'NO LOCATION',
} as const

const pad = (n: number) => String(n).padStart(2, '0')

const link = 'ac:text-info ac:underline ac:underline-offset-2 ac:hover:text-primary'

const credits = (
  <span className="ac:grid ac:gap-1">
    <span>
      天氣資料：
      <a className={link} href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
        Open-Meteo
      </a>
      （CC BY 4.0）
    </span>
    <span>
      地名資料：
      <a
        className={link}
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
      >
        © OpenStreetMap contributors
      </a>
    </span>
  </span>
)

function SourcesInfo() {
  return (
    <AcTooltip align="end" content={credits}>
      <button
        type="button"
        aria-label="資料來源"
        className="ac:inline-flex ac:cursor-pointer ac:text-muted ac:hover:text-info ac:focus-visible:outline-2 ac:focus-visible:outline-offset-2 ac:focus-visible:outline-info"
      >
        <AcIcon name="info-circle" className="ac:text-[12px]" />
      </button>
    </AcTooltip>
  )
}

function updatedAt(fetchedAt: number): string {
  const date = new Date(fetchedAt)
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function WeatherPanel({ title, place, state, onRefresh }: WeatherPanelProps) {
  return (
    <AcPanel
      title={
        <>
          {title} <span className="ac:text-[12px] ac:text-secondary">{place}</span>
          <SourcesInfo />
        </>
      }
      pellets={['tr', 'bl']}
    >
      {state.entry ? (
        <WeatherBody
          data={state.entry.data}
          fetchedAt={state.entry.fetchedAt}
          onRefresh={onRefresh}
        />
      ) : (
        <p className="ac:m-0 ac:text-muted">
          {messages[state.status === 'ready' ? 'loading' : state.status]}
        </p>
      )}
    </AcPanel>
  )
}

function WeatherBody({
  data,
  fetchedAt,
  onRefresh,
}: {
  data: WeatherData
  fetchedAt: number
  onRefresh?: () => void
}) {
  const { current, daily } = data
  const now = describeWeather(current.weather_code)
  const refreshTap = useDoubleTap<HTMLElement>(onRefresh)
  return (
    <>
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
        <span>
          UPDATED{' '}
          <time
            dateTime={new Date(fetchedAt).toISOString()}
            title={onRefresh ? '雙擊重新取得天氣' : undefined}
            {...refreshTap}
            className={onRefresh ? 'ac:cursor-pointer ac:select-none' : undefined}
          >
            {updatedAt(fetchedAt)}
          </time>
        </span>
      </div>
    </>
  )
}
