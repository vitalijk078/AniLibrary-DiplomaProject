import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">鬼</span>
              AniLibrary
            </Link>
            <p className="footer-description">
              Каталог аниме с актуальной информацией о тайтлах, рейтингах и жанрах.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Навигация</h4>
              <Link to="/">Главная</Link>
              <Link to="/search?q=ongoing">Онгоинги</Link>
              <Link to="/search?q=фильм">Фильмы</Link>
            </div>
            <div className="footer-column">
              <h4>Жанры</h4>
              <Link to="/search?q=экшен">Экшен</Link>
              <Link to="/search?q=романтика">Романтика</Link>
              <Link to="/search?q=комедия">Комедия</Link>
            </div>
            <div className="footer-column">
              <h4>Информация</h4>
              <span>Данные: Shikimori API</span>
              <span>Стек: React + Node.js</span>
              <span>Версия: 1.0</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-line"></div>
          <p>© 2026 AniLibrary. Все данные предоставлены Shikimori.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
