export interface ShikimoriImage {
  original?: string;
  preview?: string;
  x96?: string;
  x48?: string;
}

export interface ShikimoriGenre {
  id: number;
  name: string;
  russian: string;
  kind: string;
}

export interface ShikimoriStudio {
  id: number;
  name: string;
  filtered_name?: string;
  real?: boolean;
  image?: string | null;
}

export interface ShikimoriAnimeListItem {
  id: number;
  name: string;
  russian: string;
  image: ShikimoriImage;
  url: string;
  kind: string | null;
  score: string;
  status: string;
  episodes: number | null;
  episodes_aired: number | null;
  aired_on: string | null;
  released_on: string | null;
}

export interface ShikimoriAnimeDetails extends ShikimoriAnimeListItem {
  description: string | null;
  description_html: string | null;
  genres: ShikimoriGenre[];
  studios: ShikimoriStudio[];
}

export interface ShikimoriCharacter {
  id: number;
  name: string;
  russian: string | null;
  image: ShikimoriImage;
}

export interface ShikimoriRole {
  roles: string[];
  roles_russian: string[];
  character: ShikimoriCharacter | null;
}
