<script setup lang="ts">
import type { RoundResult } from '../types/game';

const props = defineProps<{
  side: 'red' | 'blue';
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
  <div class="result-buttons flex w-full shrink-0">
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
.result-buttons {
  flex-direction: column;
  gap: clamp(0.375rem, 1.2dvh, 0.75rem);
}

.result-button {
  min-height: clamp(3.5rem, 7.5dvh, 5rem);
  gap: 0.5rem;
  padding: 0.5rem clamp(0.75rem, 2vw, 1.5rem);
  border-radius: clamp(0.5rem, 1.4dvh, 1rem);
}

.result-main {
  font-size: clamp(1.25rem, min(3vw, 4dvh), 2rem);
}

.result-sub {
  font-size: clamp(0.75rem, min(1.5vw, 2.2dvh), 0.875rem);
}

@media (orientation: landscape) and (max-height: 500px) {
  .result-buttons {
    flex-direction: row;
    gap: 0.375rem;
  }

  .result-button {
    min-height: 3.25rem;
    flex-direction: column;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.375rem 0.25rem;
    border-radius: 0.5rem;
  }

  .result-main { font-size: 1.125rem; }
  .result-sub { font-size: 0.6875rem; }
}
</style>
