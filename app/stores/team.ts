import { defineStore } from "pinia";
import type { PokemonBase } from "@/server/api/pokemon";

export const useTeamStore = defineStore("team", () => {
  // Reactive STATE
  const team = ref<PokemonBase[]>([]);

  // Automatic GETTERS
  const count = computed(() => team.value.length);
  const isFull = computed(() => count.value >= 6);

  // HELPERS
  /**
   * Check if a specific ID exists (O(n))
   * In a bigger app, a Set or Map for O(1) lookup is preferred
   */
  const isInTeam = (id: number) => team.value.some((p) => p.id === id);

  // ACTIONS
  function addPokemon(pokemon: PokemonBase) {
    if (isFull.value) return;

    if (!isInTeam(pokemon.id)) {
      team.value.push(pokemon);
    }
  }

  function removePokemon(id: number) {
    const index = team.value.findIndex((p) => p.id === id);
    if (index > -1) {
      team.value.splice(index, 1);
    }
  }

  return { team, count, isFull, isInTeam, addPokemon, removePokemon };
});
