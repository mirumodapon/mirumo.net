import { AcChip } from '@mirumo/arcade-ui'
import { clsx } from 'clsx'
import type { HomeSocial } from '../config'

export function SocialFooter({
  socials,
  className,
}: {
  socials: HomeSocial[]
  className?: string
}) {
  if (socials.length === 0) return null
  return (
    <footer className={clsx('ac:flex ac:flex-wrap ac:gap-2.5', className)}>
      {socials.map((social) => (
        <AcChip
          key={`${social.name}-${social.url}`}
          href={social.url}
          prefix={social.icon || (social.name ? undefined : 'link')}
          aria-label={social.name ? undefined : social.url}
          target="_blank"
          rel="noopener noreferrer me"
        >
          {social.name}
        </AcChip>
      ))}
    </footer>
  )
}
