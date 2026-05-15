import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAnimeGenres, getAnimeList } from "../api/shikimoriApi";
import { AnimeGrid } from "../components/AnimeGrid";
import { EmptyState } from "../components/EmptyState";
import { ErrorMessage } from "../components/ErrorMessage";
import { CatalogFiltersState, FilterPanel } from "../components/FilterPanel";
import { Loader } from "../components/Loader";
import type { AnimeFilters } from "../types/anime";

const defaultFilters: CatalogFiltersState = {
  search: "",
  genre: "",
  year: "",
  status: "",
  sort: "popularity",
};

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get("search") ?? "";

  const [formFilters, setFormFilters] = useState<CatalogFiltersState>({
    ...defaultFilters,
    search: searchFromUrl,
  });
  const [activeFilters, setActiveFilters] = useState<CatalogFiltersState>({
    ...defaultFilters,
    search: searchFromUrl,
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const query = searchParams.get("search") ?? "";

    setFormFilters((currentFilters) => ({
      ...currentFilters,
      search: query,
    }));

    setActiveFilters((currentFilters) => ({
      ...currentFilters,
      search: query,
    }));

    setPage(1);
  }, [searchParams]);

  const genresQuery = useQuery({
    queryKey: ["anime-genres"],
    queryFn: getAnimeGenres,
    staleTime: 1000 * 60 * 60,
  });

  const requestFilters: AnimeFilters = useMemo(
    () => ({
      search: activeFilters.search.trim() || undefined,
      genre: activeFilters.genre || undefined,
      year: activeFilters.year ? Number(activeFilters.year) : undefined,
      status: activeFilters.status || undefined,
      sort: activeFilters.sort,
      page,
      perPage: 12,
    }),
    [activeFilters, page],
  );

  const catalogQuery = useQuery({
    queryKey: ["anime-catalog", requestFilters],
    queryFn: () => getAnimeList(requestFilters),
  });

  function applyFilters() {
    setPage(1);
    setActiveFilters(formFilters);
  }

  function resetFilters() {
    setFormFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    setPage(1);
  }

  const items = catalogQuery.data?.media ?? [];
  const pageInfo = catalogQuery.data?.pageInfo;

  return (
    <main className="page">
      <section className="section section--top">
        <div className="section__header">
          <h1>Каталог аниме</h1>
          <p>
            Используйте поиск, жанры, год выхода и сортировку, чтобы быстрее
            найти подходящий тайтл.
          </p>
        </div>

        <FilterPanel
          filters={formFilters}
          genres={genresQuery.data ?? []}
          isGenresLoading={genresQuery.isLoading}
          onChange={setFormFilters}
          onSubmit={applyFilters}
          onReset={resetFilters}
        />

        {catalogQuery.isLoading && <Loader />}

        {catalogQuery.isError && (
          <ErrorMessage text="Не удалось загрузить каталог. Проверьте подключение к интернету или повторите запрос позже." />
        )}

        {catalogQuery.data && items.length === 0 && (
          <EmptyState
            title="Ничего не найдено"
            text="Попробуйте изменить поисковый запрос или сбросить фильтры."
          />
        )}

        {catalogQuery.data && items.length > 0 && (
          <>
            <AnimeGrid items={items} />

            <div className="pagination">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              >
                Назад
              </button>

              <span>Страница {pageInfo?.currentPage ?? page}</span>

              <button
                type="button"
                disabled={!pageInfo?.hasNextPage}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Вперёд
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
