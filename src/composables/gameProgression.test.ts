import assert from 'node:assert/strict';
import test from 'node:test';
import { A_INDEX, A2_INDEX, A3_INDEX } from '../constants/levels.ts';
import { getLevelProgression } from './gameProgression.ts';

test('普通级数不受打级方限制', () => {
  assert.deepEqual(getLevelProgression(3, 3, false), { nextLevel: 6, gameOver: false });
  assert.deepEqual(getLevelProgression(A_INDEX - 1, 3, false), { nextLevel: A_INDEX, gameOver: false });
});

test('非打级方不能过 A 或推进冲 A 次数', () => {
  for (const level of [A_INDEX, A2_INDEX, A3_INDEX]) {
    for (const result of [1, 2, 3] as const) {
      assert.deepEqual(getLevelProgression(level, result, false), { nextLevel: level, gameOver: false });
    }
  }
});

test('打级方按结果通过或推进 A', () => {
  for (const level of [A_INDEX, A2_INDEX, A3_INDEX]) {
    for (const result of [2, 3] as const) {
      assert.deepEqual(getLevelProgression(level, result, true), { nextLevel: level, gameOver: true });
    }
  }

  assert.deepEqual(getLevelProgression(A_INDEX, 1, true), { nextLevel: A2_INDEX, gameOver: false });
  assert.deepEqual(getLevelProgression(A2_INDEX, 1, true), { nextLevel: A3_INDEX, gameOver: false });
  assert.deepEqual(getLevelProgression(A3_INDEX, 1, true), { nextLevel: 0, gameOver: false });
});
