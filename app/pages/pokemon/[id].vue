<script setup lang="ts">
import { capitalizeFirst } from "~/utils";
import type { PokeAPIDetail } from "~/types/pokemon";

type Direction = "left" | "right";

// HOOKS
const teamStore = useTeamStore();
const route = useRoute();

// META
definePageMeta({
  validate: async (route) => {
    const id = Number(route.params.id);
    // Return false to trigger 404 page
    return !isNaN(id) && id > 0 && id <= 151;
  },
});

const setTransition = (dir: Direction) => {
  route.meta.pageTransition = {
    name: `slide-${dir}`,
    mode: "out-in",
  };
};

// Get IDs
const pokemonId = Number(route.params.id) || 0;
const nextId = computed(() => pokemonId + 1);
const prevId = computed(() => Math.max(1, pokemonId - 1));

const isSelected = computed(() => teamStore.isInTeam(pokemonId));

// Fetch data
const { data: pokemon, status } = await useFetch<PokeAPIDetail>(
  `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
);

// This creates a "Clean" object that matches what your Store/Card expects
const pokemonForTeam = computed(() => {
  if (!pokemon.value) return null;
  return {
    id: pokemon.value.id,
    name: pokemon.value.name,
    image: pokemon.value.sprites.other["official-artwork"].front_default,
    types: pokemon.value.types,
  };
});

// SEO helper
useSeoMeta({
  title: () => {
    return `${capitalizeFirst(pokemon.value?.name) ?? "Loading"} | PokéTeam Architect`;
  },
  description: "Detailed analysis of Pokémon stats and abilities.",
});

// Actions
const navigateWithTransition = (dir: Direction, targetId: number) => {
  setTransition(dir);
  navigateTo(`/pokemon/${targetId}`);
};

const toggleTeam = () => {
  teamStore.toggleMember(pokemonForTeam.value!);
};
</script>

<template>
  <div class="mx-auto max-w-3xl p-6">
    <NuxtLink to="/" class="back-link" tabindex="0">
      ← Back to Pokedex
    </NuxtLink>

    <!-- LOADING -->
    <div
      v-if="status === 'pending'"
      class="h-96 animate-pulse rounded-3xl bg-white"
    />

    <!-- SUCCESS -->
    <article
      v-else-if="pokemon"
      class="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl"
    >
      <div class="grid items-center gap-8 md:grid-cols-2">
        <div class="rounded-2xl bg-slate-50 p-4">
          <img
            :src="pokemon.sprites.other['official-artwork'].front_default"
            :alt="pokemon.name"
            class="h-auto w-full drop-shadow-2xl"
          />
        </div>

        <div>
          <span class="font-mono font-bold text-blue-600"
            >#{{ pokemon.id }}</span
          >
          <h1 class="mb-4 text-4xl font-black capitalize text-slate-900">
            {{ pokemon.name }}
          </h1>

          <div class="mb-6 flex gap-2">
            <span
              v-for="type in pokemon.types"
              :key="type.type.name"
              class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              {{ type.type.name }}
            </span>
          </div>

          <div class="space-y-4">
            <div v-for="stat in pokemon.stats" :key="stat.stat.name">
              <div
                class="mb-1 flex justify-between text-xs font-bold uppercase text-slate-600"
              >
                <span>{{ stat.stat.name }}</span>
                <span>{{ stat.base_stat }}</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-slate-100">
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

    <div class="mt-8 flex items-center justify-between gap-4">
      <AppButton
        :disabled="pokemonId <= 1"
        @click="navigateWithTransition('left', prevId)"
      >
        &laquo; Previous
      </AppButton>

      <AppButton
        :variant="isSelected ? 'danger' : 'primary'"
        class="flex-1"
        :disabled="!pokemonForTeam"
        @click.stop="toggleTeam()"
      >
        {{ isSelected ? "Remove from Team" : "Add to Team" }}
      </AppButton>

      <AppButton
        :disabled="pokemonId >= 151"
        @click="navigateWithTransition('right', nextId)"
      >
        Next &raquo;
      </AppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/css/_mixins.scss" as m;

.back-link {
  @apply inline-flex items-center gap-2 text-sm font-semibold text-slate-500 mb-8;
  @include m.focus-ring;
}
</style>
