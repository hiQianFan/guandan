import { A_INDEX, A2_INDEX, A3_INDEX } from '../constants/levels.ts';
import type { RoundResult } from '../types/game.ts';

export function getLevelProgression(
  level: number,
  result: RoundResult,
  isAttacker: boolean,
) {
  if (level < A_INDEX) {
    return { nextLevel: Math.min(level + result, A_INDEX), gameOver: false };
  }

  if (!isAttacker) return { nextLevel: level, gameOver: false };
  if (result > 1) return { nextLevel: level, gameOver: true };

  return {
    nextLevel: level === A_INDEX ? A2_INDEX : level === A2_INDEX ? A3_INDEX : 0,
    gameOver: false,
  };
}
