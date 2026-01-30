<script setup lang="ts">
// Global logic like Pinia store initialization can stay here
import { useTeamStore } from "~/stores/team";
const teamStore = useTeamStore();
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
    <header
      class="sticky top-0 z-10 p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center"
    >
      <NuxtLink to="/">
        <h1 class="text-xl font-bold text-blue-600">PokéTeam Architect</h1>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-slate-600">
          Team:
          <span :class="teamStore.isFull ? 'text-red-500' : 'text-blue-600'"
            >{{ teamStore.count }}/6</span
          >
        </span>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>
