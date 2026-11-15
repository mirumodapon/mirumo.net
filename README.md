# mirumo.net

一個街機風格的個人首頁，以及它使用的 UI 元件庫。

- **首頁**：GitHub Pages 網站根目錄 `/`
- **Storybook**：`/storybook/`

## 專案結構

這是一個 pnpm workspace：

| 路徑                 | 套件                | 內容                        |
| -------------------- | ------------------- | --------------------------- |
| `apps/home`          | `@mirumo/home`      | 首頁（Vite + React）        |
| `apps/storybook`     | `@mirumo/storybook` | 元件展示與文件              |
| `packages/arcade-ui` | `@mirumo/arcade-ui` | 街機風格的 React 元件與樣式 |

## 開始

需要 Node.js 24 以上與 pnpm 12。以下指令都在 repo 根目錄執行：

```sh
pnpm install

# 首頁，打開 http://localhost:5173
pnpm --filter @mirumo/home dev

# Storybook，打開 http://localhost:6006
pnpm --filter @mirumo/storybook dev
```

### 常用指令

```sh
pnpm format          # 格式化（oxfmt）
pnpm format:check    # 檢查格式
pnpm lint            # oxlint
pnpm typecheck       # 所有套件的 TypeScript 檢查
pnpm test            # 所有套件的測試（Vitest）

pnpm --filter @mirumo/home build        # 輸出到 apps/home/dist/
pnpm --filter @mirumo/storybook build   # 輸出到 apps/storybook/storybook-static/
```

### 依賴版本

套件版本統一定義在 `pnpm-workspace.yaml` 的 `catalog`，各個 `package.json` 裡只寫 `catalog:`。

## 首頁

### Workspace

- **多個 workspace**：首頁可以有多個 workspace，各自有自己的版面與內容，彼此獨立。
- **切換**：用網址的 hash 切換，例如 `#2` 或 `#0x02`。
- **右上角的 STAGE**：顯示目前是第幾個 workspace，例如 `STAGE 0x01`。

### 版面

| `layout`    | 內容                                   |
| ----------- | -------------------------------------- |
| `default`   | 標題列、時間與天氣、連結群組、社群連結 |
| `time-only` | 標題列與置中的時間卡片                 |
| `clock`     | 只有置中的大字時間                     |

### 設定

**打開設定**：滑鼠移到右下角會出現齒輪；觸控裝置上齒輪一直顯示。

**分頁**：設定對話框依 tab 分類：

- **`GLOBAL`**：標題、1UP 文字、STAGE 字樣、掃描線、標題列、workspace 的新增與刪除、重設為設定檔。
- **`STAGE 0xNN`**：每個 workspace 一個 tab，只顯示該版面用得到的設定，例如連結群組、社群、天氣地點、時鐘選項。

**儲存的位置**：儲存後，完整的設定存在瀏覽器（localStorage）。「重設為設定檔」會回到 `apps/home/home.config.ts` 的內容。

**設定檔**：`home.config.ts` 只寫要覆蓋預設值的部分，預設值在 `apps/home/src/config/defaults.ts`。

```ts
import type { HomeConfigFile } from './src/config'

export default {
  global: { title: 'MIRUMO', player: { text: '' } },
  workspaces: [
    {},
    { layout: 'clock', clockLayout: { marquee: true } },
    {
      weather: { source: 'fixed', place: 'TOKYO', latitude: 35.6895, longitude: 139.6917 },
      linkGroups: [
        {
          title: 'WORK',
          items: [{ name: 'Gmail', url: 'https://mail.google.com/', icon: 'brand-gmail' }],
        },
      ],
    },
  ],
} satisfies HomeConfigFile
```

**合併規則**：物件會逐層合併，陣列（例如 `linkGroups`、`socials`）則是整個取代。

**1UP 文字**：留空時，依時間顯示 `GOOD MORNING`、`GOOD AFTERNOON`、`GOOD EVENING` 或 `LATE NIGHT`。

### 天氣

**資料來源**：[Open-Meteo](https://open-meteo.com/)，每個地點每小時最多抓取一次，資料存在瀏覽器裡。

**地點**：

- **目前位置（預設）**：使用瀏覽器的定位。城市名稱透過 [Nominatim](https://nominatim.openstreetmap.org/)（OpenStreetMap）反查，每個地點只查一次。
- **指定地點**：在設定裡搜尋城市，使用 Open-Meteo 的地名搜尋 API。

### 操作

| 動作                   | 滑鼠                      | 觸控              |
| ---------------------- | ------------------------- | ----------------- |
| 切換到下一個 workspace | 雙擊 STAGE                | 雙點 STAGE        |
| 重新抓取天氣           | 雙擊 `UPDATED` 後面的時間 | 雙點同一處        |
| 顯示隱藏的標題列       | 游標停在畫面上方 2 秒     | 按住畫面上方 2 秒 |
| 打開設定               | 移到右下角後點齒輪        | 點右下角的齒輪    |

## 元件庫 `@mirumo/arcade-ui`

### 使用

```ts
import { AcButton, AcPanel } from '@mirumo/arcade-ui'
import '@mirumo/arcade-ui/index.css'
```

### 慣例

- **前綴**：元件名稱都以 `Ac` 開頭。Tailwind 使用 `prefix(ac)`，class 寫成 `ac:bg-wall`，CSS 變數是 `--ac-color-*`。
- **Icon**：使用 [Tabler Icons](https://tabler.io/icons) 的 webfont，props 直接傳 icon 名稱，例如 `prefix="settings"`。目前只支援線條版本。
- **字型**：Press Start 2P（像素字型）與 Noto Sans TC 都已打包在套件裡，不需要另外載入。
- **Story**：每個元件都有對應的 Storybook story，放在 `apps/storybook/src/arcade/`。

### 新增 Storybook 內容

所有檔案都放在 `apps/storybook/src/` 底下，Storybook 會自動找到：

- **文件頁**：`*.mdx`，放在 `docs/`。
- **Story**：`*.stories.ts(x)`，展示元件的各種狀態。

樣式由 `.storybook/preview.ts` 引用 `@mirumo/arcade-ui/index.css`。Storybook 的 Introduction 頁面直接顯示這份 README。

## 部署

GitHub Actions（`.github/workflows/`）：

- **`ci.yml`**：每次 push 與 PR，執行格式、lint、型別、測試與兩個 build。
- **`pages.yml`**：push 到 `main` 時，把首頁放在網站根目錄、Storybook 放在 `/storybook/`，部署到 GitHub Pages。

> **需要的設定**：repo 的 Settings → Pages → Source 要設為 **GitHub Actions**。

兩個網站都以相對路徑建置，所以不論是部署在 `mirumodapon.github.io/mirumo.net/`，還是之後改用自訂網域的根目錄，都不需要修改設定。

## 授權與資料來源

- **天氣資料**：[Open-Meteo](https://open-meteo.com/)（CC BY 4.0）。
- **地名資料**：© [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors，透過 Nominatim 取得。
- **Icon**：[Tabler Icons](https://tabler.io/icons)（MIT）。
- **字型**：Press Start 2P、Noto Sans TC（SIL Open Font License）。
