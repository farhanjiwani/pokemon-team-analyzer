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
    class="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center"
  >
    <div class="max-w-md">
      <div class="text-9xl font-black text-slate-200 mb-4">
        {{ error.statusCode }}
      </div>

      <picture class="block mb-8">
        <source
          srcset="/img/404.webp 1x, /img/404__2x.webp 2x"
          type="image/webp"
        />
        <img
          src="/img/404.webp"
          alt="Screenshot of Game Boy screen where Eevee encounters Super Nerd"
          class="mx-auto w-64 h-auto"
        />
      </picture>

      <h1 class="text-3xl font-bold text-slate-900 mb-2">
        Wild ERROR Appeared!
      </h1>
      <p class="text-slate-600 mb-8">
        {{ error.message || "The Pokémon fled." }}
      </p>

      <AppButton variant="primary" @click="handleError">
        Return to Safety
      </AppButton>
    </div>
  </div>
</template>
