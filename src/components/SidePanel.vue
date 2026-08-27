<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore, LEVELS } from '../store/gameStore';
import { useGameControl } from '../composables/useGameControl';
import ResultButtons from './ResultButtons.vue';
import UndoAction from './UndoAction.vue';
import AttackerArrow from './AttackerArrow.vue';

const props = defineProps<{
  side: 'red' | 'blue';
}>();

const store = useGameStore();
const { recordRound, undoRound } = useGameControl();

function handleSelect(result: import('../types/game').RoundResult) {
  recordRound(props.side, result);
}

function handleUndo() {
  undoRound();
}

// 双方当前级数
const redLevel = computed(() => LEVELS[store.redLevelIndex]);
const blueLevel = computed(() => LEVELS[store.blueLevelIndex]);

// 是否可以撤销 (全局)
const canUndo = computed(() => store.history.length > 0);
</script>

<template>
  <div
    class="side-panel-root relative flex h-full min-h-0 w-full flex-col items-stretch overflow-hidden"
    :aria-label="side === 'red' ? '红方操作' : '蓝方操作'"
  >
    <!-- 三段：箭头（绝对定位钉顶部）/ 结果按钮组 / 撤销 -->
    <div class="side-panel-stack relative z-10 flex min-h-0 w-full flex-1 flex-col items-stretch">
      <!-- 横屏：箭头固定在侧栏顶部，不参与操作栈的垂直居中。
           竖屏改由 Scoreboard 挂在卡片上方，此处隐藏。 -->
      <AttackerArrow :side="side" class="side-panel-arrow" />

      <!-- 水印随结果按钮组居中，故交由 ResultButtons 承载 -->
      <ResultButtons
        :side="side"
        :watermark="side === 'red' ? redLevel : blueLevel"
        @select="handleSelect"
      />

      <UndoAction :can-undo="canUndo" @undo="handleUndo" />
    </div>
  </div>
</template>

<style scoped>
/* 容器上下文：按钮、箭头、间距均以侧栏实际可用空间为基准，
 * 而非全视口。竖屏双列与横屏三段式下同一组件因此保持一致比例。 */
.side-panel-root {
  container-type: size;
  container-name: side-panel;
}


/* padding 与 gap 放在容器的子元素上：cqh 在容器自身样式里会解析到
 * 祖先容器（此处不存在，会回退到视口），只有后代才能引用 side-panel 尺寸。
 * 间距与按钮同源缩放（按钮 15cqh），保持视觉节奏一致。 */
.side-panel-stack {
  padding: clamp(0.375rem, 2.5cqh, 1.25rem);
  /* 三段布局：箭头 / 结果按钮组 / 撤销。
   * 段间距（这里的 gap）明显大于组内间距（ResultButtons 的 1.8cqh），
   * 让"三个分数按钮是一组"的关系在视觉上成立。
   * 不用 space-between：那会把多余空间平摊成两个巨大段间距。
   * 整体居中，剩余空间落在栈的上下两端而非段与段之间。 */
  justify-content: center;
  gap: clamp(0.875rem, 5cqh, 3rem);
  /* 顶部为绝对定位的箭头预留空间（箭头高 = --row-h），
   * 否则居中的操作栈会与之重叠 */
  padding-top: calc(var(--row-h) + clamp(0.75rem, 3cqh, 2rem));
  /* 按钮行高基准，箭头按此取比例。与 ResultButtons/UndoAction 的
   * min-height 保持同一条表达式。 */
  --row-h: clamp(2.75rem, 15cqh, clamp(6rem, 11dvh, 11rem));
}


/* 横屏箭头钉在侧栏顶部：它是全局状态指示，位置应稳定，
 * 不随操作栈（按钮数量/尺寸变化）上下浮动。 */
.side-panel-arrow {
  position: absolute;
  top: clamp(0.375rem, 2.5cqh, 1.25rem);
  left: 0;
  right: 0;
  z-index: 20;
}

/* 竖屏下箭头改挂在级数卡片上方（Scoreboard 的 arrow-rail），
 * 侧栏内这份隐藏，避免同一状态出现两个指示 */
@media (orientation: portrait) {
  .side-panel-arrow {
    display: none;
  }

  /* 竖屏：操作区（按钮 + 撤销）是独立心智区，整体底对齐并留底边距。
   * 剩余空间自然落到操作区上方，成为与"箭头 + 卡片"视觉区之间的区间隔，
   * 而不是散成无意义的空白。 */
  .side-panel-stack {
    justify-content: flex-end;
    padding-bottom: clamp(0.75rem, 3cqh, 2rem);
    /* 竖屏箭头在 Scoreboard 的轨内，侧栏不必为它留顶部空间 */
    padding-top: clamp(0.375rem, 2.5cqh, 1.25rem);
  }

}
</style>
