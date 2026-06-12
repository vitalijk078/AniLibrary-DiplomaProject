import React, { useState, useEffect } from 'react';
import api from '../api';
import AnimeCard from '../components/AnimeCard';
import './WatchListPage.css';

function WatchListPage() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get('/videos');
        setAnimes(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Загрузка...</span>
      </div>
    );
  }

  return (
    <div className="watch-list-page">
      <div className="section-header">
        <h2 className="section-title">Смотреть онлайн</h2>
        <p className="section-subtitle">Тайтлы, доступные для просмотра прямо на сайте</p>
      </div>

      {animes.length === 0 ? (
        <div className="watch-list-empty">
          <div className="watch-list-empty-icon">▶</div>
          <p>Видео пока не добавлены</p>
          <span>Загляните сюда позже</span>
        </div>
      ) : (
        <div className="anime-grid">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchListPage;
