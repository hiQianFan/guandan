---
title: 修复非打级方错误过 A
type: bugfix
created: 2026-08-24
status: done
route: one-shot
context:
  - docs/standard-rules.md
---

# 修复非打级方错误过 A

## Intent

**Problem:** 升级逻辑只检查赢家是否处于 A/A2/A3，导致非本副打级方赢得对方的普通级数牌局时被错误判定过 A。

**Approach:** 普通级数继续从赢家自身级数加 1/2/3；A 区只有赢家同时是本副打级方时，才允许过 A 或推进 A/A2/A3。

## Suggested Review Order

**核心判定**

- 先用交接前的打级方判断 A 阶段资格。
  [useGameControl.ts:74](../src/composables/useGameControl.ts#L74)

- 纯函数集中普通升级与 A 阶段边界。
  [gameProgression.ts:4](../src/composables/gameProgression.ts#L4)

**状态与验证**

- 级数索引从唯一列表派生，避免常量漂移。
  [levels.ts:1](../src/constants/levels.ts#L1)

- 回归覆盖普通升级、非打级方 A 区和三次冲 A。
  [gameProgression.test.ts:6](../src/composables/gameProgression.test.ts#L6)

- 标准测试命令接入项目脚本。
  [package.json:6](../package.json#L6)
