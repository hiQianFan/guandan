import assert from 'node:assert/strict';
import test from 'node:test';
import { createPinia, setActivePinia } from 'pinia';
import { useGameControl } from './useGameControl.ts';
import { useGameStore } from '../store/gameStore.ts';

test('结果按钮直接计分且任一侧都能撤销上一局', () => {
  setActivePinia(createPinia());
  const store = useGameStore();
  const { recordRound, undoRound } = useGameControl();

  recordRound('red', 2);
  assert.equal(store.redLevelIndex, 2);
  assert.equal(store.attacker, 'red');
  assert.equal(store.history.length, 1);

  undoRound();
  assert.equal(store.redLevelIndex, 0);
  assert.equal(store.attacker, 'red');
  assert.equal(store.history.length, 0);

  recordRound('blue', 3);
  assert.equal(store.blueLevelIndex, 3);
  assert.equal(store.attacker, 'blue');
  assert.equal(store.history.length, 1);
});

test('游戏结束后忽略新的计分操作', () => {
  setActivePinia(createPinia());
  const store = useGameStore();
  const { recordRound } = useGameControl();

  store.setGameOver(true);
  recordRound('blue', 3);

  assert.equal(store.blueLevelIndex, 0);
  assert.equal(store.history.length, 0);
});
