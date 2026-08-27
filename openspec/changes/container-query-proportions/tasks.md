## 1. SidePanel 容器化和按钮单位转换

- [ ] 1.1 为 `src/components/SidePanel.vue` 的 `.side-panel-root` 添加 `container-type: size; container-name: side-panel`,并验证开发者工具显示容器上下文已建立
- [ ] 1.2 将 `src/components/ResultButtons.vue` 的按钮 `min-height` 从 `clamp(3.5rem, 7.5dvh, 5rem)` 改为 `clamp(2.75rem, 15cqh, 6rem)`,并验证 PC (1600×900) 下按钮高度为 96px
- [ ] 1.3 将 `src/components/UndoAction.vue` 的按钮 `min-height` 从 `clamp(3.5rem, 7.5dvh, 5rem)` 改为 `clamp(2.75rem, 15cqh, 6rem)`,并验证 iPad Pro 竖屏 (1024×1366) 下按钮高度为 96px
- [ ] 1.4 将 `ResultButtons.vue` 的按钮间距 `gap` 从 `clamp(0.375rem, 1.2dvh, 0.75rem)` 改为 `clamp(0.25rem, 2cqh, 0.875rem)`,并验证间距与按钮同步缩放
- [ ] 1.5 将 `SidePanel.vue` 的 `.side-panel-root` padding 从断点类 (`px-2 py-2 sm:px-3 sm:py-4 lg:px-4 lg:py-6`) 改为 CSS `padding: clamp(0.375rem, 2.5cqh, 1.25rem)`,并验证 PC 下 padding 约为 20px

## 2. 箭头尺寸容器化

- [ ] 2.1 将 `src/components/SidePanel.vue` 箭头容器的 Tailwind 类 `h-12 sm:h-14 lg:h-24` 替换为内联 CSS `height: clamp(2.25rem, 9cqh, 5rem)`,并验证 PC 下箭头容器高度约为 71px
- [ ] 2.2 将箭头图标的 Tailwind 类 `h-11 w-11 sm:h-12 sm:w-12 lg:h-20 lg:w-20` 替换为内联 CSS `width: clamp(2rem, 8cqh, 4.5rem); height: clamp(2rem, 8cqh, 4.5rem)`,并验证 PC 下箭头图标为 72×72px
- [ ] 2.3 在 PC (1600×900)、iPad Pro 竖屏 (1024×1366)、手机竖屏 (390×844) 三个尺寸验证箭头与按钮的高度比约为 0.75:1

## 3. ScoreCard 容器化和中央数字单位转换

- [ ] 3.1 为 `src/components/LevelProgressBars.vue` 或 `src/pages/Scoreboard.vue` 的 `.score-area` 添加 `container-type: size; container-name: score-area`,并验证开发者工具显示容器上下文已建立
- [ ] 3.2 将 `src/components/ScoreCard.vue` 的 `.score-number` 字号从 `clamp(4rem, min(28vw, 38dvh), 14rem)` 改为 `clamp(3.5rem, min(55cqw, 62cqh), 18rem)`,并验证 PC (1600×900) 下数字字号为 288px (18rem)
- [ ] 3.3 验证 iPad Pro 竖屏 (1024×1366) 下中央数字约为 254px,不溢出卡片高度
- [ ] 3.4 验证手机竖屏 (390×844) 下中央数字约为 157px,不溢出卡片高度

## 4. Grid 布局比例调整

- [ ] 4.1 将 `src/pages/Scoreboard.vue` 横屏 Grid 的 `grid-template-columns` 从 `clamp(7.5rem, 20vw, 17.5rem) minmax(11rem, 1fr) clamp(7.5rem, 20vw, 17.5rem)` 改为 `minmax(9rem, 22%) minmax(12rem, 1fr) minmax(9rem, 22%)`,并验证 PC (1600px 宽) 下侧栏宽度为 352px
- [ ] 4.2 验证平板横屏 (1024px 宽) 下侧栏宽度为 225px,中央区域宽度充足
- [ ] 4.3 将竖屏 Grid 的 `grid-template-rows` 从 `clamp(10rem, 30dvh, 26rem) minmax(0, 1fr)` 改为 `minmax(8rem, 32%) minmax(0, 1fr)`,并验证 iPad Pro 竖屏 (1366px 高) 下级数区高度为 437px
- [ ] 4.4 验证手机竖屏 (844px 高) 下级数区高度为 270px,操作区高度充足

## 5. 布局切换改容器查询

- [ ] 5.1 将 `src/components/ResultButtons.vue` 的矮横屏媒体查询 `@media (orientation: landscape) and (max-height: 500px)` 改为 `@container side-panel (height < 260px)`,并验证 667×375 矮横屏下结果按钮仍为纵排
- [ ] 5.2 创建一个测试场景 (浏览器窗口或开发者工具模拟) 使侧栏容器高度小于 260px,验证结果按钮切换为横排
- [ ] 5.3 验证布局切换判据从视口高度改为容器高度后,在 480~560px 高度区间连续调整窗口时无结构性跳变

## 6. 验证矩阵

- [ ] 6.1 在桌面宽屏 (1920×1080) 验证侧栏上限生效,按钮高度为 96px,无溢出
- [ ] 6.2 在桌面标准 (1600×900) 验证按钮高度为 96px,中央数字为 288px,箭头与按钮比例为 0.75:1
- [ ] 6.3 在笔记本 (1440×900) 验证比例与 1600×900 一致
- [ ] 6.4 在上网本 (1366×768) 验证按钮约为 96px,箭头不挤压按钮
- [ ] 6.5 在平板横屏 (1024×768) 验证侧栏宽度为 225px,按钮约为 90px
- [ ] 6.6 在 iPad Pro 竖屏 (1024×1366) 验证级数区高度为 437px,按钮高度为 96px,箭头与按钮比例为 0.75:1
- [ ] 6.7 在 iPad Air 竖屏 (820×1180) 验证按钮约为 96px,列宽约为 400px
- [ ] 6.8 在平板竖屏 (768×1024) 验证按钮约为 90px
- [ ] 6.9 在手机竖屏 (390×844) 验证按钮约为 82px,字号不触底 (大于 1.25rem)
- [ ] 6.10 在小手机竖屏 (320×568) 验证所有按钮触控目标 ≥44px,页面无溢出
- [ ] 6.11 在手机横屏 (844×390) 验证侧栏约为 200px,纵排按钮压缩至约 44px
- [ ] 6.12 在矮横屏 (667×375) 验证纵排按钮约为 44px 或横排,无重叠
- [ ] 6.13 在极矮横屏 (568×320) 验证横排生效,触控目标 ≥44px
- [ ] 6.14 在中间尺寸 (900×500) 验证无元素畸形、重叠或溢出
- [ ] 6.15 在中间尺寸 (1100×620) 验证无元素畸形、重叠或溢出
- [ ] 6.16 在分屏窗口 (600×800) 验证竖屏布局正常

## 7. 文档和回归测试

- [ ] 7.1 更新 `DESIGN.md` 的尺寸规则章节,补充容器查询约束和比例系统说明,记录 `15cqh` / `9cqh` / `8cqh` 等关键比例
- [ ] 7.2 在 README 或相关文档中补充浏览器兼容性要求: Chrome 105+、Safari 16+、Firefox 110+
- [ ] 7.3 运行现有的逻辑测试 (如 `optimize-responsive-direct-scoring` change 中的 5 项测试),确认容器查询改动未破坏计分逻辑
- [ ] 7.4 运行 `npm run build` 或等效的生产构建命令,确认无 CSS 语法错误
- [ ] 7.5 在一个旧版浏览器 (如 Chrome 104 或 Safari 15) 验证 fallback 回退到视口单位,界面仍基本可用