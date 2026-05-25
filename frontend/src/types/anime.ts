export type AnimeStatus = "anons" | "ongoing" | "released";
export type AnimeSort = "popularity" | "ranked" | "aired_on" | "name";

export interface AnimeGenre {
  id: number;
  name: string;
  russian: string;
  kind: string;
}

export interface AnimeStudio {
  id: number;
  name: string;
  filtered_name?: string;
  real?: boolean;
  image?: string | null;
}

export interface AnimeCharacter {
  id: number;
  name: string;
  russian: string | null;
  image: string | null;
  roles: string[];
}

export interface Anime {
  id: number;
  title: string;
  originalTitle: string;
  description: string;
  image: string;
  url: string;
  kind: string | null;
  score: number | null;
  status: AnimeStatus | string | null;
  episodes: number | null;
  episodesAired: number | null;
  airedOn: string | null;
  releasedOn: string | null;
  genres: AnimeGenre[];
  studios: AnimeStudio[];
  characters?: AnimeCharacter[];
}

export interface AnimePageInfo {
  currentPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface AnimePage {
  pageInfo: AnimePageInfo;
  media: Anime[];
}

export interface AnimeFilters {
  search?: string;
  genre?: string;
  year?: number;
  status?: AnimeStatus | "";
  sort?: AnimeSort;
  page?: number;
  perPage?: number;
}
