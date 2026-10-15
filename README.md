# Lester's Curiosity Compass

个人网页收藏导航 —— 赛博像素风。部署在 Cloudflare Workers。

## 技术栈

- [Vite](https://vitejs.dev/) 7 + [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) v4（`@tailwindcss/vite` 插件，CSS-first 配置）
- `@heroicons/react`、`react-helmet-async`
- Cloudflare Workers（`wrangler.toml`，`[site]` 静态资源托管）

## 本地开发

```sh
npm install
npm run dev      # 启动开发服务器
npm run build    # 生产构建，产物在 dist/
npm run preview  # 本地预览构建产物
```

## 部署

推送到 GitHub 后，Cloudflare 会自动执行 `npm run build` 并部署 `dist/`。

## 书签数据

所有收藏站点在 `public/sites.json` 中维护，按 `name` 分组，每组有 `icon`（heroicons 名）
和 `list`（`url` / `name` / `desc` / `tips`，`tips` 支持 HTML，悬停显示）。

## 2026-10 大升级记录

- CRA（react-scripts）→ Vite 迁移；构建失败根因：Tailwind v4 已移除裸 `tailwindcss`
  PostCSS 插件，而 CRA 检测到 `tailwind.config.js` 会自动加载它
- React 19：`ReactDOM.render` → `createRoot`
- `react-helmet` → `react-helmet-async`；移除 `lodash`（自研 debounce）、`react-tooltip`（自研 CSS tooltip）
- 样式重做为赛博像素风（`src/index.css` 设计系统）
