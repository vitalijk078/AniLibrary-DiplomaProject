import React from 'react';
import './CharacterCard.css';

function CharacterCard({ character, role }) {
  const imageUrl = character.image
    ? `https://shikimori.one${character.image.preview}`
    : '';

  const roleText = role === 'Main' ? 'Главный'
    : role === 'Supporting' ? 'Второстепенный'
    : role;

  return (
    <a
      href={`https://shikimori.one${character.url}`}
      target="_blank"
      rel="noreferrer"
      className="character-card"
    >
      <div className="character-card-image">
        <img src={imageUrl} alt={character.russian || character.name} />
      </div>
      <div className="character-card-info">
        <h4 className="character-card-name">{character.russian || character.name}</h4>
        {roleText && <span className="character-card-role">{roleText}</span>}
      </div>
    </a>
  );
}

export default CharacterCard;
