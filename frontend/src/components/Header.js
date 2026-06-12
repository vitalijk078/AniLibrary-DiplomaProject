import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">鬼</span>
            AniLibrary
          </Link>
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Главная</Link>
            <Link to="/search?status=ongoing" className="nav-link">Онгоинги</Link>
            <Link to="/search?kind=movie" className="nav-link">Фильмы</Link>
            <Link to="/watch" className="nav-link">Смотреть</Link>
          </nav>
        </div>
        <div className="header-right">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Поиск аниме..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              Найти
            </button>
          </form>
          {user ? (
            <Link to="/profile" className="user-chip">
              <span className="user-avatar">{user.username[0].toUpperCase()}</span>
              <span className="user-name">{user.username}</span>
            </Link>
          ) : (
            <Link to="/login" className="login-link">Войти</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
