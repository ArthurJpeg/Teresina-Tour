import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Event {
  id: string;
  name: string;
  description: string;
  image: string;
  locationName: string;
  address: string;
  latitude?: number;
  longitude?: number;
  googlePlaceId?: string;
  startAt: string;
  endAt?: string;
  ticketUrl?: string;
  free: boolean;
}

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

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
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
        .eq('published', true)
        .order('start_at', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      const formattedEvents: Event[] = (
        (data ?? []) as SupabaseEvent[]
      ).map((event) => ({
        id: String(event.id),
        name: event.name,
        description: event.description ?? '',
        image: event.image_url ?? '',
        locationName: event.location_name ?? '',
        address: event.address ?? '',
        latitude: event.latitude ?? undefined,
        longitude: event.longitude ?? undefined,
        googlePlaceId: event.google_place_id ?? undefined,
        startAt: event.start_at,
        endAt: event.end_at ?? undefined,
        ticketUrl: event.ticket_url ?? undefined,
        free: event.free,
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar os eventos.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  /*
   * Se houver horário de encerramento, o evento permanece
   * disponível até esse momento.
   *
   * Se não houver, permanece disponível até o final
   * do dia em que acontece.
   */
  const upcomingEvents = useMemo(() => {
    const now = new Date();

    return events.filter((event) => {
      if (event.endAt) {
        return new Date(event.endAt) >= now;
      }

      const eventDayEnd = new Date(event.startAt);

      eventDayEnd.setHours(23, 59, 59, 999);

      return eventDayEnd >= now;
    });
  }, [events]);

  const filteredEvents = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return upcomingEvents;
    }

    return upcomingEvents.filter((event) => {
      return (
        event.name.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search) ||
        event.locationName.toLowerCase().includes(search) ||
        event.address.toLowerCase().includes(search)
      );
    });
  }, [upcomingEvents, searchText]);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  return {
    events: filteredEvents,
    searchText,
    loading,
    error,
    handleSearch,
    clearSearch,
    reload: loadEvents,
  };
}