// Component to display relevant Pokémon images
// When clicked it opens the full size image in a new tab, where it can be downloaded
// Each card shows the Pokémon's name and image. If the image fails to load, the card is hidden.

import { useState } from 'react';

function PokemonCard({ imageUrl, altText, name, onError }) {
  const [isValidImage, setIsValidImage] = useState(true);

  const handleError = () => {
    setIsValidImage(false);  // If image fails, set to false to avoid rendering the card.
    if (onError) {
      onError();  // Trigger the parent onError logic if needed.
    }
  };

  if (!isValidImage) return null; // Do not render the card if the image is invalid.

  return (
    <div className="pokemon-card" style={{ cursor: 'pointer', width: '250px', margin: '10px' }}>
      <a href={imageUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={imageUrl}
          alt={altText}
          style={{ width: '100%', height: 'auto' }}
          onError={handleError}  // Handle 404 error here
        />
      </a>
      <h3>{name}</h3>
    </div>
  );
}

export default PokemonCard;
