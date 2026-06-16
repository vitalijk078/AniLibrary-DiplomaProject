import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';
import AnimeCard from '../components/AnimeCard';
import './SearchPage.css';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const kind = searchParams.get('kind') || '';
  const [animes, setAnimes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSearch = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const params = { limit: 30, page: pageNum, order: 'ranked' };
      if (query) {
        params.search = query;
      }
      if (status) {
        params.status = status;
        params.order = 'popularity';
      }
      if (kind) {
        params.kind = kind;
      }
      const response = await api.get('/animes', { params });
      setAnimes(response.data);
      setPage(pageNum);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [query, status, kind]);

  useEffect(() => {
    fetchSearch(1);
    window.scrollTo(0, 0);
  }, [fetchSearch]);

  const handlePrevPage = () => {
    if (page > 1) {
      fetchSearch(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    fetchSearch(page + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTitle = () => {
    if (status === 'ongoing') return 'Онгоинги';
    if (status === 'anons') return 'Анонсы';
    if (status === 'released') return 'Вышедшие';
    if (kind === 'movie') return 'Фильмы';
    if (kind === 'tv') return 'Сериалы';
    return 'Результаты поиска';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Загрузка...</span>
      </div>
    );
  }

  return (
    <div className="search-page">
      <Link to="/" className="back-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        На главную
      </Link>
      <div className="search-header">
        <h2 className="search-title">
          {getTitle()}
        </h2>
        <div className="search-query-badge">
          {query && <span className="search-query-text">{query}</span>}
          <span className="search-results-count">{animes.length} найдено</span>
        </div>
      </div>
      {animes.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p>Ничего не найдено</p>
          <span>Попробуйте изменить запрос</span>
        </div>
      ) : (
        <>
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
              disabled={animes.length < 30}
            >
              Далее →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage;
