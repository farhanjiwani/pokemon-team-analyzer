<script setup lang="ts">
import type { PokemonBase } from "@/server/api/pokemon";

const {
  data: pokemonList,
  status,
  error,
} = await useFetch<PokemonBase[]>("/api/pokemon");
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="p-6 bg-white border-b border-slate-200">
      <h1 class="text-2xl font-bold text-blue-600">PokéTeam Architect</h1>
      <p class="text-xs text-slate-400 uppercase tracking-widest font-semibold">
        A Farhan Jiwani Portfolio Piece
      </p>
    </header>

    <main class="p-6 max-w-7xl mx-auto">
      <!-- Loading skeleton -->
      <div
        v-if="status === 'pending'"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        <div
          v-for="i in 12"
          :key="`space-${i}`"
          class="h-48 bg-slate-200 animate-pulse rounded-xl"
        />
      </div>

      <!-- Error message -->
      <div
        v-else-if="status === 'error'"
        class="p-12 text-center bg-white rounded-2xl shadow-sm border border-red-100"
      >
        <p class="text-red-500 font-bold text-xl">System Error</p>
        <p class="text-slate-600">
          {{ error?.statusMessage || "Unknown connectivity issue" }}
        </p>
      </div>

      <!-- Happy path render -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <article
          v-for="p in pokemonList"
          :key="`pokemon-${p.id}`"
          class="p-4 bg-white rounded-xl border border-transparent hover:border-blue-500 hover:shadow-lg transition-all group"
        >
          <img
            :src="p.image"
            :alt="`Artwork of ${p.name}`"
            class="w-full aspect-square object-contain group-hover:scale-105 transition-transform"
            loading="lazy"
          />
          <h2 class="mt-4 text-center capitalize font-bold text-slate-700">
            {{ p.name }}
          </h2>
          <p class="text-center text-xs text-slate-400">#{{ p.id }}</p>
        </article>
      </div>
    </main>
  </div>
</template>
