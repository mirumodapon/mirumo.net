import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LinksPanel } from './LinksPanel'
import { SocialFooter } from './SocialFooter'

describe('links and socials without a label', () => {
  it('names an unlabeled tile by its url and shows its icon', () => {
    const html = renderToStaticMarkup(
      <LinksPanel title="LINKS" items={[{ name: '', url: 'https://a.test/', icon: 'home' }]} />,
    )
    expect(html).toContain('aria-label="https://a.test/"')
    expect(html).toContain('ti-home')
  })

  it('gives an unlabeled tile without an icon a link icon', () => {
    const html = renderToStaticMarkup(
      <LinksPanel title="LINKS" items={[{ name: '', url: 'https://a.test/' }]} />,
    )
    expect(html).toContain('ti-link')
  })

  it('keeps a labeled tile unnamed by aria-label', () => {
    const html = renderToStaticMarkup(
      <LinksPanel title="LINKS" items={[{ name: 'A', url: 'https://a.test/' }]} />,
    )
    expect(html).not.toContain('aria-label=')
  })

  it('names an unlabeled social chip by its url', () => {
    const html = renderToStaticMarkup(
      <SocialFooter socials={[{ name: '', url: 'https://x.com/a', icon: 'brand-x' }]} />,
    )
    expect(html).toContain('aria-label="https://x.com/a"')
    expect(html).toContain('ti-brand-x')
  })

  it('gives an unlabeled chip without an icon a link icon', () => {
    const html = renderToStaticMarkup(
      <SocialFooter socials={[{ name: '', url: 'https://x.com/a' }]} />,
    )
    expect(html).toContain('ti-link')
  })

  it('keeps a labeled chip unnamed by aria-label', () => {
    const html = renderToStaticMarkup(
      <SocialFooter socials={[{ name: 'X', url: 'https://x.com/a', icon: 'brand-x' }]} />,
    )
    expect(html).not.toContain('aria-label=')
  })
})
