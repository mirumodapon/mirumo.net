import { greetingFor } from './greeting'
import { useNow } from './useNow'

export function PlayerText({ text }: { text: string }) {
  const now = useNow()
  return <>{text || greetingFor(now.getHours())}</>
}
