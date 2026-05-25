import type {
  Anime,
  AnimeCharacter,
  AnimeFilters,
  AnimeGenre,
  AnimePage,
} from "../types/anime";
import type {
  ShikimoriAnimeDetails,
  ShikimoriAnimeListItem,
  ShikimoriGenre,
  ShikimoriRole,
} from "../types/shikimori";
import { cleanDescription } from "../utils/formatters";

const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const SITE_URL = "https://shikimori.one";

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${API_URL}${path}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function requestShikimori<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Не удалось получить данные от Shikimori API.");
  }

  return response.json();
}

function resolveImage(path?: string | null) {
  if (!path) {
    return "https://placehold.co/420x600/141421/f7f7fb?text=AnimeHub";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${SITE_URL}${path}`;
}

function resolveUrl(path?: string | null) {
  if (!path) {
    return SITE_URL;
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${SITE_URL}${path}`;
}

function parseScore(score: string | number | null | undefined) {
  const value = Number(score);

  return Number.isFinite(value) && value > 0 ? value : null;
}

function mapAnime(item: ShikimoriAnimeListItem | ShikimoriAnimeDetails): Anime {
  const details = item as ShikimoriAnimeDetails;

  return {
    id: item.id,
    title: item.russian || item.name || "Без названия",
    originalTitle: item.name || item.russian || "Без названия",
    description: cleanDescription(details.description),
    image: resolveImage(item.image?.original || item.image?.preview),
    url: resolveUrl(item.url),
    kind: item.kind,
    score: parseScore(item.score),
    status: item.status,
    episodes: item.episodes,
    episodesAired: item.episodes_aired,
    airedOn: item.aired_on,
    releasedOn: item.released_on,
    genres: details.genres ?? [],
    studios: details.studios ?? [],
  };
}

function mapRole(role: ShikimoriRole): AnimeCharacter | null {
  if (!role.character) {
    return null;
  }

  return {
    id: role.character.id,
    name: role.character.name,
    russian: role.character.russian,
    image: resolveImage(role.character.image?.preview || role.character.image?.original),
    roles: role.roles_russian.length ? role.roles_russian : role.roles,
  };
}

export async function getAnimeList(filters: AnimeFilters = {}): Promise<AnimePage> {
  const perPage = filters.perPage ?? 12;
  const page = filters.page ?? 1;

  const items = await requestShikimori<ShikimoriAnimeListItem[]>("/animes", {
    limit: perPage,
    page,
    search: filters.search?.trim() || undefined,
    genre: filters.genre || undefined,
    season: filters.year || undefined,
    status: filters.status || undefined,
    order: filters.sort || "popularity",
    censored: "true",
  });

  return {
    pageInfo: {
      currentPage: page,
      hasNextPage: items.length === perPage,
      perPage,
    },
    media: items.map(mapAnime),
  };
}

export async function getPopularAnime() {
  const page = await getAnimeList({
    sort: "popularity",
    page: 1,
    perPage: 8,
  });

  return page.media;
}

export async function getSeasonAnime() {
  const currentYear = new Date().getFullYear();

  const page = await getAnimeList({
    year: currentYear,
    sort: "ranked",
    page: 1,
    perPage: 8,
  });

  return page.media;
}

export async function getAnimeGenres(): Promise<AnimeGenre[]> {
  const genres = await requestShikimori<ShikimoriGenre[]>("/genres");

  return genres
    .filter((genre) => genre.kind === "anime")
    .sort((first, second) => first.russian.localeCompare(second.russian, "ru"));
}

export async function getAnimeById(id: number): Promise<Anime> {
  const [details, roles] = await Promise.all([
    requestShikimori<ShikimoriAnimeDetails>(`/animes/${id}`),
    requestShikimori<ShikimoriRole[]>(`/animes/${id}/roles`).catch(() => []),
  ]);

  return {
    ...mapAnime(details),
    characters: roles
      .map(mapRole)
      .filter((character): character is AnimeCharacter => Boolean(character))
      .slice(0, 12),
  };
}
