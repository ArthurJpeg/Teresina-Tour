import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Event } from './useEvents';

interface SupabaseEvent {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  location_name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
  start_at: string;
  end_at: string | null;
  ticket_url: string | null;
  free: boolean;
}

export function useEventDetails(id?: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        setError('Evento inválido.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('events')
          .select(`
            id,
            name,
            description,
            image_url,
            location_name,
            address,
            latitude,
            longitude,
            google_place_id,
            start_at,
            end_at,
            ticket_url,
            free
          `)
          .eq('id', id)
          .eq('published', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        const result = data as SupabaseEvent;

        setEvent({
          id: String(result.id),
          name: result.name,
          description: result.description ?? '',
          image: result.image_url ?? '',
          locationName: result.location_name ?? '',
          address: result.address ?? '',
          latitude: result.latitude ?? undefined,
          longitude: result.longitude ?? undefined,
          googlePlaceId: result.google_place_id ?? undefined,
          startAt: result.start_at,
          endAt: result.end_at ?? undefined,
          ticketUrl: result.ticket_url ?? undefined,
          free: result.free,
        });
      } catch (err) {
        console.error(
          'Erro ao carregar detalhes do evento:',
          err
        );

        setEvent(null);

        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar o evento.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  return {
    event,
    loading,
    error,
  };
}