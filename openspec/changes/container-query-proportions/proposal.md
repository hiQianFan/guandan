## Why

当前响应式实现使用视口单位(`vw`/`dvh`/`vmin`)和 Tailwind 断点类,导致三端(PC/平板/手机)元素比例失调:按钮触控目标相对界面偏小,箭头与按钮视觉权重不一致,中央级数数字被过度压制,且在 1023→1024px 和 500px 高度等断点处出现突变。需改用 CSS Container Queries 让组件尺寸基于实际容器而非视口,统一各端视觉比例,提升触控体验。

## What Changes

- 为 `SidePanel` 和 `ScoreCard` 的父容器建立 `container-type: size` 上下文
- 将结果按钮、撤销按钮、箭头图标的尺寸从 `dvh` / Tailwind 断点类改为容器查询单位 (`cqh`)
- 将中央级数数字从 `vw/dvh/rem` 上限改为基于容器的 `cqw/cqh`,上限从 14rem 提升至 18rem
- 将 Grid 侧栏宽度从固定上限 17.5rem (280px) 改为百分比 22% (PC 下 352px)
- 将竖屏顶部行从硬性 `clamp(..., 26rem)` 改为百分比 32%,移除固定上限
- 将矮横屏 `@media (max-height: 500px)` 改为 `@container (height < 260px)`,基于容器实际可容纳内容触发布局切换
- 统一间距从 `dvh` 改为 `cqh`,与按钮尺寸同源缩放

## Capabilities

### New Capabilities

- `container-proportional-sizing`: 组件尺寸基于容器查询单位而非视口单位的响应式约束,包括按钮高度、箭头尺寸、中央数字字号、间距和 Grid 比例的容器驱动计算规则,确保各端视觉权重一致且触控目标充分利用可用空间

### Modified Capabilities

- `responsive-scoreboard`: 「三端保持纵向操作栈」的横排判据从视口高度断点 (`max-height: 500px`) 改为侧栏容器可用高度 (`< 260px`)

## Impact

**页面与布局**: `src/pages/Scoreboard.vue` - Grid 列宽和行高从固定上限改为百分比

**侧栏组件**: `src/components/SidePanel.vue` - 建立容器上下文,箭头从 Tailwind 断点类改为容器查询 CSS,矮横屏媒体查询改为容器查询

**按钮组件**: `src/components/ResultButtons.vue` 和 `src/components/UndoAction.vue` - 按钮高度、间距、圆角从 `dvh` 改为 `cqh`,矮横屏媒体查询改为容器查询

**中央卡片**: `src/components/ScoreCard.vue` 和 `src/components/LevelProgressBars.vue` - 建立容器上下文,数字字号从 `vw/dvh` 改为 `cqw/cqh`,上限提升至 18rem

**根设计文档**: `DESIGN.md` - 更新尺寸规则章节,补充容器查询约束和比例系统说明

**浏览器兼容性**: 要求 Chrome 105+、Safari 16+、Firefox 110+ (Container Queries 支持)
