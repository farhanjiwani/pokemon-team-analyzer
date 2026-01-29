// Data contract
export interface PokemonBase {
  id: number;
  name: string;
  image: string;
}

export default defineEventHandler(async (): Promise<PokemonBase[]> => {
  try {
    // Fetch data and transform
    const response = await $fetch<{ results: { name: string; url: string }[] }>(
      "https://pokeapi.co/api/v2/pokemon?limit=151",
    );

    return response.results.map((p, index) => {
      const id = index + 1;
      return {
        id,
        name: p.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    });
  } catch {
    // TODO: Make this more helpful
    throw createError({
      statusCode: 502,
      statusMessage: "PokeAPI Connectivity Issue",
    });
  }
});
