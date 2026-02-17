# 🚀 PokéTeam Architect - Project Roadmap

## 🛠 Active TODO List

- [ ] Pokémon Cries (Audio)
  - Add a "Play Cry" button next to the name on the [id].vue page.
  - Fetch from pokemon.cries.latest and use the Web Audio API to play.
- [ ] Unit Testing Foundation
  - Set up vitest and @vue/test-utils.
  - Write tests for utils/index.ts (e.g., capitalizeFirst).
  - Write component tests for AppButton.vue and PokemonCard.vue.
- [ ] Type Coverage (Radar Chart)
  - Build a "Team Strength" visualization.
  - Aggregate stats from all 6 team members using the statsCache in Pinia.
- [ ] Enhanced Sorting
  - Add a "Descending" toggle to the sidebar sort options.
- [ ] PWA Support
  - Add @vite-pwa/nuxt to make the app installable and work offline (caching the first 151 images).

## 💡 Architectural Nice-to-Haves

Alternative perspectives and solutions to keep in mind as the project grows.

1. Optimistic Store Strategy
   - **Current**: We fetch stats when a Pokémon is added to the team.
   - **Suggestion**: Since it's only 151 Pokémon, you could pre-fetch a "lite" version of all stats on the initial index load and store them in a Map. This would make the Radar Chart feel instantaneous.
1. State Persistence
   - **Current**: Team is lost on hard refresh (unless using useCookie for some parts).
   - **Suggestion**: Use the pinia-plugin-persistedstate to automatically sync your team to localStorage. This ensures the user's team is still there if they accidentally close the tab.
1. Accessibility (A11y) Polish
   - **Current**: Basic keyboard navigation is in place.
   - **Suggestion**: Use focus-trap when the Sidebar is open to ensure "Screen Reader" users don't accidentally navigate behind the modal.

## ✅ Completed Tasks (Recent)

- [x] Fixed: CSS Classname linting warnings (Whitelisted custom classes).
- [x] Fixed: cn() reactivity bug by wrapping in computed().
- [x] Feature: "Clear Team" function with Undo/Toast notification.
- [x] Animation: Smooth list transitions in Sidebar (Fixed top-member jank).
- [x] Animation: Stat bars slide from 0 to target value on mount.
