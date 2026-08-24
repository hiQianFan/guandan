import { useGameStore } from '../store/gameStore';
import type { RoundResult } from '../types/game';
import { getLevelProgression } from './gameProgression';

export function useGameControl() {
  const store = useGameStore();

  // 选择结果
  function selectResult(winner: 'red' | 'blue', result: RoundResult) {
    if (store.isGameOver) return;
    store.setPending(winner, result);
  }

  // 确认结果并推进游戏
  function confirmRound() {
    if (store.pendingResult === null || store.pendingWinner === null || store.isGameOver) return;

    // 1. 记录历史快照
    store.pushHistory({
      redLevelIndex: store.redLevelIndex,
      blueLevelIndex: store.blueLevelIndex,
      attacker: store.attacker,
      lastTribute: store.lastTribute ? JSON.parse(JSON.stringify(store.lastTribute)) : null,
    });

    const result = store.pendingResult;
    const winner = store.pendingWinner;

    // 2. 计算贡牌关系
    calculateTribute(winner, result);

    // 3. 计算级别变更（赢家加分，红蓝同一套逻辑）
    calculateLevelProgression(winner, result);

    // 4. 更新攻击方和清理状态
    store.setAttacker(winner);
    store.setPending(null, null);
  }

  // 计算贡牌
  function calculateTribute(winner: 'red' | 'blue', result: RoundResult) {
    let tribute = null;
    if (result === 3) { // 双下
      tribute = {
        type: 'double',
        rankings: {
          red: winner === 'red' ? [1, 2] : [3, 4],
          blue: winner === 'blue' ? [1, 2] : [3, 4],
        },
      };
    } else if (result === 2) { // 单下
      tribute = {
        type: 'single',
        rankings: {
          red: winner === 'red' ? [1, 3] : [2, 4],
          blue: winner === 'blue' ? [1, 3] : [2, 4],
        },
      };
    } else { // 平局/保级 (头游+末游)
      tribute = {
        type: 'single',
        rankings: {
          red: winner === 'red' ? [1, 4] : [2, 3],
          blue: winner === 'blue' ? [1, 4] : [2, 3],
        },
      };
    }
    // @ts-ignore
    store.setLastTribute(tribute);
  }

  // 计算级别变更逻辑 (核心规则)
  // 赢家直接加分，红蓝同一套逻辑；赢家成为下一轮庄家
  function calculateLevelProgression(winner: 'red' | 'blue', result: RoundResult) {
    const winnerLevel = winner === 'red' ? store.redLevelIndex : store.blueLevelIndex;
    const progression = getLevelProgression(winnerLevel, result, winner === store.attacker);

    store.setLevel(winner, progression.nextLevel);
    if (progression.gameOver) store.setGameOver(true);
  }

  // 撤销
  function undoRound() {
    const lastSnapshot = store.popHistory();
    if (lastSnapshot) {
      store.setLevel('red', lastSnapshot.redLevelIndex);
      store.setLevel('blue', lastSnapshot.blueLevelIndex);
      store.setAttacker(lastSnapshot.attacker);
      store.setLastTribute(lastSnapshot.lastTribute);
      store.setGameOver(false);
    }
    store.setPending(null, null);
  }

  // 重置
  function resetGame() {
    store.resetState();
  }

  return {
    selectResult,
    confirmRound,
    undoRound,
    resetGame,
  };
}
