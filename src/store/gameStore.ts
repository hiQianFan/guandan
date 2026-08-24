import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Attacker, GameSnapshot, TributeRelation } from '../types/game.ts';
import { LEVELS } from '../constants/levels.ts';

// 2 到 A，再 A2/A3（打A头游+末游时递进，A3 再不过则回2）
// 索引: 0..11 (2..K), 12 (A), 13 (A2), 14 (A3)
export { LEVELS, A_INDEX, A2_INDEX, A3_INDEX } from '../constants/levels.ts';

export const useGameStore = defineStore('game', () => {
  const redLevelIndex = ref(0);
  const blueLevelIndex = ref(0);
  const attacker = ref<Attacker>('red');
  const history = ref<GameSnapshot[]>([]);
  const lastTribute = ref<TributeRelation | null>(null);
  const isGameOver = ref(false); // 过A 后为 true

  const currentLevel = computed(() => {
    const index = attacker.value === 'red' ? redLevelIndex.value : blueLevelIndex.value;
    return LEVELS[index];
  });

  const isTie = computed(() => redLevelIndex.value === blueLevelIndex.value);

  // 状态更新 actions (原子操作)
  function setLevel(side: 'red' | 'blue', levelIndex: number) {
    if (side === 'red') redLevelIndex.value = levelIndex;
    else blueLevelIndex.value = levelIndex;
  }

  function setAttacker(newAttacker: Attacker) {
    attacker.value = newAttacker;
  }

  function pushHistory(snapshot: GameSnapshot) {
    history.value.push(snapshot);
  }

  function popHistory() {
    return history.value.pop();
  }

  function setLastTribute(tribute: TributeRelation | null) {
    lastTribute.value = tribute;
  }

  function setGameOver(status: boolean) {
    isGameOver.value = status;
  }

  function resetState() {
    redLevelIndex.value = 0;
    blueLevelIndex.value = 0;
    attacker.value = 'red';
    history.value = [];
    lastTribute.value = null;
    isGameOver.value = false;
  }

  return {
    // State
    redLevelIndex,
    blueLevelIndex,
    attacker,
    history,
    lastTribute,
    isGameOver,
    
    // Getters
    currentLevel,
    isTie,

    // Actions (Atomic)
    setLevel,
    setAttacker,
    pushHistory,
    popHistory,
    setLastTribute,
    setGameOver,
    resetState,
  };
});
