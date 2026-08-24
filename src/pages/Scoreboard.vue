<script setup lang="ts">
import LevelProgressBars from '../components/LevelProgressBars.vue';
import ScoreCard from '../components/ScoreCard.vue';
import SidePanel from '../components/SidePanel.vue';
</script>

<template>
  <div class="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-guandan-surface font-sans text-gray-100">
    <main class="scoreboard-layout min-h-0 flex-1">
      <aside class="red-area relative z-10 min-h-0 min-w-0">
        <SidePanel side="red" />
      </aside>

      <section class="score-area relative z-0 flex min-h-0 min-w-0 items-center justify-center overflow-hidden" aria-label="当前级数">
        <LevelProgressBars>
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
.scoreboard-layout {
  display: grid;
  grid-template-areas: "red score blue";
  grid-template-columns: clamp(7.5rem, 20vw, 17.5rem) minmax(11rem, 1fr) clamp(7.5rem, 20vw, 17.5rem);
  gap: clamp(0.75rem, 2vw, 2rem);
  padding: clamp(1rem, 2vw, 2.5rem);
  overflow: hidden;
}

.red-area { grid-area: red; }
.score-area { grid-area: score; }
.blue-area { grid-area: blue; }

@media (orientation: portrait) {
  .scoreboard-layout {
    grid-template-areas:
      "score score"
      "red blue";
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: clamp(10rem, 30dvh, 26rem) minmax(0, 1fr);
    gap: 0.5rem;
    padding: 0.5rem;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .scoreboard-layout {
    grid-template-columns: clamp(11rem, 31vw, 20rem) minmax(8rem, 1fr) clamp(11rem, 31vw, 20rem);
    gap: 0.5rem;
    padding: 0.5rem;
  }
}
</style>
