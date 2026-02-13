<script setup lang="ts">
const sidebarRef = ref();
const isSidebarActive = ref(false);

provide("openSidebar", () => {
  isSidebarActive.value = true;
  sidebarRef.value?.open();
});
</script>

<template>
  <NuxtLayout :inert="isSidebarActive">
    <NuxtPage />
  </NuxtLayout>

  <TeamSidebar
    ref="sidebarRef"
    @open="isSidebarActive = true"
    @close="isSidebarActive = false"
  />

  <UpdateAnnouncer />
</template>
