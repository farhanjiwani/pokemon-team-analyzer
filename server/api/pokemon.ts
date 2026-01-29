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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("[PokeAPI Error]:", err.message);

    throw createError({
      statusCode: err.response?.status || 502,
      statusMessage: "Fetching Pokédex Failed",
      data: {
        reason:
          "The upstream Pokémon API is currently unreachable or returned an invalid response.",
        originalError: err.message,
      },
    });
  }
});
