import { AcPanel, AcScreen } from '@mirumo/arcade-ui'
import { Clock } from './clock/Clock'

export function App() {
  return (
    <AcScreen>
      <div className="ac:mx-auto ac:max-w-xl">
        <AcPanel title="TIME" pellets={['tl', 'br']}>
          <Clock />
        </AcPanel>
      </div>
    </AcScreen>
  )
}
