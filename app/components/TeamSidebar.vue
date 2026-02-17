<script setup lang="ts">
import type { PokemonBase, SpecCategoryKey } from "~/types/pokemon";
import { POKE_SPEC_CATEGORIES } from "~/utils/constants";

// Types
type SortOption = "date" | "name" | "id" | SpecCategoryKey;

// Hooks n' Refs
const teamStore = useTeamStore();
const route = useRoute();
const sortBy = useCookie<SortOption>("team-sort-preference", {
  default: () => "date",
  maxAge: 86400 * 365, // 1 year in seconds (60x60x24x365)
  sameSite: "strict",
});

const isOpen = ref(false);
const closeBtn = ref<HTMLButtonElement | null>(null);

// Emitted and Exposed
const emit = defineEmits(["open", "close"]);

let triggerElement: HTMLElement | null = null;
const open = () => {
  // Remember modal trigger
  triggerElement = document.activeElement as HTMLElement;
  isOpen.value = true;
  emit("open");

  // Wait for transition, then focus close button
  nextTick(() => {
    closeBtn.value?.focus();
  });
};

const close = () => {
  isOpen.value = false;
  emit("close");

  // Restore focus triggering element
  nextTick(() => {
    triggerElement?.focus();
  });
};

defineExpose({ open });

// Handlers
const handleRemove = (id: number) => {
  teamStore.removePokemon(id);
};

// Spec sort ID
const sortedBySpec = computed(() =>
  POKE_SPEC_CATEGORIES.find(({ id }) => id === sortBy.value),
);

// Spec sort label
const specSortLabel = computed(() => {
  return sortedBySpec.value ? sortedBySpec.value.label : "";
});

// Sorting logic
const sortedTeam = computed(() => {
  const teamCopy = [...teamStore.team];

  /**
   * Looks up stats in the cache and falls back to 0 if
   * the async fetch hasn't finished yet.
   */
  const getStat = (aOrB: PokemonBase) =>
    teamStore.statsCache[aOrB.id]?.[sortBy.value] || 0;

  return teamCopy.sort((a, b) => {
    // Ascending ones
    if (sortBy.value === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy.value === "id") {
      return a.id - b.id;
    }
    // Else descending ones
    if (sortedBySpec.value) {
      return getStat(b) - getStat(a);
    }

    return 0; // Default: 'date'
  });
});

// Context specific "Back" button
const closeButtonLabel = computed(() => {
  return route.name === "index" ? "Back to Pokedex" : "Back to Analysis";
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px]"
        @click="close"
      />
    </Transition>

    <Transition name="slide-rtl">
      <div
        v-if="isOpen"
        id="team-sidebar"
        class="fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
        @keypress.esc="close"
      >
        <div class="mb-8 flex items-center justify-between">
          <h2 id="sidebar-title" class="text-xl font-bold">Your Squad</h2>

          <div class="flex items-center gap-4">
            <div v-if="teamStore.count > 1" class="relative">
              <label for="sort-team" class="sr-only">Sort team by</label>
              <select
                id="sort-team"
                v-model="sortBy"
                class="cursor-pointer rounded-md border-none bg-slate-100 py-1 pl-2 pr-6 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="Defaults">
                  <option value="date">Added</option>
                  <option value="id">PokéID #</option>
                  <option value="name">A-Z</option>
                </optgroup>
                <optgroup label="Attributes">
                  <option
                    v-for="cat in POKE_SPEC_CATEGORIES"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.label }}
                  </option>
                </optgroup>
              </select>
            </div>

            <button
              ref="closeBtn"
              class="-mr-2 rounded-lg p-2 text-slate-400 outline-none hover:text-slate-600 focus:ring-2 focus:ring-blue-500"
              aria-label="Close Team Sidebar"
              @click="close"
            >
              <SR_BtnSpan />
            </button>
          </div>
        </div>

        <TransitionGroup
          v-if="teamStore.count > 0"
          name="list"
          tag="ul"
          class="relative flex-1 overflow-y-auto overflow-x-hidden pr-2"
        >
          <li
            v-for="p in sortedTeam"
            :key="p.id"
            class="mb-4 flex w-full items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3"
          >
            <img :src="p.image" alt="" class="size-12 object-contain" />
            <span class="flex-1 text-sm font-bold capitalize">
              <span>{{ p.name }}</span>
              <br />

              <span
                v-if="sortedBySpec"
                class="text-xs font-normal normal-case text-slate-500"
              >
                {{ specSortLabel }}:

                {{ teamStore.statsCache[p.id]?.[sortBy] || "..." }}
              </span>
            </span>
            <button
              class="p-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600"
              :aria-label="`Remove ${p.name} from team`"
              @click="handleRemove(p.id)"
            >
              <SR_BtnSpan />
            </button>
          </li>
        </TransitionGroup>

        <div
          v-else
          class="flex flex-1 flex-col items-center justify-center text-center text-slate-400"
        >
          <p class="text-sm italic">
            Your team is empty!<br />Go catch some Pokémon.
          </p>
        </div>

        <div class="mt-2 flex justify-end">
          <AppButton class="mt-6 w-full" @click="teamStore.clearTeam()">
            Clear entire team
          </AppButton>
        </div>

        <AppButton variant="primary" class="mt-6 w-full" @click="close">
          {{ closeButtonLabel }}
        </AppButton>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-rtl-enter-active,
.slide-rtl-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-rtl-enter-from,
.slide-rtl-leave-to {
  transform: translateX(100%);
}

.list-move, /* Smoothly moves remaining items up/down */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

/* Takes "leaving" item out of the layout flow so items below can slide away */
.list-leave-active {
  position: absolute;
  width: 100%;
}

ul {
  /* Don't jump when the scrollbar appears */
  scrollbar-gutter: stable;
}
</style>
