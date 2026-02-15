// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  extends: ["plugin:tailwindcss/recommended"],
  rules: {
    "vue/html-self-closing": "off",
  },
});
