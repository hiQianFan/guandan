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
.undo-action {
  min-height: clamp(3.5rem, 7.5dvh, 5rem);
  padding: 0.5rem clamp(0.75rem, 2vw, 1.5rem);
  border-radius: clamp(0.5rem, 1.4dvh, 1rem);
  font-size: clamp(0.75rem, min(1.5vw, 2.2dvh), 1rem);
}

@media (orientation: landscape) and (max-height: 500px) {
  .undo-action {
    min-height: 3.25rem;
    padding: 0.375rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
