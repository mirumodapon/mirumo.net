import { AcIcon, AcLinkTile, AcPanel, acLinkTileColors } from '@mirumo/arcade-ui'
import type { HomeLink } from '../config'

export type LinksPanelProps = { title: string; items: HomeLink[] }

export function LinksPanel({ title, items }: LinksPanelProps) {
  if (items.length === 0) return null
  return (
    <AcPanel title={title} pellets={['tl', 'tr']}>
      <div className="ac:grid ac:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] ac:gap-3.5">
        {items.map((item, i) => (
          <AcLinkTile
            key={`${item.name}-${item.url}`}
            href={item.url}
            color={acLinkTileColors[i % acLinkTileColors.length]}
            aria-label={item.name ? undefined : item.url}
            badge={
              item.icon || !item.name ? (
                <AcIcon name={item.icon || 'link'} className="ac:text-[18px]" />
              ) : undefined
            }
          >
            {item.name}
          </AcLinkTile>
        ))}
      </div>
    </AcPanel>
  )
}
