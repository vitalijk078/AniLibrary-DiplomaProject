import { FormEvent } from "react";
import type { AnimeGenre, AnimeSort, AnimeStatus } from "../types/anime";

export interface CatalogFiltersState {
  search: string;
  genre: string;
  year: string;
  status: AnimeStatus | "";
  sort: AnimeSort;
}

interface FilterPanelProps {
  filters: CatalogFiltersState;
  genres: AnimeGenre[];
  isGenresLoading: boolean;
  onChange: (filters: CatalogFiltersState) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function FilterPanel({
  filters,
  genres,
  isGenresLoading,
  onChange,
  onSubmit,
  onReset,
}: FilterPanelProps) {
  function updateFilter<Key extends keyof CatalogFiltersState>(
    key: Key,
    value: CatalogFiltersState[Key],
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="filter-panel" onSubmit={handleSubmit}>
      <label>
        <span>Название</span>
        <input
          type="text"
          placeholder="Например, Атака титанов"
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
        />
      </label>

      <label>
        <span>Жанр</span>
        <select
          value={filters.genre}
          onChange={(event) => updateFilter("genre", event.target.value)}
          disabled={isGenresLoading}
        >
          <option value="">Все жанры</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.russian || genre.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Год</span>
        <input
          type="number"
          min="1960"
          max={new Date().getFullYear() + 2}
          placeholder="2024"
          value={filters.year}
          onChange={(event) => updateFilter("year", event.target.value)}
        />
      </label>

      <label>
        <span>Статус</span>
        <select
          value={filters.status}
          onChange={(event) => updateFilter("status", event.target.value as AnimeStatus | "")}
        >
          <option value="">Любой</option>
          <option value="ongoing">Выходит</option>
          <option value="released">Вышло</option>
          <option value="anons">Анонсировано</option>
        </select>
      </label>

      <label>
        <span>Сортировка</span>
        <select
          value={filters.sort}
          onChange={(event) => updateFilter("sort", event.target.value as AnimeSort)}
        >
          <option value="popularity">По популярности</option>
          <option value="ranked">По рейтингу</option>
          <option value="aired_on">По дате выхода</option>
          <option value="name">По названию</option>
        </select>
      </label>

      <div className="filter-panel__actions">
        <button type="submit">Применить</button>
        <button type="button" className="button-secondary" onClick={onReset}>
          Сбросить
        </button>
      </div>
    </form>
  );
}
