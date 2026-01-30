<script setup lang="ts">
import { useTeamStore } from "~/stores/team";
import type { PokemonBase } from "@/server/api/pokemon";

// TODO: add clsx to clean up Tailwind clutter

const {
  data: pokemonList,
  status,
  error,
} = await useFetch<PokemonBase[]>("/api/pokemon");

// Init STORE
const teamStore = useTeamStore();

// Event Handlers
function handleToggle(pokemon: PokemonBase) {
  if (teamStore.isInTeam(pokemon.id)) {
    teamStore.removePokemon(pokemon.id);
  } else {
    teamStore.addPokemon(pokemon);
  }
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
  <div class="">
    <!-- LOADING -->
    <div
      v-if="status === 'pending'"
      class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
    >
      <div
        v-for="i in 12"
        :key="`space-${i}`"
        class="h-64 bg-slate-200 animate-pulse rounded-xl"
      />
    </div>

    <!-- ERROR -->
    <div v-else-if="status === 'error'" class="p-12 text-center text-red-500">
      {{ error?.statusMessage }}
    </div>

    <!-- SUCCESS -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
