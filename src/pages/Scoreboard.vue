<script setup lang="ts">
import LevelProgressBars from '../components/LevelProgressBars.vue';
import ScoreCard from '../components/ScoreCard.vue';
import SidePanel from '../components/SidePanel.vue';
</script>

<template>
  <div class="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-guandan-surface font-sans text-gray-100">
    <main class="scoreboard-layout min-h-0 flex-1">
      <section class="score-area relative z-0 flex min-h-0 min-w-0 items-center justify-center overflow-hidden" aria-label="当前级数">
        <LevelProgressBars>
          <ScoreCard class="min-h-0 w-full max-w-full flex-1" />
        </LevelProgressBars>
      </section>

      <aside class="red-area relative z-10 min-h-0 min-w-0">
        <SidePanel side="red" />
      </aside>

      <aside class="blue-area relative z-10 min-h-0 min-w-0">
        <SidePanel side="blue" />
      </aside>
    </main>
  </div>
</template>

<style scoped>
.scoreboard-layout {
  display: grid;
  grid-template-areas: "red score blue";
  grid-template-columns: minmax(7rem, 17.5rem) minmax(11rem, 1fr) minmax(7rem, 17.5rem);
  gap: clamp(0.5rem, 2vw, 2rem);
  padding: clamp(0.5rem, 2vw, 2rem);
  overflow: hidden;
}

.red-area { grid-area: red; }
.score-area { grid-area: score; }
.blue-area { grid-area: blue; }

@media (max-width: 899px) and (orientation: portrait) {
  .scoreboard-layout {
    grid-template-areas:
      "score score"
      "red blue";
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: minmax(8rem, 24dvh) minmax(0, 1fr);
    gap: 0.5rem;
    padding: 0.5rem;
  }
}
</style>
