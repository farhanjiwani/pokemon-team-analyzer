import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  css: ["~/assets/css/main.scss"],
  devtools: { enabled: true },

  modules: [
    "@nuxt/a11y",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxtjs/tailwindcss",
    "@nuxt/test-utils",
    "@pinia/nuxt",
  ],

  typescript: {
    typeCheck: false, // check at CI/CD & troubleshooting dev via npm script
    strict: true,
  },
});
