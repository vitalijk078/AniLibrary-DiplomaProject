import React from 'react';
import { Link } from 'react-router-dom';
import './AnimeCard.css';

function AnimeCard({ anime }) {
  const imageUrl = anime.image
    ? `https://shikimori.one${anime.image.preview}`
    : '';

  return (
    <Link to={`/anime/${anime.id}`} className="anime-card">
      <div className="anime-card-image">
        <img src={imageUrl} alt={anime.russian || anime.name} />
        <div className="anime-card-overlay">
          <span className="overlay-text">Подробнее</span>
        </div>
      </div>
      <div className="anime-card-info">
        <h3 className="anime-card-title">{anime.russian || anime.name}</h3>
        <div className="anime-card-meta">
          <span className="anime-card-score">★ {anime.score}</span>
          <span className="anime-card-type">{anime.kind}</span>
        </div>
      </div>
    </Link>
  );
}

export default AnimeCard;
