// Pokemon spec categories
// export const POKE_SPEC_CATEGORIES = {
//   hp: "HP",
//   attack: "ATK",
//   defense: "DEF",
//   "special-attack": "S. ATK",
//   "special-defense": "S. DEF",
//   speed: "SPD",
// } as const;

// export type SpecCategoryKey = keyof typeof POKE_SPEC_CATEGORIES;

export const POKE_SPEC_CATEGORIES = [
  { id: "hp", label: "HP" },
  { id: "attack", label: "ATK" },
  { id: "defense", label: "DEF" },
  { id: "special-attack", label: "S. ATK" },
  { id: "special-defense", label: "S. DEF" },
  { id: "speed", label: "SPD" },
] as const;

export type SpecCategoryKey = (typeof POKE_SPEC_CATEGORIES)[number]["id"];
