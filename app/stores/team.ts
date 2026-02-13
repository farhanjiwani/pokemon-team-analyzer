import { defineStore } from "pinia";
import { useUIStore } from "./ui";
import { capitalizeFirst } from "~/utils";
import type { PokemonBase } from "@/server/api/pokemon";

export const useTeamStore = defineStore(
  "team",
  () => {
    const ui = useUIStore();

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
      if (isFull.value) {
        ui.notify("Your team is full! Remove one first.");
        return;
      }

      if (!isInTeam(pokemon.id)) {
        team.value.push(pokemon);
        ui.notify(`${capitalizeFirst(pokemon.name)} added to your squad.`);
      }
    }

    function removePokemon(id: number) {
      const index = team.value.findIndex((p) => p.id === id);
      if (index > -1) {
        // Save for Undo
        const removed = team.value[index] as PokemonBase;

        // Remove
        team.value.splice(index, 1);

        // Toast w/ Undo button
        ui.notify(`${capitalizeFirst(removed.name)} removed.`, {
          label: "Undo",
          callback: () => {
            addPokemon(removed);
          },
        });
      }
    }

    function toggleMember(pokemon: PokemonBase) {
      if (isInTeam(pokemon.id)) {
        removePokemon(pokemon.id);
      } else {
        addPokemon(pokemon);
      }
    }

    return {
      team,
      count,
      isFull,
      isInTeam,
      addPokemon,
      removePokemon,
      toggleMember,
    };
  },
  { persist: true },
);
