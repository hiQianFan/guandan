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
  <div class="flex w-full flex-col gap-2 sm:gap-3">
    <button
      v-for="opt in displayOptions"
      :key="opt.value"
      type="button"
      class="group flex min-h-14 w-full min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-2 font-semibold transition-colors duration-200 active:scale-[0.98] sm:rounded-2xl sm:px-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
      :class="[
        side === 'red'
          ? 'bg-neutral-800/40 border-white/10 text-neutral-200 hover:bg-guandan-red/10 hover:border-guandan-red/40 focus-visible:ring-guandan-red'
          : 'bg-neutral-800/40 border-white/10 text-neutral-200 hover:bg-guandan-blue/10 hover:border-guandan-blue/40 focus-visible:ring-guandan-blue',
      ]"
      :aria-label="`${side === 'red' ? '红方' : '蓝方'}${opt.main}，${opt.sub}`"
      @click="handleClick(opt)"
    >
      <span 
        class="text-xl font-bold leading-none tracking-tight sm:text-2xl lg:text-3xl"
      >
        {{ opt.main }}
      </span>
      <span 
        class="text-xs font-medium leading-none text-neutral-400 group-hover:text-current sm:text-sm"
      >
        {{ opt.sub }}
      </span>
    </button>
  </div>
</template>
