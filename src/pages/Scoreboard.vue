<script setup lang="ts">
import LevelProgressBars from '../components/LevelProgressBars.vue';
import ScoreCard from '../components/ScoreCard.vue';
import SidePanel from '../components/SidePanel.vue';
import AttackerArrow from '../components/AttackerArrow.vue';
</script>

<template>
  <div class="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-guandan-surface font-sans text-gray-100">
    <main class="scoreboard-layout min-h-0 flex-1">
      <aside class="red-area relative z-10 min-h-0 min-w-0">
        <SidePanel side="red" />
      </aside>

      <section class="score-area relative z-0 flex min-h-0 min-w-0 flex-col items-center overflow-hidden" aria-label="当前级数">
        <!-- 竖屏：红蓝箭头各占半屏并在其中居中，对齐下方红蓝两列的中线 -->
        <div class="arrow-rail flex w-full shrink-0 items-center">
          <AttackerArrow side="red" class="flex-1" />
          <AttackerArrow side="blue" class="flex-1" />
        </div>
        <LevelProgressBars class="min-h-0 flex-1">
          <ScoreCard class="min-h-0 w-full max-w-full flex-1" />
        </LevelProgressBars>
      </section>

      <aside class="blue-area relative z-10 min-h-0 min-w-0">
        <SidePanel side="blue" />
      </aside>
    </main>
  </div>
</template>

<style scoped>
/* 侧栏占 22%（原 20vw 但被 17.5rem 上限锁在 280px）。
 * 改百分比后 1600px 下侧栏 352px，按钮得以容纳更大字号。 */
.scoreboard-layout {
  display: grid;
  grid-template-areas: "red score blue";
  grid-template-columns: minmax(9rem, 22%) minmax(10rem, 1fr) minmax(9rem, 22%);
  gap: clamp(0.75rem, 2vw, 2rem);
  padding: clamp(1rem, 2vw, 2.5rem);
  overflow: hidden;
}

.red-area { grid-area: red; }
.blue-area { grid-area: blue; }

/* 容器上下文：中央数字以卡片实际可用空间为基准。
 * 原先用 min(28vw, 38dvh) + 14rem 上限，在 1600×900 下卡片有 912×788
 * 的空间却把数字锁在 224px。 */
.score-area {
  grid-area: score;
  container-type: size;
  container-name: score-area;
  /* 卡片圆角与进度环线宽的唯一来源，供 ScoreCard 与 LevelProgressBars 继承。
   * 随容器较小边缩放：固定 24px 在 2K 下配 1345px 高的卡片比率仅 0.018，
   * 明显偏方。下限 1.5rem 保持手机上的现有观感不变。 */
  --card-r: clamp(1.5rem, 4cqmin, 3rem);
  --ring-w: 6px;
}

/* 箭头轨：仅竖屏可见，横屏箭头留在各自侧栏顶部。
 * 高度以 score-area 为基准；轨自身不建容器，否则 AttackerArrow 的
 * 13cqh 会解析到轨高本身而形成循环依赖。 */
.arrow-rail {
  display: none;
  /* 略大于按钮但同量级：按钮在竖屏约 8dvh（15cqh × 52% 行高），
   * 这里取 9dvh，比例约 1.1–1.3。原先 13dvh 会到 1.8 倍，明显失衡。 */
  --row-h: clamp(3rem, 9dvh, 7rem);
  height: var(--row-h);
  /* 撑满级数区宽度：两个箭头各占一半并居中，因此中线与下方红蓝两列对齐。
   * 不再限制为卡片宽度——那会把箭头推到卡片边缘、显得挂在角上。 */
  width: 100%;
  /* 箭头与卡片同属视觉区，但需要可辨识的呼吸间距 */
  margin-bottom: clamp(0.75rem, 3.5cqh, 2rem);
}

@media (orientation: portrait) {
  .arrow-rail {
    display: flex;
  }

}

@media (orientation: portrait) {
  .scoreboard-layout {
    grid-template-areas:
      "score score"
      "red blue";
    grid-template-columns: repeat(2, minmax(0, 1fr));
    /* 视觉区（箭头 + 卡片）48%、操作区 52%。
     * 操作区内部底对齐，其上方余量即两个心智区之间的区间隔。 */
    grid-template-rows: minmax(8rem, 48%) minmax(0, 1fr);
    row-gap: clamp(0.5rem, 2dvh, 1.5rem);
    column-gap: clamp(0.375rem, 1.5dvw, 0.75rem);
    padding: clamp(0.375rem, 1dvh, 1rem);
  }
}

/* 矮横屏侧栏加宽以容纳横排的三个按钮；此处判据仍是视口，
 * 因为 Grid 列宽必须在容器建立之前确定，无法用 side-panel 的容器查询。 */
@media (orientation: landscape) and (max-height: 500px) {
  .scoreboard-layout {
    grid-template-columns: minmax(11rem, 31%) minmax(8rem, 1fr) minmax(11rem, 31%);
    gap: 0.5rem;
    padding: 0.5rem;
  }
}
</style>
