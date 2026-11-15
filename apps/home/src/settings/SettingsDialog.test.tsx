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
    const html = renderDialog()
    for (const text of [
      '<option value="default"',
      '<option value="time-only"',
      '<option value="clock"',
      'value="TAIPEI"',
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
    const html = renderDialog()
    expect(html).toMatch(disabledButton('連結 1 上移'))
    expect(html).toMatch(disabledButton('連結 6 下移'))
    expect(html).not.toMatch(disabledButton('連結 2 上移'))
  })
  it('edits the global settings', () => {
    const html = renderDialog()
    for (const text of [
      'value="MIRUMO"',
      'value="1UP"',
      'value="HELLO"',
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
  it('opens on the current stage', () => {
    const html = renderDialog({ workspaces: [{}, { weather: { place: 'TOKYO' } }] }, 2)
    expect(html).toContain('STAGE 0x02')
    expect(html).toContain('value="TOKYO"')
    expect(html).not.toMatch(disabledButton('刪除 0x02'))
  })
})

describe('SettingsDialog scrolling', () => {
  it('keeps the title, tab bar and actions out of the scrolling area', () => {
    const html = renderDialog()
    const dialogTag = html.match(/<dialog[^>]*>/)![0]
    expect(dialogTag).not.toContain('ac:overflow-auto')
    expect(dialogTag).toContain('ac:open:flex')
    expect(html).toMatch(/<div role="tablist"[^>]*ac:shrink-0/)
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
