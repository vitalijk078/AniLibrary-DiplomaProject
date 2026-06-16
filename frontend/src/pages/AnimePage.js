import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import AnimeCard from '../components/AnimeCard';
import CharacterCard from '../components/CharacterCard';
import './AnimePage.css';

function AnimePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anime, setAnime] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [related, setRelated] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/animes/${id}`);
      setAnime(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchScreenshots = useCallback(async () => {
    try {
      const response = await api.get(`/animes/${id}/screenshots`);
      setScreenshots(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const fetchCharacters = useCallback(async () => {
    try {
      const response = await api.get(`/animes/${id}/roles`);
      const onlyCharacters = response.data
        .filter((role) => role.character)
        .sort((a, b) => {
          const aMain = a.roles.includes('Main') ? 0 : 1;
          const bMain = b.roles.includes('Main') ? 0 : 1;
          return aMain - bMain;
        });
      setCharacters(onlyCharacters);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const fetchRelated = useCallback(async () => {
    try {
      const response = await api.get(`/animes/${id}/related`);
      const onlyAnime = response.data.filter((item) => item.anime);
      setRelated(onlyAnime);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const fetchSimilar = useCallback(async () => {
    try {
      const response = await api.get(`/animes/${id}/similar`);
      setSimilar(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const checkVideo = useCallback(async () => {
    try {
      const response = await api.get(`/videos/${id}/available`);
      setVideoAvailable(response.data.available);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const checkFavorite = useCallback(async () => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    try {
      const response = await api.get(`/users/favorites/${id}`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error(error);
    }
  }, [id, user]);

  useEffect(() => {
    fetchAnime();
    fetchScreenshots();
    fetchCharacters();
    fetchRelated();
    fetchSimilar();
    checkVideo();
    window.scrollTo(0, 0);
  }, [fetchAnime, fetchScreenshots, fetchCharacters, fetchRelated, fetchSimilar, checkVideo]);

  useEffect(() => {
    checkFavorite();
  }, [checkFavorite]);

  const handleWatch = () => {
    if (!user) {
      navigate('/login', { state: { from: `/watch/${id}` } });
      return;
    }
    navigate(`/watch/${id}`);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/anime/${id}` } });
      return;
    }
    try {
      if (isFavorite) {
        await api.delete(`/users/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post('/users/favorites', {
          anime_id: anime.id,
          anime_name: anime.russian || anime.name,
          anime_image: anime.image ? anime.image.preview : '',
          anime_score: anime.score,
          anime_kind: anime.kind
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Загрузка...</span>
      </div>
    );
  }

  if (!anime) {
    return <div className="loading"><span>Аниме не найдено</span></div>;
  }

  const imageUrl = anime.image
    ? `https://shikimori.one${anime.image.original}`
    : '';

  const trailers = (anime.videos || []).filter(
    (v) => v.kind === 'pv' || v.kind === 'op' || v.kind === 'ed' || v.kind === 'cm'
  );

  const getStatusText = (status) => {
    switch (status) {
      case 'released': return 'Вышел';
      case 'ongoing': return 'Онгоинг';
      case 'anons': return 'Анонс';
      default: return status;
    }
  };

  const getKindText = (kind) => {
    switch (kind) {
      case 'tv': return 'TV Сериал';
      case 'movie': return 'Фильм';
      case 'ova': return 'OVA';
      case 'ona': return 'ONA';
      case 'special': return 'Спешл';
      case 'tv_special': return 'TV Спешл';
      case 'music': return 'Музыка';
      default: return kind;
    }
  };

  return (
    <div className="anime-page">
      <Link to="/" className="back-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Назад к каталогу
      </Link>

      <div className="anime-hero">
        <div className="anime-hero-bg">
          <img src={imageUrl} alt="" />
        </div>
        <div className="anime-detail">
          <div className="anime-detail-image">
            <img src={imageUrl} alt={anime.russian || anime.name} />
            <div className="image-score">
              <span>★ {anime.score}</span>
            </div>
          </div>
          <div className="anime-detail-info">
            <div className="anime-detail-status">
              <span className={`status-badge ${anime.status}`}>
                {getStatusText(anime.status)}
              </span>
              <span className="kind-badge">{getKindText(anime.kind)}</span>
            </div>
            <h1 className="anime-detail-title">{anime.russian || anime.name}</h1>
            <div className="anime-detail-names">
              <p><span>Английское:</span> {anime.name}</p>
              {anime.japanese && anime.japanese[0] && (
                <p><span>Японское:</span> {anime.japanese[0]}</p>
              )}
            </div>
            <div className="anime-actions">
              {videoAvailable && (
                <button className="watch-button" onClick={handleWatch}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Смотреть онлайн
                </button>
              )}
              <button
                className={`favorite-button ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? '★ В избранном' : '☆ В избранное'}
              </button>
            </div>
            {videoAvailable && !user && (
              <p className="anime-auth-hint">Для просмотра аниме необходимо войти в аккаунт</p>
            )}
            <div className="anime-detail-stats">
              <div className="stat-item">
                <span className="stat-label">Оценка</span>
                <span className="stat-value">{anime.score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Тип</span>
                <span className="stat-value">{getKindText(anime.kind)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Эпизоды</span>
                <span className="stat-value">{anime.episodes || anime.episodes_aired}</span>
              </div>
              {anime.duration > 0 && (
                <div className="stat-item">
                  <span className="stat-label">Длительность</span>
                  <span className="stat-value">{anime.duration} мин</span>
                </div>
              )}
              <div className="stat-item">
                <span className="stat-label">Статус</span>
                <span className="stat-value">{getStatusText(anime.status)}</span>
              </div>
              {anime.aired_on && (
                <div className="stat-item">
                  <span className="stat-label">Дата выхода</span>
                  <span className="stat-value">{anime.aired_on}</span>
                </div>
              )}
              {anime.rating && (
                <div className="stat-item">
                  <span className="stat-label">Рейтинг</span>
                  <span className="stat-value">{anime.rating}</span>
                </div>
              )}
            </div>
            {anime.genres && anime.genres.length > 0 && (
              <div className="anime-detail-genres">
                <h3>Жанры</h3>
                <div className="genres-list">
                  {anime.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.russian || genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {anime.studios && anime.studios.length > 0 && (
              <div className="anime-detail-studios">
                <h3>Студия</h3>
                <p>{anime.studios.map(s => s.name).join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {anime.description && (
        <div className="anime-detail-description">
          <div className="description-header">
            <div className="description-icon">📝</div>
            <h3>Описание</h3>
          </div>
          <p>{anime.description.replace(/\[.*?\]/g, '')}</p>
        </div>
      )}

      {characters.length > 0 && (
        <div className="anime-section">
          <div className="anime-section-header">
            <div className="anime-section-icon">👥</div>
            <h3>Персонажи</h3>
            <span className="anime-section-count">{characters.length}</span>
          </div>
          <div className="characters-grid">
            {characters.slice(0, 12).map((role) => (
              <CharacterCard
                key={role.character.id}
                character={role.character}
                role={role.roles && role.roles[0]}
              />
            ))}
          </div>
        </div>
      )}

      {trailers.length > 0 && (
        <div className="anime-section">
          <div className="anime-section-header">
            <div className="anime-section-icon">🎬</div>
            <h3>Видео и трейлеры</h3>
            <span className="anime-section-count">{trailers.length}</span>
          </div>
          <div className="videos-grid">
            {trailers.slice(0, 6).map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="video-item"
              >
                <div className="video-thumb">
                  <img src={video.image_url} alt={video.name} />
                  <div className="video-play">▶</div>
                </div>
                <span className="video-name">{video.name || video.kind}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {screenshots.length > 0 && (
        <div className="anime-section">
          <div className="anime-section-header">
            <div className="anime-section-icon">🖼️</div>
            <h3>Скриншоты</h3>
            <span className="anime-section-count">{screenshots.length}</span>
          </div>
          <div className="screenshots-grid">
            {screenshots.slice(0, 8).map((screenshot, index) => (
              <div key={index} className="screenshot-item">
                <img
                  src={`https://shikimori.one${screenshot.preview}`}
                  alt={`Скриншот ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="anime-section">
          <div className="anime-section-header">
            <div className="anime-section-icon">🔗</div>
            <h3>Связанное</h3>
            <span className="anime-section-count">{related.length}</span>
          </div>
          <div className="anime-row">
            {related.slice(0, 10).map((item) => (
              <div key={item.anime.id} className="anime-row-item">
                <span className="relation-label">{item.relation_russian || item.relation}</span>
                <AnimeCard anime={item.anime} />
              </div>
            ))}
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <div className="anime-section">
          <div className="anime-section-header">
            <div className="anime-section-icon">✨</div>
            <h3>Похожие аниме</h3>
            <span className="anime-section-count">{similar.length}</span>
          </div>
          <div className="anime-row">
            {similar.slice(0, 10).map((item) => (
              <div key={item.id} className="anime-row-item">
                <AnimeCard anime={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimePage;
