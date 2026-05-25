import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Anime } from "../types/anime";

interface FavoritesContextValue {
  favorites: Anime[];
  addFavorite: (anime: Anime) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

const FAVORITES_KEY = "animehub_favorites_ru";
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function safelyReadFavorites(): Anime[] {
  try {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Anime[]>([]);

  useEffect(() => {
    setFavorites(safelyReadFavorites());
  }, []);

  function saveFavorites(updatedFavorites: Anime[]) {
    setFavorites(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  }

  function addFavorite(anime: Anime) {
    setFavorites((currentFavorites) => {
      const isAlreadyAdded = currentFavorites.some((item) => item.id === anime.id);

      if (isAlreadyAdded) {
        return currentFavorites;
      }

      const updatedFavorites = [...currentFavorites, anime];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }

  function removeFavorite(id: number) {
    setFavorites((currentFavorites) => {
      const updatedFavorites = currentFavorites.filter((anime) => anime.id !== id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }

  function clearFavorites() {
    saveFavorites([]);
  }

  function isFavorite(id: number) {
    return favorites.some((anime) => anime.id === id);
  }

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      clearFavorites,
    }),
    [favorites],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites должен использоваться внутри FavoritesProvider.");
  }

  return context;
}
