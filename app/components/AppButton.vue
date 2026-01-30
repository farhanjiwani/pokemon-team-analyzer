<script setup lang="ts">
defineProps<{
  variant?: "primary" | "danger";
  disabled?: boolean;
}>();
</script>

<template>
  <button
    :disabled="disabled"
    class="app-button"
    :class="[
      variant === 'danger'
        ? 'bg-red-50 text-red-600 hover:bg-red-100'
        : 'bg-blue-600 text-white hover:bg-blue-700',
    ]"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use "~/assets/css/_mixins.scss" as m;

.app-button {
  @apply py-2 px-4 rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100;
  @include m.focus-ring;
}
</style>
