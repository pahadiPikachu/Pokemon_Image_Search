import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js'; // library for suggestions when typing names
import PokemonCard from './PokemonCard';
import SuggestionCard from './SuggestionCard';
import { getRandomPokemon } from './utils'; 
import './styles.css';  

function PokemonSearch() {

  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState('');
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [randomPokemon, setRandomPokemon] = useState([]);

  useEffect(() => {
    // Fetch initial random Pokémon list
    const fetchInitialPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await response.json();
        setPokemonList(data.results);
        setRandomPokemon(getRandomPokemon(data.results, 20)); // To avoid random pokemon list to appear with actual results
      } catch (error) {
        console.error('Error fetching initial Pokémon:', error);
      }
    };

    // Fetch all Pokémon names for suggestions
    const fetchAllPokemonNames = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302');
        const data = await response.json();
        setAllPokemonNames(data.results.map(p => p.name));
      } catch (error) {
        console.error('Error fetching Pokémon names:', error);
      }
    };

    fetchInitialPokemon();
    fetchAllPokemonNames();
  }, []);

  //takes user input and finds close matches
  const findSuggestions = (inputName) => {
    const fuse = new Fuse(allPokemonNames, { threshold: 0.3 }); // uses fuzzy search to find matches
    const results = fuse.search(inputName).map(result => result.item);
    setSuggestions(results);
  };

  const fetchPokemonData = async (name) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokémon not found');
      }
      const data = await response.json();

      setPokemonData(data);
      setError('');
      setSearchPerformed(true);
      setSuggestions([]);
    } catch (err) {
      setError(err.message);
      findSuggestions(name);
      setPokemonData(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pokemonName.trim()) {
      fetchPokemonData(pokemonName);
    }
  };

  // make suggestions searchable
  const handleSuggestionClick = (suggestion) => {
    setPokemonName(suggestion);
    fetchPokemonData(suggestion); // fetch data when suggestions are clicked
  };

  // Since images are in different locations, requires a list of urls
  // Some urls don't exist for some pokemons and are filtered in card components
  const generateImageUrls = (pokemonId) => {
    // Array of URLs that may contain images
    return [
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonId}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`,
    ];
  };
  
  // const renderPokemonImages = (pokemonData) => {
  //   return generateImageUrls(pokemonData.id).map((url, index) => (
  //     <PokemonCard
  //       key={index}
  //       imageUrl={url}
  //       altText={`${pokemonData.name} image ${index + 1}`}
  //       name={pokemonData.name}
  //       onError={() => console.log(`Image failed to load for: ${url}`)} // logging for debugging
  //     />
  //   ));
  // };
  

  return (
    <div>
      <h1> <span onClick={() => { 
        setSearchPerformed(false); 
        setPokemonName(''); 
        setPokemonData(null); 
        setRandomPokemon(getRandomPokemon(pokemonList, 20)); // Regenerate random Pokémon list each time title is clicked
      }}>
        Pokémon Image Search
</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          placeholder="Enter Pokémon name"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

    {suggestions.length > 0 && (
      <div>
        <h4>Did you mean?</h4>
        <ul className="suggestions-list">
          {suggestions.slice(0, 5).map((suggestion) => (
            <li key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    )}


      {/* Display Pokémon cards with images */}
      {pokemonData && (
        <div className="pokemon-grid">
          {generateImageUrls(pokemonData.id).map((url, index) => (
            <PokemonCard
              key={index}
              imageUrl={url}
              altText={`${pokemonData.name} image ${index + 1}`}
              name={pokemonData.name}
            />
          ))}
        </div>
      )}

      {/* Display random Pokémon cards---- only on initial load */}
      {!searchPerformed && randomPokemon.length > 0 && (
        <div className="pokemon-grid">
          {randomPokemon.map((pokemon) => (
            <SuggestionCard
              key={pokemon.name}
              pokemonName={pokemon.name}
              pokemonUrl={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split('/')[6]}.png`}
              onClick={() => handleSuggestionClick(pokemon.name)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PokemonSearch;
