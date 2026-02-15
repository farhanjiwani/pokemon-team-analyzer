<script setup lang="ts">
import { useTeamStore } from "~/stores/team";
import type { PokemonBase } from "@/server/api/pokemon";

const {
  data: pokemonList,
  status,
  error,
} = await useFetch<PokemonBase[]>("/api/pokemon");

// Init STORES
const teamStore = useTeamStore();

// Event Handlers
function handleToggle(pokemon: PokemonBase) {
  teamStore.toggleMember(pokemon);
}

// SEO
useSeoMeta({
  title: "PokéTeam Architect",
  ogTitle: "PokéTeam Architect",
  description: "A high-performance Pokémon team builder.",
  ogDescription: "A high-performance Pokémon team builder.",
});
</script>

<template>
  <div>
    <!-- LOADING -->
    <div
      v-if="status === 'pending'"
      class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6"
    >
      <div
        v-for="i in 12"
        :key="`space-${i}`"
        class="h-64 animate-pulse rounded-xl bg-slate-200"
      />
    </div>

    <!-- ERROR -->
    <div v-else-if="status === 'error'" class="p-12 text-center text-red-500">
      {{ error?.statusMessage }}
    </div>

    <!-- SUCCESS -->
    <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
      <PokemonCard
        v-for="p in pokemonList"
        :key="`poke-${p.id}`"
        :pokemon="p"
        :is-selected="teamStore.isInTeam(p.id)"
        :disabled="teamStore.isFull"
        @toggle="handleToggle"
      />
    </div>
  </div>
</template>
