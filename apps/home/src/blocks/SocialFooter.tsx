import { AcChip } from '@mirumo/arcade-ui'
import type { HomeSocial } from '../config'

export function SocialFooter({ socials }: { socials: HomeSocial[] }) {
  if (socials.length === 0) return null
  return (
    <footer className="ac:flex ac:flex-wrap ac:gap-2.5">
      {socials.map((social) => (
        <AcChip
          key={`${social.name}-${social.url}`}
          href={social.url}
          prefix={social.icon}
          target="_blank"
          rel="noopener noreferrer me"
        >
          {social.name}
        </AcChip>
      ))}
    </footer>
  )
}
