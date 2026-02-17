export type { SpecCategoryKey } from "~/utils/constants";

// The basic shape used in lists/sidebar
export interface PokemonBase {
  id: number;
  name: string;
  image: string;
}

// The cache shape
export type PokemonStats = Record<string, number>;

// The exact shape we care about from the PokeAPI detail endpoint
export interface PokeAPIDetail {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  cries: {
    latest: string;
  };
}
