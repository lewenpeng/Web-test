# Govee Community 探索总结

## 探索概况

- **目标环境：** `https://dev-community.govee.com/`
- **探索日期：** 2026-08-15
- **工具：** `playwright-cli`（Chromium）
- **视口：** 桌面默认视口、移动端 `390 x 844`
- **范围：** 首页、内容筛选、搜索入口、登录门禁、Club 详情、Support 页面及响应式结构

## 整体结论

站点首页可正常加载，页面标题为 `Govee Community`。公开用户可以浏览 Clubs 和 Discover 内容流，按 All、Questions、Posts、Videos 分类筛选，并访问 Club 详情与 Support 页面。登录后新增 Following 内容视图，Events、Co-Creations 和发帖编辑器可用。公开页面未发现控制台错误或警告；发帖编辑器初始化时产生两条 Tiptap 配置警告。

## 页面与核心功能

| 页面/模块 | 已验证行为 |
| --- | --- |
| 首页 `/` | 展示 Clubs、Discover 内容流、排序入口和内容分类筛选 |
| 搜索 | 点击搜索区显示 Trending Searches，包括多个推荐关键词 |
| 发帖 | 未登录点击 Post 会打开登录弹窗，不会直接进入编辑器 |
| 登录 | 支持邮箱密码、Apple 和 Google；新设备需完成四位邮箱验证码；注册需前往 Govee Home App |
| 登录后首页 | 显示 Following 视图，Events 与 Co-Creations 从登录提示切换为内容列表 |
| 发帖编辑器 | 支持 Posts、Videos、Questions，包含标题、正文、Emoji、颜色/DIY 链接、Club、Preview 和 Submit |
| Club 详情 | URL 使用 `/clubs/{slug}/{id}`；支持 All、Officials、Posts Only、Questions Only 和 Default 排序 |
| Support `/support` | 包含 Setup Guides、Troubleshooting、语音助手、购买前问答、Tech Specs、Video Guide 和联系方式 |

## 登录状态

提供的测试账号已通过邮箱、密码和新设备四位邮箱验证码，登录成功。已验证：

- 未登录与登录后首页状态切换
- Following 内容入口
- Events 与 Co-Creations 内容列表解锁
- 发帖编辑器打开及 Posts、Videos、Questions 类型入口
- 已有草稿提示可出现

以下功能未执行，以避免改变远程测试数据：

- 继续或覆盖已有草稿
- 媒体上传、Preview 和最终发布
- Club 加入、点赞、评论及收藏
- 用户资料修改和账号管理

未保存 Cookie、localStorage、认证状态或任何凭据。

## 响应式观察

移动端保留 Discover 筛选和内容流，Clubs 收敛为紧凑入口，Events、Co-Creations 与页脚链接排列到内容流下方。长英文、中文、Emoji、多图和视频型帖子均出现在测试数据中，适合覆盖换行、溢出、媒体比例及无限滚动场景。

## 自动化注意事项

- 页面标题、登录按钮、Support 链接和登录表单适合使用语义定位器。
- 多个可点击控件在可访问性树中仅表现为 `generic`，例如首页筛选、排序和部分导航入口；自动化时需优先按可见文本定位，并限制到对应模块。
- 内容流和 Clubs 使用独立滚动区域，滚动和懒加载测试应作用于正确容器，而不是只滚动页面根节点。
- 首页数据为动态测试内容，不宜断言固定帖子标题；应验证结构、类型筛选结果和稳定的模块文案。
- 验证码由四个独立输入框组成；自动化应先从最后一格连续按 Backspace 清空，再从第一格按键输入完整验证码。
- 发帖编辑器基于 Tiptap，初始化时报告重复的 `paragraph`、`doc`、`text`、`heading` 扩展名称，应关注编辑器行为和序列化结果。

## 建议测试范围

### P0

1. 首页加载、标题和核心模块可见。
2. All、Questions、Posts、Videos 筛选可切换并刷新内容流。
3. 未登录点击 Post、Events、Co-Creations 时出现登录门禁。
4. 邮箱密码登录、新设备验证码及错误凭据提示。
5. Club 详情打开、内容类型筛选和排序。
6. Support 分类链接和站内路由正确。

### P1

1. 搜索关键词、空结果、帖子/话题/用户结果分类。
2. 长文本、多语言、Emoji、图片及视频内容展示。
3. 移动端内容布局、滚动加载和页脚导航。
4. 登录后的发帖、互动、Club 加入和个人资料流程。

## 当前风险

- 邮箱验证码具有时效性，新建浏览器会话会触发新验证码，自动化需要由安全的测试邮箱服务动态获取。
- 开发环境测试数据变化频繁，基于具体内容或数量的断言容易不稳定。
- 部分交互元素缺少明确语义角色，页面结构调整可能影响文本或 CSS 定位器。
- 发帖编辑器存在 Tiptap 重复扩展警告，可能导致节点解析、工具栏或内容序列化异常。
