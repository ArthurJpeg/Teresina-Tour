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

import { useEventDetails } from '../../hooks/useEventDetails';

function sameDay(first: Date, second: Date) {
  return (
    first.getDate() === second.getDate() &&
    first.getMonth() === second.getMonth() &&
    first.getFullYear() === second.getFullYear()
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function capitalize(text: string) {
  if (!text) return text;

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatEventPeriod(
  startAt: string,
  endAt?: string
) {
  const start = new Date(startAt);

  const startFullDate = capitalize(
    start.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  );

  if (!endAt) {
    return {
      date: startFullDate,
      time: formatTime(start),
      multiDay: false,
    };
  }

  const end = new Date(endAt);

  if (sameDay(start, end)) {
    return {
      date: startFullDate,
      time: `${formatTime(start)} às ${formatTime(end)}`,
      multiDay: false,
    };
  }

  let dateLabel: string;

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    const monthYear = start.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });

    dateLabel =
      `${String(start.getDate()).padStart(2, '0')} a ` +
      `${String(end.getDate()).padStart(2, '0')} de ${monthYear}`;
  } else if (
    start.getFullYear() === end.getFullYear()
  ) {
    const startMonth = start.toLocaleDateString('pt-BR', {
      month: 'long',
    });

    const endMonth = end.toLocaleDateString('pt-BR', {
      month: 'long',
    });

    dateLabel =
      `${String(start.getDate()).padStart(2, '0')} de ${startMonth} a ` +
      `${String(end.getDate()).padStart(2, '0')} de ${endMonth} de ` +
      `${start.getFullYear()}`;
  } else {
    const startDate = start.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const endDate = end.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    dateLabel = `${startDate} a ${endDate}`;
  }

  return {
    date: capitalize(dateLabel),
    time: `A partir das ${formatTime(start)}`,
    multiDay: true,
  };
}

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    event,
    loading,
    error,
  } = useEventDetails(id);

  const { width: screenWidth } =
    useWindowDimensions();

  const insets = useSafeAreaInsets();

  const [imageAspectRatio, setImageAspectRatio] =
    useState(16 / 9);

  useEffect(() => {
    if (!event?.image) {
      return;
    }

    Image.getSize(
      event.image,
      (width, height) => {
        if (width > 0 && height > 0) {
          setImageAspectRatio(width / height);
        }
      },
      () => {
        setImageAspectRatio(16 / 9);
      }
    );
  }, [event?.image]);

  const openMaps = async () => {
    if (!event) return;

    const query = encodeURIComponent(
      event.locationName || event.name
    );

    if (event.googlePlaceId) {
      await Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${event.googlePlaceId}`
      );

      return;
    }

    if (
      event.latitude !== undefined &&
      event.longitude !== undefined
    ) {
      await Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`
      );

      return;
    }

    const addressQuery = encodeURIComponent(
      `${event.locationName}, ${event.address}, Teresina - PI`
    );

    await Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${addressQuery}`
    );
  };

  const openTicket = async () => {
    if (!event?.ticketUrl) return;

    await Linking.openURL(event.ticketUrl);
  };

  if (loading) {
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
          Carregando evento
        </Text>

        <Text style={styles.stateDescription}>
          Preparando as informações para você...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView
        style={styles.stateScreen}
        edges={['top', 'bottom']}
      >
        <View style={styles.stateIcon}>
          <Ionicons
            name="calendar-outline"
            size={36}
            color="#555555"
          />
        </View>

        <Text style={styles.stateTitle}>
          Evento não encontrado
        </Text>

        <Text style={styles.stateDescription}>
          Não foi possível carregar as informações deste evento.
        </Text>

        <TouchableOpacity
          style={styles.backStateButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backStateButtonText}>
            Voltar
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const period = formatEventPeriod(
    event.startAt,
    event.endAt
  );

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
              paddingBottom:
                Math.max(insets.bottom, 20) + 20,
            },
          ]}
        >
          <View
            style={[
              styles.hero,
              event.image
                ? { height: imageHeight }
                : styles.heroFallbackHeight,
            ]}
          >
            {event.image ? (
              <Image
                source={{ uri: event.image }}
                style={styles.heroImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.imageFallback}>
                <Ionicons
                  name="calendar-outline"
                  size={54}
                  color="#888888"
                />

                <Text style={styles.imageFallbackText}>
                  Evento em Teresina
                </Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.badges}>
              {event.free ? (
                <View style={styles.freeBadge}>
                  <Text style={styles.freeText}>
                    GRATUITO
                  </Text>
                </View>
              ) : null}

              {period.multiDay ? (
                <View style={styles.multiDayBadge}>
                  <Ionicons
                    name="calendar-number-outline"
                    size={13}
                    color="#555555"
                  />

                  <Text style={styles.multiDayBadgeText}>
                    Vários dias
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.title}>
              {event.name}
            </Text>

            <View style={styles.dateHighlight}>
              <View style={styles.dateIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={23}
                  color="#111111"
                />
              </View>

              <View style={styles.dateHighlightContent}>
                <Text style={styles.dateText}>
                  {period.date}
                </Text>

                <Text style={styles.timeText}>
                  {period.time}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              Informações
            </Text>

            <View style={styles.infoCard}>
              {event.locationName ? (
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons
                      name="business-outline"
                      size={21}
                      color="#222222"
                    />
                  </View>

                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>
                      Local
                    </Text>

                    <Text style={styles.infoValue}>
                      {event.locationName}
                    </Text>
                  </View>
                </View>
              ) : null}

              {event.locationName &&
              event.address ? (
                <View style={styles.infoDivider} />
              ) : null}

              {event.address ? (
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
                      {event.address}
                    </Text>
                  </View>
                </View>
              ) : null}

              {(event.locationName ||
                event.address) ? (
                <View style={styles.infoDivider} />
              ) : null}

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="ticket-outline"
                    size={21}
                    color="#222222"
                  />
                </View>

                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>
                    Entrada
                  </Text>

                  <Text style={styles.infoValue}>
                    {event.free
                      ? 'Evento gratuito'
                      : event.ticketUrl
                        ? 'Consulte ingressos e valores'
                        : 'Consulte valores e disponibilidade'}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              Sobre o evento
            </Text>

            <Text style={styles.description}>
              {event.description ||
                'Mais informações sobre este evento serão divulgadas em breve.'}
            </Text>

            {(event.locationName ||
              event.address ||
              event.googlePlaceId ||
              (event.latitude !== undefined &&
                event.longitude !== undefined)) ? (
              <TouchableOpacity
                style={styles.mapButton}
                onPress={openMaps}
                activeOpacity={0.85}
              >
                <View style={styles.buttonIcon}>
                  <Ionicons
                    name="navigate"
                    size={20}
                    color="#111111"
                  />
                </View>

                <View style={styles.buttonContent}>
                  <Text style={styles.buttonTitle}>
                    Ver no mapa
                  </Text>

                  <Text style={styles.buttonSubtitle}>
                    Abrir localização no Google Maps
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={21}
                  color="#111111"
                />
              </TouchableOpacity>
            ) : null}

            {event.ticketUrl ? (
              <TouchableOpacity
                style={styles.ticketButton}
                onPress={openTicket}
                activeOpacity={0.85}
              >
                <View style={styles.ticketButtonIcon}>
                  <Ionicons
                    name="ticket-outline"
                    size={20}
                    color="#111111"
                  />
                </View>

                <View style={styles.buttonContent}>
                  <Text style={styles.buttonTitle}>
                    {event.free
                      ? 'Inscrição / informações'
                      : 'Ingressos'}
                  </Text>

                  <Text style={styles.buttonSubtitle}>
                    Abrir página oficial do evento
                  </Text>
                </View>

                <Ionicons
                  name="open-outline"
                  size={20}
                  color="#111111"
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>

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

  heroFallbackHeight: {
    height: 270,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },

  imageFallbackText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#777777',
  },

  fixedActions: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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

  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  freeBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EAF7EA',
  },

  freeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#37763B',
  },

  multiDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
  },

  multiDayBadgeText: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: '700',
    color: '#555555',
  },

  title: {
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '800',
    color: '#151515',
  },

  dateHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 28,
    padding: 15,
    borderRadius: 18,
    backgroundColor: '#FFF7CC',
  },

  dateIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    marginRight: 12,
  },

  dateHighlightContent: {
    flex: 1,
  },

  dateText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#222222',
  },

  timeText: {
    marginTop: 3,
    fontSize: 13,
    color: '#666666',
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
    marginBottom: 12,
  },

  ticketButton: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E2BD00',
    borderRadius: 18,
    backgroundColor: '#FFF7CC',
  },

  buttonIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    marginRight: 12,
  },

  ticketButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    marginRight: 12,
  },

  buttonContent: {
    flex: 1,
  },

  buttonTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },

  buttonSubtitle: {
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

  backStateButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFD700',
  },

  backStateButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
});