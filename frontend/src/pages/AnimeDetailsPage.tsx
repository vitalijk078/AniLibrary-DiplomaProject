import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getAnimeById } from "../api/shikimoriApi";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loader } from "../components/Loader";
import { useFavorites } from "../context/FavoritesContext";
import {
  formatDate,
  formatKind,
  formatScore,
  formatStatus,
} from "../utils/formatters";

export function AnimeDetailsPage() {
  const { id } = useParams();
  const animeId = Number(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const animeQuery = useQuery({
    queryKey: ["anime-details", animeId],
    queryFn: () => getAnimeById(animeId),
    enabled: Number.isFinite(animeId),
  });

  if (!Number.isFinite(animeId)) {
    return (
      <main className="page">
        <ErrorMessage text="Некорректный идентификатор аниме." />
      </main>
    );
  }

  if (animeQuery.isLoading) {
    return (
      <main className="page">
        <Loader />
      </main>
    );
  }

  if (animeQuery.isError || !animeQuery.data) {
    return (
      <main className="page">
        <ErrorMessage text="Не удалось загрузить информацию об аниме." />
      </main>
    );
  }

  const anime = animeQuery.data;
  const favorite = isFavorite(anime.id);

  return (
    <main className="page">
      <section className="details-hero">
        <img src={anime.image} alt={anime.title} className="details-hero__poster" />

        <div className="details-hero__content">
          <Link to="/catalog" className="details-hero__back">
            ← Вернуться в каталог
          </Link>

          <p className="hero__label">{formatKind(anime.kind)}</p>
          <h1>{anime.title}</h1>

          <p className="details-hero__original">{anime.originalTitle}</p>

          <div className="details-hero__meta">
            <span>Дата выхода: {formatDate(anime.airedOn)}</span>
            <span>Серии: {anime.episodes || "не указано"}</span>
            <span>Рейтинг: {formatScore(anime.score)}</span>
            <span>Статус: {formatStatus(anime.status)}</span>
          </div>

          {anime.genres.length > 0 && (
            <div className="anime-card__genres">
              {anime.genres.map((genre) => (
                <span key={genre.id}>{genre.russian || genre.name}</span>
              ))}
            </div>
          )}

          <button
            type="button"
            className="favorite-button"
            onClick={() => (favorite ? removeFavorite(anime.id) : addFavorite(anime))}
          >
            {favorite ? "Удалить из избранного" : "Добавить в избранное"}
          </button>
        </div>
      </section>

      <section className="section details-layout">
        <article>
          <h2>Описание</h2>
          <p className="description">{anime.description}</p>

          <a
            href={anime.url}
            target="_blank"
            rel="noreferrer"
            className="external-link"
          >
            Открыть страницу источника
          </a>
        </article>

        <aside className="details-panel">
          <h2>Сведения</h2>

          <dl>
            <div>
              <dt>Формат</dt>
              <dd>{formatKind(anime.kind)}</dd>
            </div>
            <div>
              <dt>Эпизоды</dt>
              <dd>{anime.episodes || "не указано"}</dd>
            </div>
            <div>
              <dt>Вышло эпизодов</dt>
              <dd>{anime.episodesAired || "не указано"}</dd>
            </div>
            <div>
              <dt>Студия</dt>
              <dd>
                {anime.studios.length
                  ? anime.studios.map((studio) => studio.name).join(", ")
                  : "не указана"}
              </dd>
            </div>
            <div>
              <dt>Дата начала</dt>
              <dd>{formatDate(anime.airedOn)}</dd>
            </div>
            <div>
              <dt>Дата завершения</dt>
              <dd>{formatDate(anime.releasedOn)}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {anime.characters?.length ? (
        <section className="section">
          <div className="section__header">
            <h2>Персонажи</h2>
            <p>Данные о персонажах загружаются вместе с подробной информацией о тайтле.</p>
          </div>

          <div className="characters-grid">
            {anime.characters.map((character) => (
              <article key={character.id} className="character-card">
                {character.image && <img src={character.image} alt={character.russian || character.name} />}
                <div>
                  <h3>{character.russian || character.name}</h3>
                  <p>{character.roles.join(", ") || "роль не указана"}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
