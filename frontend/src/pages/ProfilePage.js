import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [favoritesRes, historyRes] = await Promise.all([
          api.get('/users/favorites'),
          api.get('/users/history')
        ]);
        setFavorites(favoritesRes.data);
        setHistory(historyRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRemoveFavorite = async (animeId) => {
    try {
      await api.delete(`/users/favorites/${animeId}`);
      setFavorites(favorites.filter((item) => item.anime_id !== animeId));
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString('ru-RU');
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
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">{user.username[0].toUpperCase()}</div>
        <div className="profile-info">
          <h1 className="profile-username">{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-date">На сайте с {formatDate(user.created_at)}</p>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-number">{favorites.length}</span>
            <span className="profile-stat-label">В избранном</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-number">{history.length}</span>
            <span className="profile-stat-label">Просмотрено</span>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Выйти
        </button>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Избранное
        </button>
        <button
          className={`profile-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          История просмотров
        </button>
      </div>

      {activeTab === 'favorites' && (
        favorites.length === 0 ? (
          <div className="profile-empty">
            <div className="profile-empty-icon">☆</div>
            <p>В избранном пока пусто</p>
            <Link to="/" className="profile-empty-link">Перейти в каталог</Link>
          </div>
        ) : (
          <div className="profile-grid">
            {favorites.map((item) => (
              <div key={item.id} className="profile-anime-card">
                <button
                  className="remove-favorite"
                  onClick={() => handleRemoveFavorite(item.anime_id)}
                  title="Удалить из избранного"
                >
                  ✕
                </button>
                <Link to={`/anime/${item.anime_id}`} className="profile-anime-link">
                  <div className="profile-anime-image">
                    <img
                      src={`https://shikimori.one${item.anime_image}`}
                      alt={item.anime_name}
                    />
                  </div>
                  <div className="profile-anime-info">
                    <h3 className="profile-anime-title">{item.anime_name}</h3>
                    <div className="profile-anime-meta">
                      <span className="profile-anime-score">★ {item.anime_score}</span>
                      <span className="profile-anime-kind">{item.anime_kind}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'history' && (
        history.length === 0 ? (
          <div className="profile-empty">
            <div className="profile-empty-icon">▶</div>
            <p>Вы ещё ничего не смотрели</p>
            <Link to="/" className="profile-empty-link">Перейти в каталог</Link>
          </div>
        ) : (
          <div className="profile-grid">
            {history.map((item) => (
              <div key={item.id} className="profile-anime-card">
                <Link to={`/anime/${item.anime_id}`} className="profile-anime-link">
                  <div className="profile-anime-image">
                    <img
                      src={`https://shikimori.one${item.anime_image}`}
                      alt={item.anime_name}
                    />
                  </div>
                  <div className="profile-anime-info">
                    <h3 className="profile-anime-title">{item.anime_name}</h3>
                    <div className="profile-anime-meta">
                      <span className="profile-anime-date">{formatDate(item.watched_at)}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default ProfilePage;
