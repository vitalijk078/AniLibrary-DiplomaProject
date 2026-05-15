import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            AnimeHub
          </Link>
          <p>
            Каталог аниме с подборками, поиском, жанрами и личным списком
            избранных тайтлов.
          </p>
        </div>

        <div className="footer__column">
          <h2>Навигация</h2>
          <Link to="/">Главная</Link>
          <Link to="/catalog">Каталог</Link>
          <Link to="/favorites">Избранное</Link>
        </div>

        <div className="footer__column">
          <h2>Подборки</h2>
          <Link to="/catalog?search=ongoing">Онгоинги</Link>
          <Link to="/catalog?search=movie">Фильмы</Link>
          <Link to="/catalog?search=romance">Романтика</Link>
          <Link to="/catalog?search=action">Экшен</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {currentYear} AnimeHub</span>
        <span>Аниме-каталог для поиска новых тайтлов</span>
      </div>
    </footer>
  );
}
