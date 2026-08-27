<script lang="ts">
let arrowSeq = 0;
function nextArrowId() {
  return ++arrowSeq;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleArrowLeft, CircleArrowRight } from 'lucide-vue-next';
import { useGameStore } from '../store/gameStore';

const props = defineProps<{
  side: 'red' | 'blue';
}>();

const store = useGameStore();

// 仅当前进攻方显示；游戏未开始（无历史）时双方都不显示
const showArrow = computed(
  () => store.attacker === props.side && store.history.length > 0,
);

// 横屏与竖屏各挂一份箭头，两者同时在 DOM 中（另一份由 CSS 隐藏），
// 滤镜 id 必须唯一否则会互相覆盖
const filterId = `arrow-stroke-glow-${props.side}-${nextArrowId()}`;
</script>

<template>
  <!-- 居中：横屏时对齐所在侧栏的按钮列中线。竖屏轨内由 .arrow-rail
       的 justify-between 决定左右位置，此处 justify-center 不影响 -->
  <div class="arrow-slot flex w-full items-center justify-center overflow-visible">
    <Transition :name="side === 'red' ? 'arrow-in-left' : 'arrow-in-right'">
      <span
        v-if="showArrow"
        class="arrow-wrapper inline-flex shrink-0 items-center justify-center"
        :aria-label="side === 'red' ? '红方当前打级' : '蓝方当前打级'"
        role="img"
      >
        <svg class="absolute h-0 w-0" aria-hidden="true">
          <defs>
            <filter :id="filterId" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
              <feFlood flood-color="#22c55e" flood-opacity="0.9" result="color" />
              <feComposite in="color" in2="blur2" operator="in" result="glow2" />
              <feFlood flood-color="#22c55e" flood-opacity="0.5" result="color2" />
              <feComposite in="color2" in2="blur1" operator="in" result="glow1" />
              <feMerge>
                <feMergeNode in="glow2" />
                <feMergeNode in="glow1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        <component
          :is="side === 'red' ? CircleArrowLeft : CircleArrowRight"
          class="h-full w-full text-[#22c55e]"
          :style="{ filter: `url(#${filterId})` }"
          aria-hidden="true"
        />
      </span>
    </Transition>
  </div>
</template>

<style scoped>
/* 箭头尺寸锁定为按钮（15cqh）的 12/15 = 0.8。
 * 横屏在 side-panel 容器内，竖屏在 arrow-rail 容器内，两处都有 cqh 基准。 */
/* 箭头取结果按钮行高的 0.8：随按钮同步放大，
 * 不再用固定 px 上限（长屏下会被 flex 撑高的按钮甩开）。
 * --row-h 由侧栏提供；竖屏 arrow-rail 内无此变量，走 fallback。 */
/* 箭头与按钮行高（--row-h）等高：之前 0.53/0.72 系数在实机上偏小，
 * 与按钮和分数不协调。--row-h 由 SidePanel 或 arrow-rail 提供。 */
.arrow-slot {
  --slot-basis: var(--row-h, clamp(2.75rem, 15cqh, 6rem));
  height: var(--slot-basis);
  --arrow-shift: calc(0.35 * var(--slot-basis));
}

.arrow-wrapper {
  width: var(--slot-basis);
  height: var(--slot-basis);
  background: transparent;
  isolation: isolate;
}

/* Lucide 图标保持纯线条，SVG 滤镜只对线条发光 */
.arrow-wrapper :deep(svg) {
  fill: none;
  overflow: visible;
}

.arrow-in-left-enter-active,
.arrow-in-left-leave-active,
.arrow-in-right-enter-active,
.arrow-in-right-leave-active {
  transition: all 0.4s var(--ease-out-expo);
}

.arrow-in-left-enter-from {
  opacity: 0;
  transform: translateX(calc(-1 * var(--arrow-shift)));
}
.arrow-in-left-leave-to {
  opacity: 0;
  transform: translateX(calc(-0.8 * var(--arrow-shift)));
}

.arrow-in-right-enter-from {
  opacity: 0;
  transform: translateX(var(--arrow-shift));
}
.arrow-in-right-leave-to {
  opacity: 0;
  transform: translateX(calc(0.8 * var(--arrow-shift)));
}
</style>
