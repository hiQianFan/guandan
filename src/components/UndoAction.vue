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
    class="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border-2 border-neutral-600 bg-neutral-900/50 px-3 py-2 text-sm font-semibold text-neutral-300 transition-colors duration-200 hover:border-neutral-400 hover:bg-white/5 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:border-neutral-800 disabled:text-neutral-600 sm:rounded-2xl sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
    :disabled="!canUndo"
    aria-label="撤销上一局"
    @click="emit('undo')"
  >
    <RotateCcw class="size-5 shrink-0" aria-hidden="true" />
    <span>撤销上一局</span>
  </button>
</template>
