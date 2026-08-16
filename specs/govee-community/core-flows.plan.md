# Govee Community 核心流程测试计划

## 应用概览

- **Target:** `https://dev-community.govee.com/`
- **Purpose:** 覆盖社区浏览、内容发现、发布入口、Club、Support 以及响应式布局等核心功能，补充现有登录测试。
- **Execution:** 执行 Playwright 前设置 `$env:TARGET='govee-community'`。
- **Data strategy:** 断言稳定的标签、URL pattern 和可见模块状态；不要依赖会变化的帖子标题、数量或 Club 名称。
- **Authentication:** 公开场景需要不带 storage state 的全新 browser context。已登录场景依赖 `tests/e2e/govee-community/login/auth.setup.ts` 生成的 `.auth/govee-community.auth-state.json`。

## 公开首页与内容发现

### home-shell

Seed: 在全新的未登录 context 中打开 `/`。

File: `tests/e2e/govee-community/public-home-discovery/home-shell.spec.ts`

1. 打开社区首页。
   - expect: 页面标题为 `Govee Community`。
   - expect: 页面可见 `Clubs` 和 `Discover` 模块。
   - expect: Discover 区域提供 `Default`、`All`、`Questions`、`Posts` 和 `Videos` 控件。

### content-type-filters

Seed: 在全新的未登录 context 中打开 `/`，并确保 Discover 模块可见。

File: `tests/e2e/govee-community/public-home-discovery/content-type-filters.spec.ts`

1. 在 Discover 模块中选择 `Questions`。
   - expect: `Questions` 显示为选中状态，内容流仍然可用。
2. 分别选择 `Posts` 和 `Videos`。
   - expect: 每个选中的 filter 都变为 active 状态，页面没有错误。
3. 选择 `All`。
   - expect: 恢复未筛选的 Discover 内容流。

### search-trending-and-results

Seed: 在全新的未登录 context 中打开 `/`。

File: `tests/e2e/govee-community/public-home-discovery/search-trending-and-results.spec.ts`

1. 使用可访问的 search 控件打开搜索。
   - expect: 显示可见的 `Trending Searches` panel。
2. 输入稳定的通用 query，例如 `light`，并提交。
   - expect: 显示该 query 的搜索结果或可见的 empty-results 状态。
   - expect: 页面没有未捕获的 browser error。

### unauthenticated-post-gate

Seed: 在全新的未登录 context 中打开 `/`。

File: `tests/e2e/govee-community/public-home-discovery/unauthenticated-post-gate.spec.ts`

1. 激活可见的 `Post` action。
   - expect: 显示 `Sign In` modal。
   - expect: 显示 email/password 和支持的 social sign-in 选项。
2. 关闭 modal。
   - expect: modal 被关闭，首页仍可正常使用。

## 已登录首页与内容发布

### authenticated-home-content

Seed: 使用 `tests/e2e/govee-community/login/auth.setup.ts` 生成的 authenticated state，然后打开 `/`。

File: `tests/e2e/govee-community/authenticated-home-publishing/authenticated-home-content.spec.ts`

1. 验证已登录首页导航。
   - expect: 可见 `Following`、`Events` 和 `Co-Creations`。
2. 依次打开 `Events` 和 `Co-Creations`。
   - expect: 每个目标页面显示 content list 或可见的 empty state。
   - expect: 用户不会被重定向到 sign in 页面。

### post-editor-entry

Seed: 在 `/` 使用 authenticated state。如果出现 saved-draft prompt，关闭它，不恢复或修改 draft。

File: `tests/e2e/govee-community/authenticated-home-publishing/post-editor-entry.spec.ts`

1. 激活 `Post`。
   - expect: 打开 publishing editor，不显示 sign-in prompt。
2. 检查 editor，不输入或提交内容。
   - expect: 提供 `Posts`、`Videos` 和 `Questions` publishing mode。
   - expect: 可见 Title、body、Emoji、color link、DIY/Workshop link、Club、Preview 和 Submit 控件。
3. 关闭 editor。
   - expect: 没有提交帖子，且恢复首页。

## Club

### club-details-and-filters

Seed: 打开 `/`，动态选择第一个可见的 Club entry；不要依赖固定的 Club name。

File: `tests/e2e/govee-community/club/club-details-and-filters.spec.ts`

1. 从 `Clubs` 模块打开一个可见 Club。
   - expect: URL 匹配 `/clubs/{slug}/{id}`。
   - expect: 可见 Club detail heading 和 content stream。
2. 依次操作 `Officials`、`Posts Only` 和 `Questions Only` filters。
   - expect: 每个选中的 filter 变为 active，content area 保持有效的 loaded 或 empty 状态。
3. 返回 `All` 并检查排序。
   - expect: `All` 为 active，且可见 `Default` sort 控件。

### club-membership-join-and-leave

Seed: 在 `/` 使用 authenticated state，动态选择提供 `Join` action 的可见 Club；不要依赖固定的 Club name。记录所选 Club URL，以便清理相同的 membership。

File: `tests/e2e/govee-community/club/club-membership-join-and-leave.spec.ts`

1. 打开选定的 Club detail 页面并激活 `Join`。
   - expect: Join action 成功完成，且不会重定向到 sign in 页面。
   - expect: Membership control 变为 joined 状态，例如 `Joined` 或 `Leave`。
2. Reload Club detail 页面。
   - expect: Joined 状态在 reload 后仍然存在。
3. 激活 membership control；如果出现 prompt，确认 leave 操作。
   - expect: Membership control 恢复为 `Join` 状态。
4. 再次 reload Club detail 页面。
   - expect: Non-member 状态持久化，测试账号恢复为初始 membership 状态。

## Support

### support-navigation

Seed: 直接打开 `/support`；除非网站按设计执行 redirect，否则不需要 authentication。

File: `tests/e2e/govee-community/support/support-navigation.spec.ts`

1. 验证 Support landing page。
   - expect: 可见 Setup Guides、Troubleshooting、voice-assistant support、purchase Q&A、Others、Tech Specs、Video Guide 和 Rapid Replacement entries。
2. 打开一个稳定的 Support category，然后返回。
   - expect: 所选 category 打开 Support detail 或 listing view。
3. 检查 contact information。
   - expect: 可见 Support email 或 contact action。

## 响应式布局

### mobile-home-layout

Seed: 使用 viewport `390 x 844` 的全新未登录 context 打开 `/`。

File: `tests/e2e/govee-community/responsive/mobile-home-layout.spec.ts`

1. 检查首屏 mobile viewport。
   - expect: Clubs 显示为 compact mobile entry。
   - expect: Discover filters 和 content 仍然可见且可用。
2. 滚动页面，并在需要时独立滚动可见的 content container。
   - expect: 在主 stream 下方可以访问 Events、Co-Creations 和 footer content。
   - expect: 控件和文本不重叠，也不会超出 viewport。

## 实现说明

- 优先使用 `getByRole`、`getByLabel`，以及限定在相关 module 内的 visible text。响应式布局可能渲染重复的 hidden node，应使用 `{ visible: true }` 过滤。
- 为公开场景增加专用的 unauthenticated fixture 或 Playwright project，并设置 `storageState: undefined`，因为当前 Govee browser project 会加载 authenticated state。
- 每个 scenario 独立放在对应的 File 中。不要提交帖子、恢复 draft 或断言易变的 feed data。Membership 测试必须移除创建的 membership；即使中途失败，也要在 teardown 中执行 cleanup。
