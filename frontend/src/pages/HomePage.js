import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import AnimeCard from '../components/AnimeCard';
import TopAnime from '../components/TopAnime';
import './HomePage.css';

function HomePage() {
  const [animes, setAnimes] = useState([]);
  const [topAnime, setTopAnime] = useState(null);
  const [ongoing, setOngoing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopAnime();
    fetchSections();
    fetchAnimes(1);
  }, []);

  const fetchTopAnime = async () => {
    try {
      const response = await api.get('/top-weekly');
      setTopAnime(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSections = async () => {
    try {
      const [ongoingRes, upcomingRes, moviesRes] = await Promise.all([
        api.get('/animes', {
          params: { status: 'ongoing', order: 'popularity', limit: 12 }
        }),
        api.get('/animes', {
          params: { status: 'anons', order: 'popularity', limit: 12 }
        }),
        api.get('/animes', {
          params: { kind: 'movie', order: 'ranked', limit: 12 }
        })
      ]);
      setOngoing(ongoingRes.data);
      setUpcoming(upcomingRes.data);
      setMovies(moviesRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAnimes = async (pageNum) => {
    setLoading(true);
    try {
      const response = await api.get('/animes', {
        params: { page: pageNum, limit: 20, order: 'ranked' }
      });
      setAnimes(response.data);
      setPage(pageNum);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchAnimes(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    fetchAnimes(page + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Загрузка...</span>
      </div>
    );
  }

  const renderRow = (title, subtitle, list, linkTo) => {
    if (!list || list.length === 0) return null;
    return (
      <div className="home-row-block">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
          {linkTo && (
            <Link to={linkTo} className="section-link">Смотреть все →</Link>
          )}
        </div>
        <div className="home-row">
          {list.map((anime) => (
            <div key={anime.id} className="home-row-item">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="home-page">
      <TopAnime anime={topAnime} />

      <div className="stats-bar">
        <div className="stat-block">
          <span className="stat-block-number">50 000+</span>
          <span className="stat-block-label">Тайтлов</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-block">
          <span className="stat-block-number">200+</span>
          <span className="stat-block-label">Жанров</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-block">
          <span className="stat-block-number">2026</span>
          <span className="stat-block-label">Актуально</span>
        </div>
      </div>

      {renderRow('Популярные онгоинги', 'Тайтлы, которые выходят прямо сейчас', ongoing, '/search?status=ongoing')}
      {renderRow('Скоро выйдет', 'Анонсы будущих тайтлов', upcoming, '/search?status=anons')}
      {renderRow('Лучшие фильмы', 'Полнометражные аниме по рейтингу', movies, '/search?kind=movie')}

      <div className="section-header">
        <h2 className="section-title">Каталог аниме</h2>
        <p className="section-subtitle">Лучшие тайтлы по рейтингу</p>
      </div>

      <div className="anime-grid">
        {animes.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          ← Назад
        </button>
        <div className="pagination-info">
          <span className="pagination-page">{page}</span>
        </div>
        <button
          className="pagination-button"
          onClick={handleNextPage}
        >
          Далее →
        </button>
      </div>
    </div>
  );
}

export default HomePage;
