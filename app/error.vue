<script setup lang="ts">
import type { NuxtError } from "nuxt/app";

// TODO: Add other status codes
// ?? 200: Success (Gotcha!)
// 404: Not Found (The Pokémon fled / Invalid ID)
// 500: Server Error (Team Rocket hijacked the server)
// 429: Too Many Requests (You're throwing Pokéballs too fast / Rate Limit)

// Nuxt provides 'error' prop automatically
defineProps<{
  error: NuxtError;
}>();

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center"
  >
    <div class="max-w-md">
      <div class="mb-4 text-9xl font-black text-slate-200">
        {{ error.statusCode }}
      </div>

      <picture class="mb-8 block">
        <source
          srcset="/img/404.webp 1x, /img/404__2x.webp 2x"
          type="image/webp"
        />
        <img
          src="/img/404.webp"
          alt="Screenshot of Game Boy screen where Eevee encounters Super Nerd"
          class="mx-auto h-auto w-64"
        />
      </picture>

      <h1 class="mb-2 text-3xl font-bold text-slate-900">
        Wild ERROR Appeared!
      </h1>
      <p class="mb-8 text-slate-600">
        {{ error.message || "The Pokémon fled." }}
      </p>

      <AppButton variant="primary" @click="handleError">
        Return to Safety
      </AppButton>
    </div>
  </div>
</template>
