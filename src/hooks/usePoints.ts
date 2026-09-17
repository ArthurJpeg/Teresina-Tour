import { useState, useCallback, useMemo, useEffect } from 'react';

import { supabase } from '../lib/supabase';
import { PointOfInterest, Category } from '../types';

interface SupabasePoint {
  id: number;
  name: string;
  category_id: string;
  description: string;
  image_url: string | null;
  address: string | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
}

export const usePoints = () => {
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'Todos' },
  ]);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [pointsResponse, categoriesResponse] = await Promise.all([
          supabase
            .from('points_of_interest')
            .select(`
              id,
              name,
              category_id,
              description,
              image_url,
              address,
              hours,
              latitude,
              longitude,
              google_place_id
            `)
            .eq('published', true)
            .order('name'),

          supabase
            .from('categories')
            .select('id, name')
            .order('name'),
        ]);

        if (pointsResponse.error) {
          throw pointsResponse.error;
        }

        if (categoriesResponse.error) {
          throw categoriesResponse.error;
        }

        const formattedPoints: PointOfInterest[] = (
          (pointsResponse.data ?? []) as SupabasePoint[]
        ).map((point) => ({
          id: String(point.id),
          name: point.name,
          category: point.category_id,
          description: point.description,
          image: point.image_url ?? '',
          address: point.address ?? '',
          hours: point.hours ?? '',
          latitude: point.latitude ?? 0,
          longitude: point.longitude ?? 0,
          googlePlaceId: point.google_place_id ?? undefined,
        }));

        setPointsOfInterest(formattedPoints);

        setCategories([
          { id: 'all', name: 'Todos' },
          ...(categoriesResponse.data ?? []),
        ]);
      } catch (err) {
        console.error('Erro ao carregar dados do Supabase:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar os pontos turísticos.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPoints = useMemo(() => {
    return pointsOfInterest.filter((point) => {
      const search = searchText.toLowerCase();

      const matchesSearch =
        point.name.toLowerCase().includes(search) ||
        point.description.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === 'all' ||
        point.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [pointsOfInterest, searchText, selectedCategory]);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  return {
    points: filteredPoints,
    categories,
    searchText,
    selectedCategory,
    loading,
    error,
    handleSearch,
    handleCategoryChange,
  };
};