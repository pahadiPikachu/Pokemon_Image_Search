// Component to display Pokémon suggestions as clickable cards; it triggers a search for the selected Pokémon.
// Each card shows the Pokémon's name and image. If the image fails to load, the card is hidden.

import { useState } from 'react';

function SuggestionCard({ pokemonName, pokemonUrl, onClick }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) return null; // If there's an image error, hide the card

  return (
    <div
      className="pokemon-card"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <img
        src={pokemonUrl}
        alt={pokemonName}
        onError={() => setImageError(true)}  // If the image fails to load, set error state
      />
      <h3>{pokemonName}</h3>
    </div>
  );
}

export default SuggestionCard;
