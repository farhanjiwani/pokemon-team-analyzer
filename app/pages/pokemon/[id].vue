<script setup lang="ts">
// Get ID
const route = useRoute();
const pokemonId = route.params.id;

// Fetch data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { data: pokemon, status } = await useFetch<any>(
  `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
);

// SEO helper
useSeoMeta({
  title: () => `${pokemon.value?.name ?? "Loading"} | PokéTeam Architect`,
  description: "Detailed analysis of Pokémon stats and abilities.",
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 mb-8 transition-colors"
    >
      ← Back to Pokedex
    </NuxtLink>

    <!-- LOADING -->
    <div
      v-if="status === 'pending'"
      class="h-96 bg-white animate-pulse rounded-3xl"
    />

    <!-- SUCCESS -->
    <article
      v-else-if="pokemon"
      class="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
    >
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div class="bg-slate-50 rounded-2xl p-4">
          <img
            :src="pokemon.sprites.other['official-artwork'].front_default"
            :alt="pokemon.name"
            class="w-full h-auto drop-shadow-2xl"
          />
        </div>

        <div>
          <span class="text-blue-600 font-mono font-bold"
            >#{{ pokemon.id }}</span
          >
          <h1 class="text-4xl font-black capitalize text-slate-900 mb-4">
            {{ pokemon.name }}
          </h1>

          <div class="flex gap-2 mb-6">
            <span
              v-for="type in pokemon.types"
              :key="type.type.name"
              class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600"
            >
              {{ type.type.name }}
            </span>
          </div>

          <div class="space-y-4">
            <div v-for="stat in pokemon.stats" :key="stat.stat.name">
              <div
                class="flex justify-between text-xs font-bold uppercase text-slate-400 mb-1"
              >
                <span>{{ stat.stat.name }}</span>
                <span>{{ stat.base_stat }}</span>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-500 transition-all duration-1000"
                  :style="{ width: `${(stat.base_stat / 255) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
