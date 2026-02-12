<script setup lang="ts">
withDefaults(
  defineProps<{
    copy?: string;
    className?: string;
  }>(),
  {
    copy: "✕",
    className: "text-xl",
  },
);
</script>

<template>
  <span aria-hidden="true" :class="className">
    {{ copy }}
  </span>
</template>
