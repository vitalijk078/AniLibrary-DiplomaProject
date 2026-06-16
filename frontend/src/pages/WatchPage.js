import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_URL } from '../api';
import './WatchPage.css';

function formatSize(bytes) {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) {
    return (mb / 1024).toFixed(1) + ' ГБ';
  }
  return Math.round(mb) + ' МБ';
}

function WatchPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    setVideo(null);
    try {
      const animeRes = await api.get(`/animes/${id}`);
      setAnime(animeRes.data);
    } catch (err) {
      console.error(err);
    }
    try {
      const videoRes = await api.get(`/watch/${id}`);
      setVideo(videoRes.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Видео временно недоступно. Проверьте, запущен ли сервер.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Загрузка плеера...</span>
      </div>
    );
  }

  const title = anime ? (anime.russian || anime.name) : 'Просмотр аниме';
  const token = localStorage.getItem('token');
  const streamUrl = `${API_URL}/stream/${id}?token=${token}`;

  return (
    <div className="watch-page">
      <Link to={`/anime/${id}`} className="back-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        К странице аниме
      </Link>

      <div className="watch-header">
        <h1 className="watch-title">{title}</h1>
        {video && (
          <div className="watch-meta">
            {video.format && (
              <span className="watch-badge">{video.format.toUpperCase()}</span>
            )}
            {formatSize(video.size) && (
              <span className="watch-badge">{formatSize(video.size)}</span>
            )}
          </div>
        )}
      </div>

      {error ? (
        <div className="watch-error">
          <div className="watch-error-icon">✕</div>
          <p>{error}</p>
          <Link to={`/anime/${id}`} className="watch-error-link">
            Вернуться к описанию
          </Link>
        </div>
      ) : (
        <div className="watch-player">
          <video src={streamUrl} controls />
        </div>
      )}
    </div>
  );
}

export default WatchPage;
