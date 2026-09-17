import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import { PointOfInterest } from '../types';

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

export const usePointDetails = (pointId: string) => {
  const [point, setPoint] = useState<PointOfInterest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPoint = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
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
          .eq('id', pointId)
          .eq('published', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        const result = data as SupabasePoint;

        const formattedPoint: PointOfInterest = {
          id: String(result.id),
          name: result.name,
          category: result.category_id,
          description: result.description,
          image: result.image_url ?? '',
          address: result.address ?? '',
          hours: result.hours ?? '',
          latitude: result.latitude ?? 0,
          longitude: result.longitude ?? 0,
          googlePlaceId: result.google_place_id ?? undefined,
        };

        setPoint(formattedPoint);
      } catch (err) {
        console.error(
          'Erro ao carregar ponto turístico:',
          err
        );

        setPoint(null);

        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar o ponto turístico.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (pointId) {
      loadPoint();
    }
  }, [pointId]);

  return {
    point,
    loading,
    error,
  };
};