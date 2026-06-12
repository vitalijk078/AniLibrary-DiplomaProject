import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state && location.state.from ? location.state.from : '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await doLogin(login.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Не удалось войти. Проверьте подключение к серверу.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">鬼</span>
          <span className="auth-logo-text">AniLibrary</span>
        </div>
        <h1 className="auth-title">Вход в аккаунт</h1>
        <p className="auth-subtitle">Войдите, чтобы смотреть аниме и сохранять избранное</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email или имя пользователя</label>
            <input
              type="text"
              className="auth-input"
              placeholder="user@mail.ru"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Пароль</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="auth-switch">
          Нет аккаунта? <Link to="/register" state={{ from }}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
