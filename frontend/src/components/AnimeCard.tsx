import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import type { Anime } from "../types/anime";
import { formatKind, formatScore } from "../utils/formatters";

interface AnimeCardProps {
  anime: Anime;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(anime.id);

  return (
    <article className="anime-card">
      <Link to={`/anime/${anime.id}`} className="anime-card__image-wrapper">
        <img src={anime.image} alt={anime.title} className="anime-card__image" />
      </Link>

      <div className="anime-card__content">
        <Link to={`/anime/${anime.id}`}>
          <h3 className="anime-card__title">{anime.title}</h3>
        </Link>

        <p className="anime-card__original">{anime.originalTitle}</p>

        <div className="anime-card__meta">
          <span>{anime.airedOn?.slice(0, 4) || "Год неизвестен"}</span>
          <span>{formatScore(anime.score)}</span>
        </div>

        <p className="anime-card__format">{formatKind(anime.kind)}</p>

        {anime.genres.length > 0 && (
          <div className="anime-card__genres">
            {anime.genres.slice(0, 3).map((genre) => (
              <span key={genre.id}>{genre.russian || genre.name}</span>
            ))}
          </div>
        )}

        <button
          type="button"
          className={favorite ? "card-action card-action--active" : "card-action"}
          onClick={() => (favorite ? removeFavorite(anime.id) : addFavorite(anime))}
          aria-label={favorite ? "Удалить из избранного" : "Добавить в избранное"}
        >
          {favorite ? "В избранном" : "В избранное"}
        </button>
      </div>
    </article>
  );
}
