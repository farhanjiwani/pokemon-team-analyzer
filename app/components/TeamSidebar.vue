<script setup lang="ts">
import { POKE_SPEC_CATEGORIES } from "~/utils/constants";

const specCategories = Object.keys(POKE_SPEC_CATEGORIES);
type Attribute = keyof typeof POKE_SPEC_CATEGORIES;
type SortOption = "date" | "name" | "id" | Attribute;

const teamStore = useTeamStore();
const route = useRoute();
const sortBy = useCookie<SortOption>("team-sort-preference", {
  default: () => "date",
  maxAge: 86400 * 365, // 1 year in seconds (60x60x24x365)
  sameSite: "strict",
});

const isOpen = ref(false);
const closeBtn = ref<HTMLButtonElement | null>(null);
let triggerElement: HTMLElement | null = null;

const emit = defineEmits(["open", "close"]);

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

const handleRemove = (id: number) => {
  teamStore.removePokemon(id);
};

defineExpose({ open });

const sortedTeam = computed(() => {
  const teamCopy = [...teamStore.team];

  return teamCopy.sort((a, b) => {
    // Ascending ones
    if (sortBy.value === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy.value === "id") {
      return a.id - b.id;
    }

    // Else descending ones
    if (specCategories.includes(sortBy.value)) {
      const statKey = sortBy.value;

      // Look up stats in the cache.
      // Falls back to 0 if the async fetch hasn't finished yet.
      const statA = teamStore.statsCache[a.id]?.[statKey] || 0;
      const statB = teamStore.statsCache[b.id]?.[statKey] || 0;

      return statB - statA;
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
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40"
        @click="close"
      />
    </Transition>

    <Transition name="slide-rtl">
      <div
        v-if="isOpen"
        id="team-sidebar"
        class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 p-6 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
        @keypress.esc="close"
      >
        <div class="flex justify-between items-center mb-8">
          <h2 id="sidebar-title" class="text-xl font-bold">Your Squad</h2>

          <div class="flex items-center gap-4">
            <div v-if="teamStore.count > 1" class="relative">
              <label for="sort-team" class="sr-only">Sort team by</label>
              <select
                id="sort-team"
                v-model="sortBy"
                class="text-xs border-none bg-slate-100 rounded-md py-1 pl-2 pr-6 focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium cursor-pointer"
              >
                <optgroup label="Defaults">
                  <option value="date">Added</option>
                  <option value="id">PokéID #</option>
                  <option value="name">A-Z</option>
                </optgroup>
                <optgroup label="Attributes">
                  <option
                    v-for="(cat, i) in specCategories"
                    :key="i"
                    :value="cat"
                  >
                    {{ POKE_SPEC_CATEGORIES[cat] }}
                  </option>
                </optgroup>
              </select>
            </div>

            <button
              ref="closeBtn"
              class="p-2 -mr-2 text-slate-400 hover:text-slate-600 focus:ring-2 focus:ring-blue-500 rounded-lg outline-none"
              aria-label="Close Team Sidebar"
              @click="close"
            >
              <SR_BtnSpan />
            </button>
          </div>
        </div>

        <ul
          v-if="teamStore.count > 0"
          class="space-y-4 overflow-y-auto flex-1 pr-2"
        >
          <li
            v-for="p in sortedTeam"
            :key="p.id"
            class="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100"
          >
            <img :src="p.image" alt="" class="w-12 h-12 object-contain" />
            <span class="font-bold capitalize flex-1 text-sm">
              <span>{{ p.name }}</span>
              <br />

              <span
                v-if="specCategories.includes(sortBy)"
                class="text-xs text-slate-500 font-normal normal-case"
              >
                {{ teamStore.statsCache[p.id]?.[sortBy] || "..." }}

                {{
                  POKE_SPEC_CATEGORIES[
                    sortBy as keyof typeof POKE_SPEC_CATEGORIES
                  ]
                }}
              </span>
            </span>
            <button
              class="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest p-2"
              :aria-label="`Remove ${p.name} from team`"
              @click="handleRemove(p.id)"
            >
              <SR_BtnSpan />
            </button>
          </li>
        </ul>

        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center text-slate-400 text-center"
        >
          <p class="italic text-sm">
            Your team is empty!<br />Go catch some Pokémon.
          </p>
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
</style>
