import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { workspaces } from './config'
import { Root } from './Root'
import '@mirumo/arcade-ui/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root workspaces={workspaces} />
  </StrictMode>,
)
