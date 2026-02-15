<script setup lang="ts">
import { cn } from "~/utils";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "danger";
    disabled?: boolean;
  }>(),
  {
    variant: "",
    disabled: false,
  },
);

const classes = computed(() => cn("app-button", props.variant));
</script>

<template>
  <button :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use "~/assets/css/_mixins.scss" as m;

.app-button {
  @apply py-2 px-4 rounded-lg text-sm font-semibold transition-all bg-slate-200 text-slate-700 hover:bg-slate-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100;
  @include m.focus-ring;

  &.primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }

  &.danger {
    @apply bg-red-50 text-red-600 hover:bg-red-100;
  }
}
</style>
