import React from 'react';
import { Link } from 'react-router-dom';
import './TopAnime.css';

function TopAnime({ anime }) {
  if (!anime) return null;

  const imageUrl = anime.image
    ? `https://shikimori.one${anime.image.original}`
    : '';

  return (
    <div className="top-anime">
      <div className="top-anime-badge">
        <span className="badge-icon">🔥</span>
        <span className="badge-text">Топ тайтл недели</span>
      </div>
      <Link to={`/anime/${anime.id}`} className="top-anime-card">
        <div className="top-anime-image">
          <img src={imageUrl} alt={anime.russian || anime.name} />
          <div className="top-anime-overlay"></div>
        </div>
        <div className="top-anime-info">
          <div className="top-anime-rank">#1</div>
          <h1 className="top-anime-title">{anime.russian || anime.name}</h1>
          <p className="top-anime-name">{anime.name}</p>
          <div className="top-anime-details">
            <span className="detail-tag score-tag">
              ★ {anime.score}
            </span>
            <span className="detail-tag">
              {anime.episodes || anime.episodes_aired} эп.
            </span>
            <span className="detail-tag status-tag">
              {anime.status === 'ongoing' ? 'Онгоинг' : anime.status}
            </span>
          </div>
          <div className="top-anime-cta">
            <span>Подробнее →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default TopAnime;
