import { AnimeGrid } from "../components/AnimeGrid";
import { EmptyState } from "../components/EmptyState";
import { useFavorites } from "../context/FavoritesContext";

export function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <main className="page">
      <section className="section section--top">
        <div className="section__header section__header--row">
          <div>
            <h1>Избранное</h1>
            <p>
              Список сохраняется в браузере и остается доступным после
              перезагрузки страницы.
            </p>
          </div>

          {favorites.length > 0 && (
            <button type="button" className="button-secondary" onClick={clearFavorites}>
              Очистить список
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            title="Избранное пустое"
            text="Откройте каталог и добавьте интересующие тайтлы в пользовательский список."
          />
        ) : (
          <AnimeGrid items={favorites} />
        )}
      </section>
    </main>
  );
}
