<script setup lang="ts">
const teamStore = useTeamStore();
</script>

<template>
  <header class="the-header">
    <NuxtLink
      to="/"
      class="focus:outline-none focus:ring-2 rounded"
      tabindex="0"
    >
      <h1 class="text-xl font-bold text-blue-600">PokéTeam Architect</h1>
    </NuxtLink>

    <div class="text-sm font-medium">
      Team:
      <span :class="teamStore.isFull ? 'text-red-500' : 'text-blue-600'"
        >{{ teamStore.count }}/6</span
      >
    </div>
  </header>
</template>

<style lang="scss" scoped>
.the-header {
  @apply sticky top-0 z-10 p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center;
}
</style>
