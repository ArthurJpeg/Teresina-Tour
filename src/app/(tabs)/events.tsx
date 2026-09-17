import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Event, useEvents } from '../../hooks/useEvents';

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

function formatEventCardDate(event: Event) {
  const start = new Date(event.startAt);
  const end = event.endAt
    ? new Date(event.endAt)
    : null;

  const startDay = String(start.getDate()).padStart(2, '0');

  const startMonth = start
    .toLocaleDateString('pt-BR', {
      month: 'short',
    })
    .replace('.', '')
    .toUpperCase();

  const multiDay = end ? !sameDay(start, end) : false;

  if (end && multiDay) {
    const endDay = String(end.getDate()).padStart(2, '0');

    const endMonth = end
      .toLocaleDateString('pt-BR', {
        month: 'short',
      })
      .replace('.', '')
      .toUpperCase();

    const dateLabel =
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
        ? `${startDay}–${endDay} ${startMonth}`
        : `${startDay} ${startMonth} – ${endDay} ${endMonth}`;

    return {
      multiDay: true,
      day: `${startDay}–${endDay}`,
      month:
        start.getMonth() === end.getMonth()
          ? startMonth
          : `${startMonth}/${endMonth}`,
      time: `A partir das ${formatTime(start)}`,
      accessibilityDate: dateLabel,
    };
  }

  return {
    multiDay: false,
    day: startDay,
    month: startMonth,
    time:
      end && sameDay(start, end)
        ? `${formatTime(start)} às ${formatTime(end)}`
        : formatTime(start),
    accessibilityDate: `${startDay} ${startMonth}`,
  };
}

function isToday(event: Event) {
  const today = new Date();
  const start = new Date(event.startAt);

  if (event.endAt) {
    const end = new Date(event.endAt);

    if (!sameDay(start, end)) {
      const beginning = new Date(start);
      beginning.setHours(0, 0, 0, 0);

      const ending = new Date(end);
      ending.setHours(23, 59, 59, 999);

      return today >= beginning && today <= ending;
    }
  }

  return sameDay(start, today);
}

interface EventCardProps {
  event: Event;
}

const EventCard = React.memo(({ event }: EventCardProps) => {
  const date = formatEventCardDate(event);
  const happeningToday = isToday(event);

  const openDetails = () => {
    router.push({
      pathname: '/event-details/[id]',
      params: {
        id: event.id,
      },
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={openDetails}
    >
      {event.image ? (
        <Image
          source={{ uri: event.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imageFallback}>
          <Ionicons
            name="calendar-outline"
            size={42}
            color="#999999"
          />

          <Text style={styles.imageFallbackText}>
            Evento
          </Text>
        </View>
      )}

      <View style={styles.cardContent}>
        <View
          style={[
            styles.dateBox,
            date.multiDay && styles.multiDayDateBox,
          ]}
        >
          <Text
            style={[
              styles.dateMonth,
              date.multiDay && styles.multiDayMonth,
            ]}
            numberOfLines={1}
          >
            {date.month}
          </Text>

          <Text
            style={[
              styles.dateDay,
              date.multiDay && styles.multiDayDay,
            ]}
            numberOfLines={1}
          >
            {date.day}
          </Text>
        </View>

        <View style={styles.eventInfo}>
          <View style={styles.badgeRow}>
            {happeningToday ? (
              <View style={styles.todayBadge}>
                <Text style={styles.todayText}>
                  HOJE
                </Text>
              </View>
            ) : null}

            {event.free ? (
              <View style={styles.freeBadge}>
                <Text style={styles.freeText}>
                  GRATUITO
                </Text>
              </View>
            ) : null}

            {date.multiDay ? (
              <View style={styles.multiDayBadge}>
                <Text style={styles.multiDayBadgeText}>
                  VÁRIOS DIAS
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={styles.eventName}
            numberOfLines={2}
          >
            {event.name}
          </Text>

          <View style={styles.eventMeta}>
            <Ionicons
              name="time-outline"
              size={15}
              color="#777777"
            />

            <Text
              style={styles.metaText}
              numberOfLines={1}
            >
              {date.time}
            </Text>
          </View>

          {event.locationName ? (
            <View style={styles.eventMeta}>
              <Ionicons
                name="location-outline"
                size={15}
                color="#777777"
              />

              <Text
                style={styles.metaText}
                numberOfLines={1}
              >
                {event.locationName}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.chevron}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#AAAAAA"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function EventsScreen() {
  const {
    events,
    searchText,
    loading,
    error,
    handleSearch,
    clearSearch,
    reload,
  } = useEvents();

  const listHeader = useMemo(
    () => (
      <>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={23}
              color="#777777"
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar eventos em Teresina"
              placeholderTextColor="#999999"
              value={searchText}
              onChangeText={handleSearch}
              returnKeyType="search"
            />

            {searchText.length > 0 ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close-circle"
                  size={21}
                  color="#888888"
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Próximos eventos
          </Text>

          <Text style={styles.sectionSubtitle}>
            {events.length === 0
              ? 'Nenhum evento encontrado'
              : events.length === 1
                ? '1 evento encontrado'
                : `${events.length} eventos encontrados`}
          </Text>
        </View>
      </>
    ),
    [
      searchText,
      events.length,
      handleSearch,
      clearSearch,
    ]
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            ACONTECE EM TERESINA
          </Text>

          <Text style={styles.title}>
            Eventos
          </Text>

          <Text style={styles.subtitle}>
            Cultura, lazer e experiências pela cidade
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator
              size="large"
              color="#E5B800"
            />

            <Text style={styles.stateTitle}>
              Carregando eventos
            </Text>

            <Text style={styles.stateDescription}>
              Buscando o que está acontecendo em Teresina...
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

            <TouchableOpacity
              style={styles.retryButton}
              onPress={reload}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>
                Tentar novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard event={item} />
            )}
            ListHeaderComponent={listHeader}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name={
                      searchText
                        ? 'search-outline'
                        : 'calendar-outline'
                    }
                    size={38}
                    color="#222222"
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  {searchText
                    ? 'Nenhum evento encontrado'
                    : 'Nenhum evento por enquanto'}
                </Text>

                <Text style={styles.emptyDescription}>
                  {searchText
                    ? `Não encontramos eventos para "${searchText}".`
                    : 'Novos eventos de Teresina aparecerão aqui assim que forem cadastrados.'}
                </Text>

                {searchText ? (
                  <TouchableOpacity
                    style={styles.clearSearchButton}
                    onPress={clearSearch}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.clearSearchButtonText}>
                      Limpar busca
                    </Text>
                  </TouchableOpacity>
                ) : null}
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
    paddingBottom: 28,
  },

  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  searchContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 15,
    color: '#222222',
  },

  clearButton: {
    padding: 4,
    marginLeft: 6,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 14,
  },

  sectionTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#181818',
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 14,
    color: '#777777',
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,

    elevation: 3,
  },

  cardImage: {
    width: '100%',
    height: 190,
    backgroundColor: '#EEEEEE',
  },

  imageFallback: {
    width: '100%',
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
  },

  imageFallbackText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  dateBox: {
    width: 58,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#FFF4B3',
    marginRight: 14,
  },

  multiDayDateBox: {
    width: 70,
  },

  dateMonth: {
    fontSize: 11,
    fontWeight: '800',
    color: '#806B00',
  },

  multiDayMonth: {
    fontSize: 9,
  },

  dateDay: {
    marginTop: 1,
    fontSize: 24,
    lineHeight: 27,
    fontWeight: '800',
    color: '#222222',
  },

  multiDayDay: {
    fontSize: 17,
  },

  eventInfo: {
    flex: 1,
  },

  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },

  todayBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: '#FFD700',
  },

  todayText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#111111',
  },

  freeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: '#EAF7EA',
  },

  freeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#37763B',
  },

  multiDayBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: '#F0F0F0',
  },

  multiDayBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#666666',
  },

  eventName: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: '#222222',
    marginBottom: 8,
  },

  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  metaText: {
    flex: 1,
    marginLeft: 5,
    fontSize: 12,
    color: '#777777',
  },

  chevron: {
    paddingLeft: 8,
  },

  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  stateIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4B3',
    marginBottom: 4,
  },

  stateTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
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

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#FFD700',
  },

  retryButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111111',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 60,
    paddingBottom: 80,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222222',
    textAlign: 'center',
  },

  emptyDescription: {
    maxWidth: 300,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#777777',
    textAlign: 'center',
  },

  clearSearchButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#FFD700',
  },

  clearSearchButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111111',
  },
});