import type { Anime } from "../types/anime";
import { AnimeCard } from "./AnimeCard";

interface AnimeGridProps {
  items: Anime[];
}

export function AnimeGrid({ items }: AnimeGridProps) {
  return (
    <div className="anime-grid">
      {items.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}
