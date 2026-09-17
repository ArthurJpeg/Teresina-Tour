import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (pointId: string) => void;
  isFavorite: (pointId: string) => boolean;
}

const FavoritesContext =
  createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

const FAVORITES_STORAGE_KEY = '@teresina_tour:favorites';

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Carrega os favoritos salvos quando o aplicativo inicia
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(
          FAVORITES_STORAGE_KEY
        );

        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    };

    loadFavorites();
  }, []);

  // Adiciona ou remove um favorito e salva no aparelho
  const toggleFavorite = useCallback((pointId: string) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.includes(pointId)
        ? prev.filter((id) => id !== pointId)
        : [...prev, pointId];

      AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(updatedFavorites)
      ).catch((error) => {
        console.error('Erro ao salvar favoritos:', error);
      });

      return updatedFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (pointId: string) => {
      return favorites.includes(pointId);
    },
    [favorites]
  );

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error(
      'useFavorites must be used within a FavoritesProvider'
    );
  }

  return context;
};