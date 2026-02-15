<script setup lang="ts">
import { cn } from "~/utils";

const teamStore = useTeamStore();
const openSidebar = inject<() => void>("openSidebar");

const teamSizeClass = computed(() =>
  cn(teamStore.isFull ? "text-red-500" : "text-blue-600"),
);
</script>

<template>
  <header class="the-header">
    <NuxtLink
      to="/"
      class="rounded focus:outline-none focus:ring-2"
      tabindex="0"
    >
      <h1 class="text-xl font-bold text-blue-600">PokéTeam Architect</h1>
    </NuxtLink>

    <div
      role="button"
      class="cursor-pointer hover:underline"
      tabindex="0"
      @click="openSidebar"
      @keydown.enter.prevent="openSidebar"
      @keydown.space.prevent="openSidebar"
    >
      <div class="text-sm font-medium">
        Team:
        <span :class="teamSizeClass">{{ teamStore.count }}/6</span>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.the-header {
  @apply sticky top-0 z-10 p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center;
}
</style>
