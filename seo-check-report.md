# SEO 检查报告

生成时间: 2026-04-19
项目: windrosewiki.wiki

## 检查摘要

- ✅ 通过: 36 项
- ❌ 失败: 0 项
- ⚠️ 警告: 3 项
- 📊 总计: 39 项

## 详细结果

### 阶段 1：代码结构检查

#### 1.1 根 Layout (`src/app/layout.tsx`)
- ✅ 根 layout 存在并由 locale layout 承担 html/body 语义结构

#### 1.2 Locale Layout (`src/app/[locale]/layout.tsx`)
- ✅ 包含 `<html lang={locale}>`
- ✅ robots / OpenGraph / Twitter 元数据完整
- ✅ alternates（canonical + hreflang）通过 `buildLanguageAlternates` 动态生成

#### 1.3 动态页面 SEO (`src/app/[locale]/[...slug]/page.tsx`)
- ✅ `generateMetadata` 覆盖列表页与详情页
- ✅ alternates / OpenGraph / robots 配置存在
- ✅ 非英文内容缺失时可 fallback 到英文
- ✅ 旧品牌文本在元数据层通过 `normalizeBrand` 兜底替换

#### 1.4 Sitemap (`src/app/sitemap.ts`)
- ✅ 使用 `NEXT_PUBLIC_SITE_URL` + fallback 域名
- ✅ 覆盖首页、静态页面、多语言与全部 MDX 内容 URL
- ✅ 优先级与更新频率配置存在

#### 1.5 国际化配置 (`src/i18n/routing.ts`)
- ✅ `localePrefix: 'as-needed'`
- ✅ `defaultLocale: 'en'`
- ✅ `localeDetection: true`
- ✅ 当前路由语言: `en/de/ru/pt`

#### 1.6 结构化数据
- ✅ 首页包含 `WebSite` / `SearchAction` / `Organization` JSON-LD
- ✅ 详情页包含 `ArticleStructuredData`
- ✅ 列表页包含 `ListStructuredData`

#### 1.7 robots.txt
- ✅ `public/robots.txt` 存在并允许抓取
- ✅ 含 sitemap 链接

#### 1.8 H1 / 主题语义
- ✅ 首页 H1 为主题词（Windrose）
- ✅ 列表页 H1 一致且语义正确
- ✅ 详情页 H1 已改为完整 `frontmatter.title`（避免截断语义）

#### 1.9 图片与社媒卡片
- ✅ 法务静态页 (`about/privacy/terms/copyright`) OG/Twitter 图片已修复为现有资源 `/images/hero.webp`
- ✅ 消除 `og-image.jpg` 404 风险

#### 1.10 链接一致性 / 内链完整性
- ✅ 首页模块内链存在（首页可抽取 59 条站内内容链接）
- ✅ 首页与多语言入口可用：`/`, `/de`, `/ru`, `/pt` 均返回 200
- ✅ 详情页路由可用：`/guide/windrose-beginner-guide` 返回 200
- ✅ sitemap 路由可用：`/sitemap.xml` 返回 200

### 阶段 2：构建验证

- ✅ `npm run typecheck` 通过
- ✅ `npm run lint` 通过（无 ESLint 错误）
- ✅ `npm run build` 通过（SSG 路径完整生成）

### 阶段 3：品牌残留 / 文案检查

- ✅ 运行时首页与多语言首页未检出旧品牌词（Lucid Blocks / Heartopia / Bizarre Lineage）
- ✅ `{{OLD_THEME}}` 占位词在首页输出计数为 0
- ✅ `de/ru/pt` 翻译文件已覆盖重建，JSON 均合法

### 阶段 4：翻译专项

- ✅ 已按脚本执行覆盖翻译：`de`, `ru`, `pt`
- ✅ `de/ru/pt` 行数已与 `en.json` 接近（1698 vs 1699）
- ✅ 文件末尾抽查已翻译完成（无英文尾部残留）
- ✅ 所有 locale 文件 JSON 语法通过校验

## 已修复项（本次）

1. 修复静态页 OG/Twitter 图片指向不存在资源的问题
2. 修复静态页内部 Link 一致性（改为 i18n Link）
3. 详情页 H1 改为完整标题，增强页面主题语义
4. 移除根页强制重定向文件，保证 `/` 首页直达 200
5. 修复 dev 下动态路由 500：将 `src/i18n/request.ts` 的 `deepmerge` 依赖替换为本地递归合并函数，避免 `vendor-chunks/deepmerge.js` 缺失

## 警告项（不阻断）

1. `next-intl` 在 webpack cache 下有 `import(t)` 解析告警（Next 构建已成功，非阻断）
2. `next lint` 命令被官方标记为将废弃（建议后续迁移到 ESLint CLI）
3. `/en` 在 `localePrefix: as-needed` 下返回 307 到默认路径，这属于预期行为

## 结论

当前 SEO 与多语言链路已完成修复并通过本地验证，满足上线前基础要求。
