<script setup lang="ts">
import type { PokemonBase } from "@/server/api/pokemon";

// PROPS
const props = defineProps<{
  pokemon: PokemonBase;
  isSelected: boolean;
  disabled: boolean;
}>();

// EMITS
const emit = defineEmits<{
  (e: "toggle", pokemon: PokemonBase): void;
}>();

// EVENT HANDLING
function handleCardClick() {
  navigateTo(`/pokemon/${props.pokemon.id}`);
}
</script>

<template>
  <article
    class="relative p-4 rounded-xl border-2 transition-all flex flex-col items-center bg-white group"
    :class="
      isSelected
        ? 'border-blue-500 shadow-lg'
        : 'border-transparent shadow-sm hover:shadow-md'
    "
    @click="handleCardClick"
  >
    <img
      :src="pokemon.image"
      :alt="`Official artwork of ${pokemon.name}`"
      class="w-32 h-32 object-contain group-hover:scale-110 transition-transform"
      loading="lazy"
    />

    <h2 class="mt-4 font-bold capitalize text-slate-800">{{ pokemon.name }}</h2>
    <p class="text-xs text-slate-400 mb-4">#{{ pokemon.id }}</p>

    <button
      :disabled="disabled && !isSelected"
      class="w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200"
      :class="
        isSelected
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400'
      "
      @click.stop="emit('toggle', pokemon)"
    >
      {{ isSelected ? "Remove" : "Add to Team" }}
    </button>
  </article>
</template>
