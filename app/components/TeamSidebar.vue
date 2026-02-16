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
          class="relative flex-1 overflow-y-auto pr-2"
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
                v-if="specCategories.includes(sortBy)"
                class="text-xs font-normal normal-case text-slate-500"
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
  transform: translateX(30px); /* Slides items in/out from the right */
}

/* Takes "leaving" item out of the layout flow so items below can slide up */
.list-leave-active {
  position: absolute;
}
</style>
