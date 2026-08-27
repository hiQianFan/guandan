<script setup lang="ts">
import type { RoundResult } from '../types/game';

const props = defineProps<{
  side: 'red' | 'blue';
  /** 本方当前级数，作为按钮组背景水印；不传则不渲染 */
  watermark?: string;
}>();

const emit = defineEmits<{
  select: [result: RoundResult];
}>();

const options: { main: string; sub: string; value: RoundResult | 0 }[] = [
  { main: '+3', sub: '头/二', value: 3 },
  { main: '+2', sub: '头/三', value: 2 },
  { main: '+1', sub: '头/末', value: 1 },
  { main: '+0', sub: '双下', value: 0 },
];

const displayOptions = options.filter((o): o is { main: string; sub: string; value: RoundResult } => o.value > 0);

function handleClick(opt: { value: RoundResult }) {
  emit('select', opt.value);
}
</script>

<template>
  <!-- 尺寸与 flex 行为全交给 scoped CSS，避免与 Tailwind 声明顺序冲突 -->
  <div class="result-buttons relative w-full">
    <!-- 背景水印：以三个结果按钮的范围居中，不含撤销按钮 -->
    <div v-if="watermark" class="result-watermark" aria-hidden="true">
      {{ watermark }}
    </div>
    <button
      v-for="opt in displayOptions"
      :key="opt.value"
      type="button"
      class="result-button group flex w-full min-w-0 items-center justify-between border font-semibold transition-colors duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
      :class="[
        side === 'red'
          ? 'bg-neutral-800/40 border-white/10 text-neutral-200 hover:bg-guandan-red/10 hover:border-guandan-red/40 focus-visible:ring-guandan-red'
          : 'bg-neutral-800/40 border-white/10 text-neutral-200 hover:bg-guandan-blue/10 hover:border-guandan-blue/40 focus-visible:ring-guandan-blue',
      ]"
      :aria-label="`${side === 'red' ? '红方' : '蓝方'}${opt.main}，${opt.sub}`"
      @click="handleClick(opt)"
    >
      <span 
        class="result-main font-bold leading-none tracking-tight"
      >
        {{ opt.main }}
      </span>
      <span 
        class="result-sub font-medium leading-none text-neutral-400 group-hover:text-current"
      >
        {{ opt.sub }}
      </span>
    </button>
  </div>
</template>

<style scoped>
/* 三个结果按钮是一个语义组（分数选择），组内保持紧凑间距。
 * 段与段之间（箭头/本组/撤销）的距离由 SidePanel 的操作栈控制，
 * 不能让组内间距参与均分，否则三个按钮会被撑散、丢掉分组关系。 */
.result-buttons {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1.8cqh, 1rem);
  /* 按内容高度，不吸收剩余空间：否则组内会出现和之前一样的死区 */
  flex: 0 0 auto;
}

/* 背景水印：以三个结果按钮的范围居中（不含撤销），原先以整个侧栏居中
 * 会偏低而压住 +2/+1 的文字。 */
.result-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  transform: translate(-50%, -50%);
  font-size: clamp(2.5rem, min(55cqw, 30cqh), 9rem);
  font-weight: 800;
  line-height: 1;
  color: rgba(115, 115, 115, 0.18);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* 高度读取 SidePanel 定义的 --row-h（唯一来源；该表达式含 cqh，
 * 必须在 side-panel 容器内求值，故不能提到 :root）。
 * 圆角按高度的 0.26 比例：固定 16px 上限在按钮长到 120–176px 后
 * 比率会掉到 0.09，视觉上"变方"。0.26 沿用 56px×16px 时期的圆润度。 */
.result-button {
  /* 叠在水印之上，保证文字辨识 */
  position: relative;
  z-index: 1;
  min-height: var(--row-h, 3.5rem);
  gap: 0.5rem;
  padding: 0.5rem clamp(0.75rem, 2vw, 1.5rem);
  border-radius: calc(0.26 * var(--row-h, 3.5rem));
}

/* 字号随按钮高度走：按钮由 15cqh 缩放，字号用相近比例，
 * 避免按钮变大而文字不变导致内部空旷 */
.result-main {
  font-size: clamp(1.25rem, 6cqh, 2rem);
}

.result-sub {
  font-size: clamp(0.75rem, 3cqh, 1rem);
}

/* 侧栏容器放不下纵排（四个 44px 按钮 + 箭头 + 间距 ≈ 260px）时才横排。
 * 判据用容器高度而非视口高度：同一视口高度下，横屏三段式和竖屏双列的
 * 侧栏实际高度差异很大，按视口判会在中间尺寸误切。 */
/* 同时要求宽度足够放下三个 44px 按钮：竖屏窄列也可能矮于 260px，
 * 但只有约 154px 宽，横排会让每个按钮缩到 42px 而违反触控下限。 */
@container side-panel (height < 260px) and (min-width: 11rem) {
  .result-buttons {
    flex-direction: row;
    gap: 0.375rem;
    /* 横排时不再吸收剩余高度，按内容高度即可 */
    flex: 0 1 auto;
    justify-content: stretch;
  }

  .result-button {
    min-height: 2.75rem;
    flex-direction: column;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.375rem 0.25rem;
    /* 横排后按钮变窄（约 49px），圆角以宽度为准而非高度，
     * 沿用 0.26 比例得 ~12px，避免看起来接近药丸形 */
    border-radius: 0.75rem;
  }

  .result-main { font-size: 1.125rem; }
  .result-sub { font-size: 0.6875rem; }

  /* 横排后按钮内文字已压缩到 11px，水印会进一步干扰辨识 */
  .result-watermark { display: none; }
}
</style>
