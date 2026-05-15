import { Link } from "react-router-dom";
import type { Anime } from "../types/anime";
import { formatScore } from "../utils/formatters";

interface AnimeStripProps {
  title: string;
  description?: string;
  items: Anime[];
}

export function AnimeStrip({ title, description, items }: AnimeStripProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="anime-strip-section">
      <div className="section__header anime-strip-section__header">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>

        <Link to="/catalog" className="anime-strip-section__link">
          Смотреть каталог →
        </Link>
      </div>

      <div className="anime-strip" aria-label={title}>
        {items.map((anime) => (
          <Link to={`/anime/${anime.id}`} className="anime-strip-card" key={anime.id}>
            <img src={anime.image} alt={anime.title} className="anime-strip-card__image" />

            <div className="anime-strip-card__overlay">
              <h3>{anime.title}</h3>
              <p>
                {anime.airedOn?.slice(0, 4) || "Год не указан"} · {formatScore(anime.score)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
