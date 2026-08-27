## Why

当前计分器的深色红蓝对抗风格符合产品定位，不需要视觉重设计。实际缺陷集中在尺寸比例与适配规则：矮横屏强制纵排会重叠，iPad Pro 等高竖屏继续使用三段式会让中央卡片过长、两侧按钮过小，混用视口单位与断点还会使按钮在相邻尺寸间突变。牌桌上的核心操作需要二次确认，也增加了高频计分成本。

## What Changes

- 保留当前视觉风格、红蓝双方结构和中央级数主视觉，不进行品牌或视觉语言重设计。
- **BREAKING** 点击红方或蓝方的 `+3 / +2 / +1` 后立即完成本局计分，不再进入待确认状态，并移除所有确认按钮。
- 红蓝两侧各保留一个“撤销上一局”入口；两个入口执行相同的全局撤销逻辑，方便牌桌两边的用户就近操作。
- 保留当前界面已有的左右箭头黄灯贡牌状态指示，不增加 ImageGen 概念稿中的“贡牌关系”文字、关系条或说明区。
- 桌面和平板继续采用现有左右操作区 + 中央级数的三段式布局，但改用可用空间驱动的尺寸约束，避免侧栏、中央卡片和页脚互相挤压。
- 所有竖屏（包括大尺寸 iPad）使用顶部级数 + 下方红蓝双列操作区；横屏继续使用原三段式布局。
- 高度不超过 500px 的矮横屏将每侧三个结果按钮横排，撤销按钮保持同宽置于下方；其他尺寸保持纵向操作栈。
- 不新增可见“红方 / 蓝方”标题，不移动或缩放既有箭头灯；只调整布局约束、按钮比例、间距和触控尺寸。
- 提升触控目标、间距、文字可读性、焦点可见性和状态辨识，满足 WCAG 2.2 AA；界面不新增 Toast、临时确认提示或视觉播报文案。
- 辅助技术从现有当前级数/打级方区域获得状态更新，焦点保持在触发操作的按钮上。
- 新增根目录 `DESIGN.md`，记录现有视觉系统以及响应式、触控和无障碍约束，作为后续 UI 打磨的基线，而不是改变现有风格。

## Capabilities

### New Capabilities

- `direct-scoring`: 结果按钮立即计分、双侧全局撤销和无二次确认的交互契约。
- `responsive-scoreboard`: 桌面、平板、手机横屏与手机竖屏的结构、尺寸和溢出行为。
- `accessible-scoreboard`: 触控目标、键盘操作、焦点管理、非颜色状态表达和辅助技术更新。

### Modified Capabilities

<!-- 当前 openspec/specs/ 尚无已归档能力；本变更以新能力描述现行契约。 -->

## Impact

- 页面与布局：`src/pages/Scoreboard.vue`、`src/App.vue`、`src/style.css`
- 操作组件：`src/components/SidePanel.vue`、`src/components/ResultButtons.vue`、`src/components/UndoAction.vue`；删除 `ConfirmActions.vue`
- 中央展示：`src/components/ScoreCard.vue`、`src/components/LevelProgressBars.vue`
- 状态指示：保留现有左右箭头黄灯；不引入文字贡牌关系组件；删除阻断竖屏操作的 `RotatePrompt.vue` 和 `useDeviceAdapt.ts`。
- 状态控制：`src/composables/useGameControl.ts`、`src/store/gameStore.ts`
- 文档：新增 `DESIGN.md`，并同步更新 README 中的交互与设备说明。
- 不新增运行时依赖，不改变现有计分升级规则和历史数据结构；待确认状态及其无调用方代码已经删除。

## Implementation Status

**阶段：实现完成，待真机与人工验收。**

- 已完成：直接计分、双侧全局撤销、确认流程删除、竖屏可操作、矮横屏按钮横排、按钮与撤销尺寸统一、原箭头灯位置恢复、可见队名删除。
- 已完成：根 `DESIGN.md`、设计机器上下文和本 change 的行为规格同步。
- 已通过：5 项逻辑测试、生产构建、OpenSpec 校验、`git diff --check`。
- 已截图复核：667×375 矮横屏、390×844 手机竖屏、1024×1366 iPad Pro 竖屏、1600×900 桌面。
- 待完成：目标真机触控复核，以及键盘、屏幕阅读器、强制颜色模式的人工验收；通过后归档本 change。
