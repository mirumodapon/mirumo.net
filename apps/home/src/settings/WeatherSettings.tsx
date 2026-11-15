import { AcButton, AcInput, AcSelect } from '@mirumo/arcade-ui'
import { useState } from 'react'
import type { WeatherSource, WorkspaceConfig } from '../config'
import { searchPlaces, type Place } from '../weather/api'

type Weather = WorkspaceConfig['weather']

export type WeatherSettingsProps = { weather: Weather; onChange: (weather: Weather) => void }

type SearchStatus = 'idle' | 'searching' | 'empty' | 'error'

const statusText: Record<SearchStatus, string> = {
  idle: '',
  searching: '搜尋中…',
  empty: '找不到城市',
  error: '搜尋失敗',
}

export function WeatherSettings({ weather, onChange }: WeatherSettingsProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [places, setPlaces] = useState<Place[]>([])

  const search = async () => {
    setStatus('searching')
    setPlaces([])
    try {
      const results = await searchPlaces(query)
      setPlaces(results)
      setStatus(results.length ? 'idle' : 'empty')
    } catch {
      setStatus('error')
    }
  }

  const choose = (place: Place) => {
    onChange({
      ...weather,
      place: place.name.toUpperCase(),
      latitude: place.latitude,
      longitude: place.longitude,
    })
    setPlaces([])
    setQuery('')
  }

  const setSource = (source: WeatherSource) => onChange({ ...weather, source })

  return (
    <div className="ac:grid ac:gap-3">
      <AcSelect
        aria-label="天氣來源"
        value={weather.source}
        onChange={(event) => setSource(event.target.value as WeatherSource)}
      >
        <option value="fixed">指定地點</option>
        <option value="current">目前位置</option>
      </AcSelect>

      {weather.source === 'fixed' ? (
        <>
          <div className="ac:flex ac:gap-1.5">
            <AcInput
              aria-label="搜尋城市"
              placeholder="輸入城市，例如 Tokyo"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return
                event.preventDefault()
                void search()
              }}
              className="ac:flex-1"
            />
            <AcButton onClick={() => void search()}>搜尋</AcButton>
          </div>
          {places.length > 0 && (
            <div className="ac:grid ac:gap-1.5">
              {places.map((place) => (
                <AcButton
                  key={`${place.latitude},${place.longitude}`}
                  size="sm"
                  variant="ghost"
                  onClick={() => choose(place)}
                  className="ac:justify-start ac:font-body"
                >
                  {place.label}
                </AcButton>
              ))}
            </div>
          )}
          {status !== 'idle' && <p className="ac:m-0 ac:text-muted">{statusText[status]}</p>}
          <p className="ac:m-0 ac:text-muted">
            {weather.place} · {weather.latitude.toFixed(4)}, {weather.longitude.toFixed(4)}
          </p>
        </>
      ) : (
        <p className="ac:m-0 ac:text-muted">地點名稱會依目前位置自動顯示</p>
      )}
    </div>
  )
}
