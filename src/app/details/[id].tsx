import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { usePointDetails } from '../../hooks/usePointDetails';
import { useFavorites } from '../../contexts/FavoritesContext';
import { supabase } from '../../lib/supabase';

interface GooglePlaceDetails {
  name: string | null;
  rating: number | null;
  userRatingCount: number;
  googleMapsUri: string | null;
}

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const {
    point,
    loading: pointLoading,
    error: pointError,
  } = usePointDetails(id);

  const { isFavorite, toggleFavorite } = useFavorites();

  const [googleDetails, setGoogleDetails] =
    useState<GooglePlaceDetails | null>(null);

  const [googleLoading, setGoogleLoading] = useState(false);

  const [imageAspectRatio, setImageAspectRatio] =
    useState(16 / 9);

  useEffect(() => {
    const loadGoogleDetails = async () => {
      if (!point?.googlePlaceId) {
        setGoogleDetails(null);
        return;
      }

      try {
        setGoogleLoading(true);

        const { data, error } = await supabase.functions.invoke(
          'google-place-details',
          {
            body: {
              placeId: point.googlePlaceId,
            },
          }
        );

        if (error) {
          throw error;
        }

        setGoogleDetails(data as GooglePlaceDetails);
      } catch (error) {
        console.error(
          'Erro ao carregar dados do Google Places:',
          error
        );

        setGoogleDetails(null);
      } finally {
        setGoogleLoading(false);
      }
    };

    loadGoogleDetails();
  }, [point?.googlePlaceId]);

  useEffect(() => {
    if (!point?.image) {
      return;
    }

    Image.getSize(
      point.image,
      (width, height) => {
        if (width > 0 && height > 0) {
          setImageAspectRatio(width / height);
        }
      },
      (error) => {
        console.warn(
          'Não foi possível obter o tamanho da imagem:',
          error
        );

        setImageAspectRatio(16 / 9);
      }
    );
  }, [point?.image]);

  const openMaps = async () => {
    if (!point) return;

    if (googleDetails?.googleMapsUri) {
      await Linking.openURL(googleDetails.googleMapsUri);
      return;
    }

    const query = encodeURIComponent(point.name);

    if (point.googlePlaceId) {
      await Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${point.googlePlaceId}`
      );
      return;
    }

    if (point.latitude && point.longitude) {
      await Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`
      );
      return;
    }

    const addressQuery = encodeURIComponent(
      `${point.name}, ${point.address}`
    );

    await Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${addressQuery}`
    );
  };

  if (pointLoading) {
    return (
      <SafeAreaView
        style={styles.stateScreen}
        edges={['top', 'bottom']}
      >
        <ActivityIndicator
          size="large"
          color="#E5B800"
        />

        <Text style={styles.stateTitle}>
          Carregando lugar
        </Text>

        <Text style={styles.stateDescription}>
          Preparando as informações para você...
        </Text>
      </SafeAreaView>
    );
  }

  if (pointError || !point) {
    return (
      <SafeAreaView
        style={styles.stateScreen}
        edges={['top', 'bottom']}
      >
        <View style={styles.stateIcon}>
          <Ionicons
            name="alert-circle-outline"
            size={36}
            color="#555555"
          />
        </View>

        <Text style={styles.stateTitle}>
          Lugar não encontrado
        </Text>

        <Text style={styles.stateDescription}>
          Não foi possível carregar as informações deste local.
        </Text>

        <TouchableOpacity
          style={styles.errorBackButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.errorBackButtonText}>
            Voltar
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const favorite = isFavorite(point.id);

  const formattedRatingCount =
    googleDetails?.userRatingCount?.toLocaleString('pt-BR');

  const imageHeight =
    imageAspectRatio > 0
      ? screenWidth / imageAspectRatio
      : screenWidth * (9 / 16);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: Math.max(insets.bottom, 20) + 20,
            },
          ]}
        >
          {/* FOTO */}
          <View
            style={[
              styles.hero,
              {
                height: imageHeight,
              },
            ]}
          >
            {point.image ? (
              <Image
                source={{ uri: point.image }}
                style={styles.heroImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.imageFallback}>
                <Ionicons
                  name="image-outline"
                  size={44}
                  color="#999999"
                />
              </View>
            )}
          </View>

          {/* CONTEÚDO */}
          <View style={styles.content}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {point.category}
              </Text>
            </View>

            <Text style={styles.title}>
              {point.name}
            </Text>

            {/* AVALIAÇÃO */}
            <View style={styles.ratingRow}>
              <View style={styles.ratingIcon}>
                <Ionicons
                  name="star"
                  size={18}
                  color="#E5B800"
                />
              </View>

              {googleLoading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#777777"
                  />

                  <Text style={styles.ratingSecondary}>
                    Consultando avaliação...
                  </Text>
                </>
              ) : googleDetails?.rating != null ? (
                <>
                  <Text style={styles.ratingValue}>
                    {googleDetails.rating.toLocaleString('pt-BR', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </Text>

                  <Text style={styles.ratingSecondary}>
                    {formattedRatingCount
                      ? `${formattedRatingCount} avaliações`
                      : 'Google'}
                  </Text>
                </>
              ) : (
                <Text style={styles.ratingSecondary}>
                  Avaliação indisponível
                </Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* INFORMAÇÕES */}
            <Text style={styles.sectionTitle}>
              Informações
            </Text>

            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="location-outline"
                    size={21}
                    color="#222222"
                  />
                </View>

                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>
                    Endereço
                  </Text>

                  <Text style={styles.infoValue}>
                    {point.address || 'Endereço não informado'}
                  </Text>
                </View>
              </View>

              {point.hours ? (
                <>
                  <View style={styles.infoDivider} />

                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Ionicons
                        name="time-outline"
                        size={21}
                        color="#222222"
                      />
                    </View>

                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>
                        Funcionamento
                      </Text>

                      <Text style={styles.infoValue}>
                        {point.hours}
                      </Text>
                    </View>
                  </View>
                </>
              ) : null}
            </View>

            {/* SOBRE */}
            <Text style={styles.sectionTitle}>
              Sobre o lugar
            </Text>

            <Text style={styles.description}>
              {point.description}
            </Text>

            {/* MAPA */}
            <TouchableOpacity
              style={styles.mapButton}
              onPress={openMaps}
              activeOpacity={0.85}
            >
              <View style={styles.mapButtonIcon}>
                <Ionicons
                  name="navigate"
                  size={20}
                  color="#111111"
                />
              </View>

              <View style={styles.mapButtonContent}>
                <Text style={styles.mapButtonTitle}>
                  Ver no mapa
                </Text>

                <Text style={styles.mapButtonSubtitle}>
                  Abrir localização no Google Maps
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#111111"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* BOTÕES FIXOS */}
        <View
          style={styles.fixedActions}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
            hitSlop={6}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#111111"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleFavorite(point.id)}
            activeOpacity={0.8}
            hitSlop={6}
          >
            <Ionicons
              name={favorite ? 'star' : 'star-outline'}
              size={24}
              color={favorite ? '#E5B800' : '#111111'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingBottom: 36,
  },

  hero: {
    width: '100%',
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  imageFallback: {
    width: '100%',
    height: '100%',
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
  },

  /*
   * Agora a SafeAreaView externa já removeu a área
   * reservada ao sistema operacional.
   *
   * Estes controles ficam relativos somente à área útil.
   */
  fixedActions: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  actionButton: {
    width: 46,
    height: 46,
    borderRadius: 23,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(255, 255, 255, 0.96)',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.14,
    shadowRadius: 5,

    elevation: 5,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFF4B3',
    marginBottom: 12,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#725F00',
    textTransform: 'capitalize',
  },

  title: {
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '800',
    color: '#151515',
  },

  ratingRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  ratingIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7CC',
    marginRight: 8,
  },

  ratingValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222222',
    marginRight: 7,
  },

  ratingSecondary: {
    fontSize: 13,
    color: '#777777',
    marginLeft: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 22,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#222222',
    marginBottom: 12,
  },

  infoCard: {
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    marginBottom: 26,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
    paddingTop: 1,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777777',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
  },

  infoDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginLeft: 52,
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#555555',
    marginBottom: 28,
  },

  mapButton: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#FFD700',
  },

  mapButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    marginRight: 12,
  },

  mapButtonContent: {
    flex: 1,
  },

  mapButtonTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },

  mapButtonSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.62)',
  },

  stateScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  stateIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4B3',
    marginBottom: 4,
  },

  stateTitle: {
    marginTop: 16,
    fontSize: 19,
    fontWeight: '800',
    color: '#222222',
    textAlign: 'center',
  },

  stateDescription: {
    maxWidth: 290,
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
    color: '#777777',
    textAlign: 'center',
  },

  errorBackButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFD700',
  },

  errorBackButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
});