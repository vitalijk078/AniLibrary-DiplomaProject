import { FormEvent, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export function Header() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (location.pathname === "/catalog") {
      const params = new URLSearchParams(location.search);
      setSearchValue(params.get("search") ?? "");
    }
  }, [location.pathname, location.search]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      navigate("/catalog");
      return;
    }

    navigate(`/catalog?search=${encodeURIComponent(query)}`);
  }

  return (
    <header className="header">
      <NavLink to="/" className="header__logo" aria-label="На главную">
        AnimeHub
      </NavLink>

      <form className="header-search" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Поиск аниме..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          aria-label="Поиск аниме"
        />
        <button type="submit">Найти</button>
      </form>

      <nav className="header__nav" aria-label="Основная навигация">
        <NavLink to="/">Главная</NavLink>
        <NavLink to="/catalog">Каталог</NavLink>
        <NavLink to="/favorites">Избранное ({favorites.length})</NavLink>
      </nav>
    </header>
  );
}
