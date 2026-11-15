import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { fileSettings } from './config'
import { Root } from './Root'
import '@mirumo/arcade-ui/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root settings={fileSettings} />
  </StrictMode>,
)
