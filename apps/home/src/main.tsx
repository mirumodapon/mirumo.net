import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { workspaces } from './config'
import '@mirumo/arcade-ui/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App config={workspaces[0]!} />
  </StrictMode>,
)
