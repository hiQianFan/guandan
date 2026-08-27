<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import { useGameStore } from '../store/gameStore';
import { A3_INDEX } from '../constants/levels';

const store = useGameStore();

// 进度比例 0~1：2 (index 0) 为 0%，A3 (index 14) 为 100%
const MAX_INDEX = A3_INDEX;

const redProgress = computed(() => {
  if (store.isGameOver && store.attacker === 'red') return 1;
  return store.redLevelIndex / MAX_INDEX;
});

const blueProgress = computed(() => {
  if (store.isGameOver && store.attacker === 'blue') return 1;
  return store.blueLevelIndex / MAX_INDEX;
});

// 涨潮与退潮不对称：升级是一次结果确认，宜快且干脆；
// A3 未过而回 2 是一次清空，需要看清灯带沿原路缩回底边中点，故更慢更缓。
const RISE = { dur: '500ms', ease: 'var(--ease-out-quart)' };
const EBB = { dur: '1100ms', ease: 'var(--ease-out-expo)' };

function useTide(progress: ComputedRef<number>) {
  const motion = ref(RISE);
  watch(progress, (now, before) => {
    motion.value = now < before ? EBB : RISE;
  });
  return motion;
}

const redTide = useTide(redProgress);
const blueTide = useTide(blueProgress);

// 环几何从 DOM 实测：圆角来自 --card-r 的 clamp(…cqmin…)，
// 只有实测才能让 SVG 描边与 CSS 轨道严格同心。
const ring = ref<HTMLElement | null>(null);
const box = ref({ w: 0, h: 0, r: 0, s: 0 });

function measure() {
  const el = ring.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  box.value = {
    w: rect.width,
    h: rect.height,
    r: parseFloat(cs.borderTopLeftRadius) || 0,
    s: parseFloat(cs.borderTopWidth) || 0,
  };
}

let ro: ResizeObserver | null = null;

onMounted(() => {
  measure();
  ro = new ResizeObserver(measure);
  if (ring.value) ro.observe(ring.value);
});

onBeforeUnmount(() => {
  ro?.disconnect();
  ro = null;
});

const ready = computed(() => box.value.w > 0 && box.value.h > 0);

// 描边中线较外沿内缩半个线宽，故中线圆角 = 外圆角 - s/2；
// 再按 CSS 同样的规则夹到盒子一半，避免小卡片上圆角溢出。
const geom = computed(() => {
  const { w, h, r, s } = box.value;
  const half = s / 2;
  const left = half;
  const top = half;
  const right = w - half;
  const bottom = h - half;
  const rc = Math.max(0, Math.min(r - half, (w - s) / 2, (h - s) / 2));
  return { w, h, s, left, top, right, bottom, rc, cx: w / 2 };
});

// 红：底边中点 → 左 → 上 → 顶边中点（顺时针半圈）
const redPath = computed(() => {
  const { left, top, bottom, rc, cx } = geom.value;
  return `M ${cx} ${bottom} H ${left + rc} A ${rc} ${rc} 0 0 1 ${left} ${bottom - rc}`
    + ` V ${top + rc} A ${rc} ${rc} 0 0 1 ${left + rc} ${top} H ${cx}`;
});

// 蓝：底边中点 → 右 → 上 → 顶边中点（逆时针半圈），与红等长
const bluePath = computed(() => {
  const { top, right, bottom, rc, cx } = geom.value;
  return `M ${cx} ${bottom} H ${right - rc} A ${rc} ${rc} 0 0 0 ${right} ${bottom - rc}`
    + ` V ${top + rc} A ${rc} ${rc} 0 0 0 ${right - rc} ${top} H ${cx}`;
});
</script>

<template>
  <div class="level-progress-root relative mx-auto flex h-full w-full flex-col items-center px-2 py-2 sm:px-3">
    <div class="relative flex h-full min-h-0 w-full flex-col">
      <!-- 插槽：放置 ScoreCard，z-10 在灯条之下 -->
      <div class="card-clip relative z-10 w-full h-full min-h-0 overflow-hidden flex flex-col">
        <slot />
      </div>

      <!-- 1. 轨道底色（深灰色边框），同时充当 SVG 的几何量尺 -->
      <div ref="ring" class="progress-ring border-white/10"></div>

      <!-- 2. 灯带：按弧长点亮。红蓝各半圈，同自底边中点出发、于顶边中点收束 -->
      <svg
        v-if="ready"
        class="progress-svg"
        :viewBox="`0 0 ${geom.w} ${geom.h}`"
        fill="none"
        aria-hidden="true"
      >
        <path
          class="lamp lamp-red"
          :d="redPath"
          pathLength="1"
          :stroke-width="geom.s"
          stroke-dasharray="1 1"
          :stroke-dashoffset="1 - redProgress"
          :style="{ '--tide-dur': redTide.dur, '--tide-ease': redTide.ease }"
        />
        <path
          class="lamp lamp-blue"
          :d="bluePath"
          pathLength="1"
          :stroke-width="geom.s"
          stroke-dasharray="1 1"
          :stroke-dashoffset="1 - blueProgress"
          :style="{ '--tide-dur': blueTide.dur, '--tide-ease': blueTide.ease }"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* 纯百分比，不设 rem 上限：任何固定上限都会在更大的屏上把卡片"吊"在
 * 中央区里侧，两边留出与屏幕无关的空白。下限保证窄屏不过窄。 */
.level-progress-root {
  max-width: max(20rem, 94cqw);
}

/* 卡片裁剪与进度环共用 score-area 的 --card-r：
 * 环向外偏移 --ring-w，故其圆角需相应加上同一线宽，否则内外弧不同心。 */
.card-clip {
  border-radius: var(--card-r, 1.5rem);
}

.progress-ring {
  position: absolute;
  inset: calc(-1 * var(--ring-w, 6px));
  border-radius: calc(var(--card-r, 1.5rem) + var(--ring-w, 6px));
  border-width: var(--ring-w, 6px);
  border-style: solid;
  pointer-events: none;
  z-index: 20;
}

/* 与轨道逐像素重合：同一 inset，viewBox 取轨道实测尺寸。
 * overflow: visible 让 drop-shadow 的光晕不被裁掉。 */
.progress-svg {
  position: absolute;
  inset: calc(-1 * var(--ring-w, 6px));
  overflow: visible;
  pointer-events: none;
  z-index: 20;
}

/* butt 端点让红蓝在底边中点严丝合缝地对接，不互相叠压。
 * 不再用 opacity 门控：p=0 时 dasharray 已使可见段为零，无需额外隐藏，
 * 而 opacity 的短过渡会在退潮走完前把灯带抹掉，看着像"凭空消失"。 */
.lamp {
  fill: none;
  stroke-linecap: butt;
  transition: stroke-dashoffset var(--tide-dur, 500ms) var(--tide-ease, var(--ease-out-quart));
}

.lamp-red {
  stroke: var(--color-guandan-red);
  filter: drop-shadow(0 0 8px rgb(var(--guandan-red-rgb) / 0.4));
}

.lamp-blue {
  stroke: var(--color-guandan-blue);
  filter: drop-shadow(0 0 8px rgb(var(--guandan-blue-rgb) / 0.4));
}
</style>
