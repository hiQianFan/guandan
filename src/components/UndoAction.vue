<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next';

defineProps<{
  canUndo: boolean;
}>();

const emit = defineEmits<{
  undo: [];
}>();
</script>

<template>
  <button
    type="button"
    class="undo-action flex w-full items-center justify-center gap-2 border-2 border-neutral-600 bg-neutral-900/50 font-semibold text-neutral-300 transition-colors duration-200 hover:border-neutral-400 hover:bg-white/5 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:border-neutral-800 disabled:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
    :disabled="!canUndo"
    aria-label="撤销上一局"
    @click="emit('undo')"
  >
    <RotateCcw class="size-5 shrink-0" aria-hidden="true" />
    <span>撤销上一局</span>
  </button>
</template>

<style scoped>
/* 与结果按钮同高同宽同圆角（DESIGN.md 的 undo 契约）：
 * 三者共用 SidePanel 提供的 --row-h 与同一条 0.26 圆角比例 */
.undo-action {
  min-height: var(--row-h, 3.5rem);
  padding: 0.5rem clamp(0.75rem, 2vw, 1.5rem);
  border-radius: calc(0.26 * var(--row-h, 3.5rem));
  font-size: clamp(0.75rem, 3cqh, 1rem);
}

@container side-panel (height < 260px) and (min-width: 11rem) {
  .undo-action {
    height: 2.75rem;
    padding: 0.375rem 0.5rem;
    /* 与横排结果按钮保持同一圆角 */
    border-radius: 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
