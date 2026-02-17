<script setup lang="ts">
import { capitalizeFirst } from "~/utils";
import type { PokeAPIDetail } from "~/types/pokemon";

type Direction = "left" | "right";

// HOOKS
const teamStore = useTeamStore();
const ui = useUIStore();
const route = useRoute();

const showStats = ref(false);

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

// "Clean", expected object for Store/Card
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

let audio: HTMLAudioElement | null = null;
const playCry = async () => {
  const cryUrl = pokemon.value?.cries?.latest;
  if (!cryUrl) return;

  try {
    // Stop and restart if already playing
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    audio = new Audio(cryUrl);
    audio.volume = 0.5;
    await audio.play();
  } catch (error) {
    console.error("Audio playback was blocked or failed:", error);
    ui.notify("Audio playback was blocked or failed");
  }
};

// Animate bars
onMounted(() => {
  setTimeout(() => {
    showStats.value = true;
  }, 150);
});
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
          <div class="flex items-center gap-4 pb-4">
            <h1 class="text-4xl font-black capitalize text-slate-900">
              {{ pokemon.name }}
            </h1>

            <button
              v-if="pokemon.cries?.latest"
              aria-label="Play Pokémon cry"
              title="Play Cry"
              :class="
                cn(
                  'p-2 rounded-full text-slate-400 bg-slate-100 transition-all',
                  'hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
                )
              "
              @click="playCry"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
                aria-hidden="true"
              >
                <path
                  d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z"
                />
                <path
                  d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z"
                />
              </svg>
            </button>
          </div>

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
                  class="h-full bg-blue-500 transition-all duration-1000 ease-out"
                  :style="{
                    width: showStats
                      ? `${(stat.base_stat / 255) * 100}%`
                      : '0%',
                  }"
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
