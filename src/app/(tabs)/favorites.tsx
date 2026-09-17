import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import PointCard from '../../components/PointCard';
import { PointOfInterest } from '../../types';
import { useFavorites } from '../../contexts/FavoritesContext';
import { supabase } from '../../lib/supabase';

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

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

  const [points, setPoints] = useState<PointOfInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Controla apenas o loading da primeira carga.
  // Alterações posteriores nos favoritos não fazem a tela piscar.
  const hasLoaded = useRef(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (!hasLoaded.current) {
          setLoading(true);
        }

        setError(null);

        if (favorites.length === 0) {
          setPoints([]);
          return;
        }

        const favoriteIds = favorites
          .map(Number)
          .filter(Number.isFinite);

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
          .in('id', favoriteIds)
          .eq('published', true)
          .order('name');

        if (supabaseError) {
          throw supabaseError;
        }

        const formattedPoints: PointOfInterest[] = (
          (data ?? []) as SupabasePoint[]
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

        setPoints(formattedPoints);
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar seus favoritos.'
        );
      } finally {
        setLoading(false);
        hasLoaded.current = true;
      }
    };

    loadFavorites();
  }, [favorites]);

  const handlePointPress = useCallback(
    (point: PointOfInterest) => {
      router.push({
        pathname: '/details/[id]',
        params: { id: point.id },
      });
    },
    []
  );

  /*
   * Quando o usuário remove um favorito, o ID desaparece
   * imediatamente do contexto.
   *
   * Assim, o card some da tela sem precisar esperar uma nova
   * consulta ao Supabase.
   */
  const visiblePoints = points.filter((point) =>
    favorites.includes(point.id)
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            SUA COLEÇÃO
          </Text>

          <Text style={styles.title}>
            Favoritos
          </Text>

          <Text style={styles.subtitle}>
            {favorites.length === 0
              ? 'Seus lugares preferidos aparecerão aqui'
              : favorites.length === 1
                ? '1 lugar salvo para conhecer'
                : `${favorites.length} lugares salvos para conhecer`}
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator
              size="large"
              color="#E5B800"
            />

            <Text style={styles.stateTitle}>
              Carregando favoritos
            </Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <View style={styles.stateIcon}>
              <Ionicons
                name="cloud-offline-outline"
                size={34}
                color="#555555"
              />
            </View>

            <Text style={styles.stateTitle}>
              Não foi possível carregar
            </Text>

            <Text style={styles.stateDescription}>
              Verifique sua conexão e tente novamente.
            </Text>
          </View>
        ) : (
          <FlatList
            data={visiblePoints}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PointCard
                point={item}
                onPress={handlePointPress}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              visiblePoints.length === 0 &&
                styles.emptyListContent,
            ]}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.favoriteIcon}>
                  <Ionicons
                    name="star-outline"
                    size={40}
                    color="#222222"
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  Nenhum favorito ainda
                </Text>

                <Text style={styles.emptyDescription}>
                  Toque na estrela de um lugar que você
                  gostou e ele ficará guardado aqui.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFD700',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
    backgroundColor: '#FFD700',
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(0, 0, 0, 0.55)',
    marginBottom: 4,
  },

  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: '#111111',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.65)',
  },

  listContent: {
    paddingTop: 20,
    paddingBottom: 24,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingBottom: 80,
  },

  favoriteIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    marginBottom: 20,
  },

  stateIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4B3',
    marginBottom: 18,
  },

  stateTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
  },

  stateDescription: {
    marginTop: 7,
    maxWidth: 280,
    fontSize: 14,
    lineHeight: 20,
    color: '#777777',
    textAlign: 'center',
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#222222',
    textAlign: 'center',
  },

  emptyDescription: {
    marginTop: 8,
    maxWidth: 290,
    fontSize: 14,
    lineHeight: 21,
    color: '#777777',
    textAlign: 'center',
  },
});