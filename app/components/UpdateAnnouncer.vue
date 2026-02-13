<script setup lang="ts">
const ui = useUIStore();
const ctrlKey = ref("Control"); // Default for SSR

const handleAction = () => {
  if (ui.action) {
    // Do action and close toast
    ui.action.callback();
    ui.isVisible = false;
  }
};

// KB controls
const handleKeydown = (e: KeyboardEvent) => {
  // Check if toast is visible AND has an action
  if (!ui.isVisible || !ui.action) return;

  // Check for Ctrl+Z (or Cmd+Z on Mac)
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault(); // Block browser's Undo during toast
    handleAction();
  }
};

// Detect if Mac OS & add listener
onMounted(() => {
  if (navigator.userAgent.indexOf("Mac OS X") != -1) {
    ctrlKey.value = "Command";
  }

  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div
        v-if="ui.isVisible"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 p-1 pr-4 rounded-full bg-slate-900 text-white shadow-2xl border border-slate-700"
        role="status"
      >
        <div class="flex items-center gap-3 py-2 pl-4">
          <span class="text-blue-400 font-bold">i</span>
          <span class="text-sm font-medium">{{ ui.message }}</span>
        </div>

        <div
          v-if="ui.action"
          class="flex items-center border-l border-slate-700 pl-3"
        >
          <button
            class="text-sm font-bold text-blue-400 hover:text-blue-300 hover:bg-slate-800 px-3 py-1 rounded transition-colors"
            tabindex="-1"
            @click="handleAction"
          >
            {{ ui.action.label }}
          </button>
        </div>
      </div>
    </Transition>

    <div class="sr-only" aria-live="polite" aria-atomic="true">
      {{ ui.message }}
      {{ ui.action ? `Press ${ctrlKey} Z to undo.` : "" }}
    </div>
  </Teleport>
</template>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-slide-enter-from {
  transform: translate(-50%, 100px);
  opacity: 0;
}
.toast-slide-leave-to {
  transform: translate(-50%, 20px);
  opacity: 0;
}
</style>
