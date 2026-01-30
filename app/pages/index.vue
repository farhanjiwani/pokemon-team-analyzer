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
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
    <main class="p-6 max-w-7xl mx-auto">
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
    </main>
  </div>
</template>
