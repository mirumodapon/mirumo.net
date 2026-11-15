import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { resolveSettings } from '../config'
import { SettingsButton } from './SettingsButton'
import { SettingsDialog } from './SettingsDialog'

const noop = () => {}

const renderDialog = (file: Parameters<typeof resolveSettings>[0] = {}, stage = 1) =>
  renderToStaticMarkup(
    <SettingsDialog
      open
      settings={resolveSettings(file)}
      stage={stage}
      onSave={noop}
      onCancel={noop}
      onReset={noop}
    />,
  )

const sixLinks = ['Gmail', 'Calendar', 'GitHub', 'Drive', 'Notion', 'Claude'].map((name) => ({
  name,
  url: `https://${name.toLowerCase()}.example/`,
}))

const fourSocials = ['GitHub', 'X', 'Instagram', 'LinkedIn'].map((name) => ({
  name,
  url: `https://${name.toLowerCase()}.example/`,
}))

const withLinks = {
  workspaces: [{ linkGroups: [{ title: 'LINKS', items: sixLinks }], socials: fourSocials }],
}

const disabledButton = (label: string) =>
  new RegExp(`<button(?=[^>]*aria-label="${label}")(?=[^>]*\\sdisabled="")[^>]*>`)

describe('SettingsDialog', () => {
  it('has the title, both tabs and the actions', () => {
    const html = renderDialog()
    for (const text of ['SETTINGS', 'STAGE 0x01', 'GLOBAL', 'role="tablist"', '取消', '儲存']) {
      expect(html).toContain(text)
    }
  })
  it('edits the current workspace', () => {
    const html = renderDialog(withLinks)
    for (const text of [
      '<option value="default"',
      '<option value="time-only"',
      '<option value="clock"',
      'aria-label="天氣來源"',
      '<option value="fixed"',
      '<option value="current"',
      'aria-label="群組 1 標題"',
      'value="LINKS"',
      'value="Gmail"',
      'aria-label="連結 1 名稱"',
      'aria-label="社群 4 網址"',
      '＋ 新增連結',
      '＋ 新增群組',
      '＋ 新增社群',
    ]) {
      expect(html).toContain(text)
    }
  })
  it('disables moving the first row up and the last row down', () => {
    const html = renderDialog(withLinks)
    expect(html).toMatch(disabledButton('連結 1 上移'))
    expect(html).toMatch(disabledButton('連結 6 下移'))
    expect(html).not.toMatch(disabledButton('連結 2 上移'))
  })
  it('edits the global settings', () => {
    const html = renderDialog()
    for (const text of [
      'value="MIRUMO"',
      'value="1UP"',
      'placeholder="留空依時間顯示"',
      '顯示標題列（default／time-only）',
      'value="STAGE"',
      '＋ 新增 workspace',
      '重設為設定檔',
    ]) {
      expect(html).toContain(text)
    }
  })
  it('does not allow deleting the only workspace', () => {
    expect(renderDialog()).toMatch(disabledButton('刪除 0x01'))
  })
  it('lists GLOBAL first, then one tab per workspace', () => {
    const html = renderDialog({ workspaces: [{}, {}, {}] })
    const tabs = [...html.matchAll(/role="tab"[^>]*>([^<]*)</g)].map((match) => match[1])
    expect(tabs).toEqual(['GLOBAL', 'STAGE 0x01', 'STAGE 0x02', 'STAGE 0x03'])
  })
  it('opens on the current workspace tab', () => {
    const html = renderDialog(
      { workspaces: [{}, { weather: { source: 'fixed', place: 'TOKYO' } }] },
      2,
    )
    const selected = [...html.matchAll(/role="tab"[^>]*aria-selected="true"[^>]*>([^<]*)</g)]
    expect(selected.map((match) => match[1])).toEqual(['STAGE 0x02'])
    expect(html).toContain('TOKYO · ')
    expect(html).not.toMatch(disabledButton('刪除 0x02'))
  })
  it('keeps every workspace editable in its own panel', () => {
    const html = renderDialog({
      workspaces: [
        { weather: { source: 'fixed', place: 'TAIPEI' } },
        { weather: { source: 'fixed', place: 'TOKYO' } },
      ],
    })
    expect(html).toContain('TAIPEI · ')
    expect(html).toContain('TOKYO · ')
  })
})

describe('SettingsDialog scrolling', () => {
  it('keeps the title, tab bar and actions out of the scrolling area', () => {
    const html = renderDialog()
    const dialogTag = html.match(/<dialog[^>]*>/)![0]
    expect(dialogTag).not.toContain('ac:overflow-auto')
    expect(dialogTag).toContain('ac:open:flex')
    expect(html).toMatch(/<div role="tablist"[^>]*ac:shrink-0/)
    expect(html).toMatch(/<div role="tablist"[^>]*ac:overflow-x-auto/)
    expect(html).not.toMatch(/<div role="tablist"[^>]*ac:flex-wrap/)
    expect(html).toMatch(/<div role="tabpanel"[^>]*ac:overflow-auto/)
    const footerIndex = html.lastIndexOf('儲存')
    const lastPanelEnd = html.lastIndexOf('role="tabpanel"')
    expect(footerIndex).toBeGreaterThan(lastPanelEnd)
    expect(html).toMatch(/<div class="[^"]*ac:shrink-0[^"]*"><button[^>]*>取消/)
  })
})

describe('SettingsButton', () => {
  it('is an icon-only gear labelled SETTINGS', () => {
    const html = renderToStaticMarkup(<SettingsButton onOpen={noop} />)
    expect(html).toContain('aria-label="SETTINGS"')
    expect(html).toContain('ti-settings')
  })
})

describe('workspace settings follow the layout', () => {
  const count = (html: string, text: string) => html.split(text).length - 1
  const forLayout = (layout: 'default' | 'time-only' | 'clock') =>
    renderDialog({ workspaces: [{ layout }] })

  it('shows everything for the default layout', () => {
    const html = forLayout('default')
    for (const text of ['顯示秒數', '顯示日期', '地點', '＋ 新增群組', '＋ 新增社群']) {
      expect(html).toContain(text)
    }
    expect(count(html, '>顯示標題列<')).toBe(0)
  })
  it('shows only the clock options for time-only', () => {
    const html = forLayout('time-only')
    expect(html).toContain('顯示秒數')
    expect(html).toContain('顯示日期')
    for (const text of ['地點', '＋ 新增群組', '＋ 新增社群']) expect(html).not.toContain(text)
  })
  it('shows seconds and its own title bar toggle for clock', () => {
    const html = forLayout('clock')
    expect(html).toContain('顯示秒數')
    expect(html).toContain('>顯示標題列<')
    for (const text of ['顯示日期', '地點', '＋ 新增群組', '＋ 新增社群'])
      expect(html).not.toContain(text)
  })
})

describe('weather settings', () => {
  it('searches for a city when the source is a fixed place', () => {
    const html = renderDialog({ workspaces: [{ weather: { source: 'fixed' } }] })
    expect(html).toContain('TAIPEI · 25.0330, 121.5654')
    expect(html).toContain('aria-label="搜尋城市"')
    expect(html).toContain('>搜尋<')
    expect(html).not.toContain('aria-label="地點名稱"')
  })
  it('names the place automatically when following the current position', () => {
    const html = renderDialog()
    expect(html).toContain('地點名稱會依目前位置自動顯示')
    expect(html).not.toContain('aria-label="地點名稱"')
    expect(html).not.toContain('aria-label="搜尋城市"')
  })
})

describe('settings rows on narrow screens', () => {
  it('splits each link row in two below 480px', () => {
    expect(renderDialog()).toContain('ac:max-[480px]:grid-cols-')
  })
})
