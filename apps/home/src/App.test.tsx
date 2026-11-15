import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import {
  resolveSettings,
  type DeepPartial,
  type GlobalConfig,
  type WorkspaceConfig,
} from './config'

type WorkspaceOverrides = DeepPartial<WorkspaceConfig>
type GlobalOverrides = DeepPartial<GlobalConfig>

const render = (workspace: WorkspaceOverrides = {}, global: GlobalOverrides = {}, stage = 1) => {
  const settings = resolveSettings({ global, workspaces: [workspace] })
  return renderToStaticMarkup(
    <App global={settings.global} workspace={settings.workspaces[0]!} stage={stage} />,
  )
}

const renderTimeOnly = (
  workspace: WorkspaceOverrides = {},
  global: GlobalOverrides = {},
  stage = 1,
) => render({ layout: 'time-only', ...workspace }, global, stage)

const gmail = { name: 'Gmail', url: 'https://mail.google.com/' }
const withLinks: WorkspaceOverrides = {
  linkGroups: [{ title: 'LINKS', items: [{ ...gmail, icon: 'brand-gmail' }] }],
  socials: [{ name: 'X', url: 'https://x.com/', icon: 'brand-x' }],
}
const github = { name: 'GitHub', url: 'https://github.com/' }

const datePattern = /\d{4}\.\d{2}\.\d{2}/

describe('time-only layout', () => {
  it('shows the MIRUMO title, the 1UP greeting and the TIME panel with the date', () => {
    const html = renderTimeOnly({})
    expect(html).toContain('MIRUMO')
    expect(html).toContain('1UP')
    expect(html).toMatch(/GOOD MORNING|GOOD AFTERNOON|GOOD EVENING|LATE NIGHT/)
    expect(html).toContain('TIME')
    expect(html).toMatch(datePattern)
  })
  it('spans the full screen width', () => {
    expect(renderTimeOnly({})).not.toMatch(/ac:max-w-/)
  })
  it('centers the time and date inside the full-width card', () => {
    expect(renderTimeOnly({})).toMatch(/<div class="ac:text-center"><time/)
  })
  it('centers the card vertically in the space below the marquee', () => {
    const html = renderTimeOnly({})
    expect(html).toMatch(/ac:min-h-\[calc\(100dvh_-_3\.5rem\)\][^"]*ac:grid-rows-\[auto_1fr\]/)
    expect(html).toMatch(/<section[^>]*ac:self-center/)
  })
  it('spaces the card evenly above and below so the centering is symmetric', () => {
    const html = renderTimeOnly({})
    expect(html).not.toMatch(/ac:grid-rows-\[auto_1fr\][^"]*ac:gap-/)
    expect(html).toMatch(/<section[^>]*ac:my-6/)
  })
  it('shows the STAGE label and the hex stage number', () => {
    const html = renderTimeOnly({}, {}, 2)
    expect(html).toContain('STAGE')
    expect(html).toContain('0x02')
  })
  it('uses the configured stage label', () => {
    expect(renderTimeOnly({}, { stage: { label: 'WORLD' } })).toContain('WORLD')
  })
  it('uses the configured greeting and title text', () => {
    const html = renderTimeOnly({}, { title: 'ARCADE', player: { text: 'READY' } })
    expect(html).toContain('ARCADE')
    expect(html).toContain('READY')
    expect(html).not.toMatch(/GOOD MORNING|GOOD AFTERNOON|GOOD EVENING|LATE NIGHT/)
  })
  it('hides the date and seconds when turned off', () => {
    const html = renderTimeOnly({ clock: { date: false, seconds: false } })
    expect(html).not.toMatch(datePattern)
    expect(html).not.toMatch(/<time[^>]*>\d{2}:\d{2}<span/)
  })
})

describe('clock layout', () => {
  it('shows only the time', () => {
    const html = render({ layout: 'clock' })
    expect(html).toMatch(/\d{2}:\d{2}/)
    expect(html).not.toContain('MIRUMO')
    expect(html).not.toContain('1UP')
    expect(html).not.toContain('STAGE')
    expect(html).not.toContain('TIME')
    expect(html).not.toMatch(datePattern)
  })
})

describe('default layout', () => {
  it('shows the marquee, time, weather, links and social footer', () => {
    const html = render(withLinks)
    for (const text of [
      'STAGE',
      'TIME',
      'WEATHER',
      'LOADING',
      'LINKS',
      'Gmail',
      'href="https://mail.google.com/"',
      '<footer',
      'href="https://x.com/"',
      'target="_blank"',
    ]) {
      expect(html).toContain(text)
    }
    expect(html).toMatch(/\d{2}:\d{2}/)
    expect(html).toMatch(datePattern)
    expect(html).not.toContain('TAIPEI')
  })
  it("shows only today's weather, without the next days", () => {
    const html = render({})
    expect(html).not.toContain('TODAY')
    expect(html).not.toMatch(/>\d{2}\/\d{2}</)
  })
  it('pushes the social footer to the bottom of the screen', () => {
    const html = render({})
    expect(html).toMatch(/ac:min-h-\[calc\(100dvh_-_3\.5rem\)\][^"]*ac:flex-col/)
    expect(html).toMatch(/<footer[^>]*ac:mt-auto/)
  })
  it('shows each link icon in its badge', () => {
    expect(render(withLinks)).toContain('ti-brand-gmail')
  })
  it('falls back to the first letter for a link without an icon', () => {
    const html = render({
      linkGroups: [{ title: 'LINKS', items: [{ name: 'Wiki', url: 'https://wiki.example/' }] }],
    })
    expect(html).toMatch(/aria-hidden="true">W</)
  })
  it('treats an empty icon as no icon', () => {
    const html = render({
      linkGroups: [
        { title: 'LINKS', items: [{ name: 'Wiki', url: 'https://wiki.example/', icon: '' }] },
      ],
    })
    expect(html).toMatch(/aria-hidden="true">W</)
  })
  it('hides the links panel when there are no links', () => {
    expect(render({ linkGroups: [{ title: 'LINKS', items: [] }] })).not.toContain('LINKS')
  })
  it('shows one panel per link group, stacked in order', () => {
    const html = render({
      linkGroups: [
        { title: 'WORK', items: [gmail] },
        { title: 'DEV', items: [github] },
      ],
    })
    expect(html).toContain('WORK')
    expect(html).toContain('DEV')
    expect(html.indexOf('WORK')).toBeLessThan(html.indexOf('DEV'))
    expect(html).not.toContain('LINKS')
  })
  it('skips a link group with no links', () => {
    const html = render({
      linkGroups: [
        { title: 'EMPTY', items: [] },
        { title: 'DEV', items: [github] },
      ],
    })
    expect(html).not.toContain('EMPTY')
    expect(html).toContain('DEV')
  })
  it('hides the footer when there are no socials', () => {
    expect(render({ socials: [] })).not.toContain('<footer')
  })
  it('shows the configured place for a fixed weather location', () => {
    expect(render({ weather: { source: 'fixed', place: 'TOKYO' } })).toContain('TOKYO')
  })
})

describe('switching workspaces from the STAGE block', () => {
  const renderWith = (layout: WorkspaceOverrides['layout'], onNextStage?: () => void) => {
    const settings = resolveSettings({ workspaces: [{ layout }] })
    return renderToStaticMarkup(
      <App
        global={settings.global}
        workspace={settings.workspaces[0]!}
        stage={1}
        onNextStage={onNextStage}
      />,
    )
  }
  const stageBlock = /<div[^>]*title="雙擊切換 workspace"[^>]*>(?:(?!<\/div>).)*STAGE/

  it('hints the double-click on the STAGE block in the default and time-only layouts', () => {
    for (const layout of ['default', 'time-only'] as const) {
      const html = renderWith(layout, () => {})
      expect(html).toMatch(stageBlock)
      expect(html).toMatch(
        /<div[^>]*ac:select-none[^>]*title="雙擊切換 workspace"|<div[^>]*title="雙擊切換 workspace"[^>]*ac:select-none/,
      )
    }
  })
  it('also shows STAGE on narrow screens, next to 1UP, with the same double tap', () => {
    const html = renderWith('default', () => {})
    expect(html).toMatch(
      /ac:md:hidden[^>]*>(?:(?!<\/div>).)*1UP(?:(?!<\/div>).)*<span[^>]*title="雙擊切換 workspace"[^>]*>(?:(?!<\/div>).)*STAGE/,
    )
    expect(html).toMatch(
      /<div[^>]*ac:md:flex-col[^>]*title="雙擊切換 workspace"|<div(?=[^>]*title="雙擊切換 workspace")(?=[^>]*ac:md:flex)[^>]*>/,
    )
  })
  it('adds no hint without a switch handler', () => {
    expect(renderWith('default')).not.toContain('雙擊切換 workspace')
  })
})

describe('title bar visibility', () => {
  const reveal = 'data-marquee-reveal'
  it('shows the title bar inline by default in the default and time-only layouts', () => {
    for (const layout of ['default', 'time-only'] as const) {
      const html = render({ layout })
      expect(html).toContain('<header')
      expect(html).not.toContain(reveal)
    }
  })
  it('hides the title bar and offers the top hover reveal when turned off', () => {
    for (const layout of ['default', 'time-only'] as const) {
      const html = render({ layout }, { marquee: { visible: false } })
      expect(html).not.toContain('<header')
      expect(html).toContain(reveal)
    }
  })
  it('centers the time-only card on the whole screen without the title bar', () => {
    const html = render({ layout: 'time-only' }, { marquee: { visible: false } })
    expect(html).not.toMatch(/ac:grid-rows-\[auto_1fr\]/)
  })
  it('offers the top hover reveal in the clock layout even when the title bar is on', () => {
    const html = render({ layout: 'clock' })
    expect(html).not.toContain('<header')
    expect(html).toContain(reveal)
  })
})

describe('clock layout title bar', () => {
  it('shows the title bar on the page when the clock layout turns it on', () => {
    const html = render({ layout: 'clock', clockLayout: { marquee: true } })
    expect(html).toContain('<header')
    expect(html).not.toContain('data-marquee-reveal')
  })
  it('follows its own setting, not the global one', () => {
    const html = render(
      { layout: 'clock', clockLayout: { marquee: true } },
      { marquee: { visible: false } },
    )
    expect(html).toContain('<header')
  })
})

describe('touch screens', () => {
  it('leaves room at the bottom for the always-visible gear', () => {
    expect(render({})).toContain('ac:[@media(hover:none)]:pb-16')
  })
})
