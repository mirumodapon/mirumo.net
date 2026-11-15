import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { fileSettings } from './config'
import { Root } from './Root'
import { browserStorage, createSettingsStore } from './settings/store'
import '@mirumo/arcade-ui/index.css'

const store = createSettingsStore(fileSettings, browserStorage())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root store={store} />
  </StrictMode>,
)
