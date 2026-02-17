import { defineStore } from "pinia";
import { useUIStore } from "./ui";
import { capitalizeFirst } from "~/utils";
import type { PokemonBase, PokemonStats, PokeAPIDetail } from "~/types/pokemon";

export const useTeamStore = defineStore(
  "team",
  () => {
    const ui = useUIStore();

    // Reactive STATE
    const team = ref<PokemonBase[]>([]);
    const statsCache = ref<Record<number, PokemonStats>>({});

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
    // Fetches and caches individuals' stats
    async function fetchAndCacheStats(id: number) {
      if (statsCache.value[id]) return;

      try {
        // Non-SSR because will be called on adding a team member
        const data = await $fetch<PokeAPIDetail>(
          `https://pokeapi.co/api/v2/pokemon/${id}`,
        );

        const statsObj: PokemonStats = {};
        data.stats.forEach((s) => {
          statsObj[s.stat.name] = s.base_stat;
        });

        statsCache.value[id] = statsObj;
      } catch (error) {
        console.error(`Failed to fetch stats for #${id}`, error);
      }
    }

    function addPokemon(pokemon: PokemonBase) {
      if (isFull.value) {
        ui.notify("Your team is full! Remove one first.");
        return;
      }

      if (!isInTeam(pokemon.id)) {
        team.value.push(pokemon);
        ui.notify(`${capitalizeFirst(pokemon.name)} added to your squad.`);

        // Optimistic UI
        fetchAndCacheStats(pokemon.id);
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

    function clearTeam() {
      if (count.value === 0) return;

      // Save for Undo, then empty store and trigger toast
      const previousTeam = [...team.value];
      team.value = [];
      ui.notify("Your entire team was cleared.", {
        label: "Undo",
        callback: () => {
          team.value = previousTeam;
        },
      });
    }

    return {
      count,
      isFull,
      team,
      statsCache,
      addPokemon,
      isInTeam,
      removePokemon,
      toggleMember,
      clearTeam,
    };
  },
  { persist: true },
);
