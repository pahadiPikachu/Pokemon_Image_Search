// To randomly select pokemons as suggestions, to be displayed on first load/refresh

export function getRandomPokemon(pokemonList, count = 20) {
    let shuffled = [...pokemonList];
    shuffled.sort(() => Math.random() - 0.5);  // Random shuffling for images 
  
    // Return the first 'count' number of Pokémon
    return shuffled.slice(0, count);
  }