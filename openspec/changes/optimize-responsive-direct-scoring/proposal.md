## Why

当前计分器的深色红蓝对抗风格符合产品定位，但布局依赖视口宽高和多组断点，在手机竖屏、平板横屏与矮屏设备上容易挤压变形。牌桌上的核心操作还需要二次确认，小屏横排的三个结果按钮又会被压窄，降低了高频计分的效率。

## What Changes

- 保留当前视觉风格、红蓝双方结构和中央级数主视觉，不进行品牌或视觉语言重设计。
- **BREAKING** 点击红方或蓝方的 `+3 / +2 / +1` 后立即完成本局计分，不再进入待确认状态，并移除所有确认按钮。
- 红蓝两侧各保留一个“撤销上一局”入口；两个入口执行相同的全局撤销逻辑，方便牌桌两边的用户就近操作。
- 保留当前界面已有的左右箭头黄灯贡牌状态指示，不增加 ImageGen 概念稿中的“贡牌关系”文字、关系条或说明区。
- 桌面和平板继续采用现有左右操作区 + 中央级数的三段式布局，但改用可用空间驱动的尺寸约束，避免侧栏、中央卡片和页脚互相挤压。
- 手机竖屏不再要求旋转设备：顶部显示当前级数，下方使用红蓝双列操作区；横屏手机使用紧凑的三段式布局。
- 红蓝每一方在三端均使用纵向的 `+3 / +2 / +1 / 撤销上一局` 四行操作栈；撤销与结果按钮同宽同高，但保持中性次级样式。
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
- 操作组件：`src/components/SidePanel.vue`、`src/components/ResultButtons.vue`、`src/components/ConfirmActions.vue`
- 中央展示：`src/components/ScoreCard.vue`、`src/components/LevelProgressBars.vue`
- 状态指示：保留现有左右箭头黄灯；不引入文字贡牌关系组件。`RotatePrompt.vue` 和 `useDeviceAdapt.ts` 将按新的竖屏策略删除或收敛。
- 状态控制：`src/composables/useGameControl.ts`、`src/store/gameStore.ts`
- 文档：新增 `DESIGN.md`，并同步更新 README 中的交互与设备说明。
- 不新增运行时依赖，不改变现有计分升级规则和历史数据结构，除非实现阶段证明待确认状态已无调用方且可安全删除。
