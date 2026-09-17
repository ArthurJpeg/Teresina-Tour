import React, { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { PointOfInterest } from '../../types';
import PointCard from '../../components/PointCard';
import Header from '../../components/Header';
import { usePoints } from '../../hooks/usePoints';

export default function HomeScreen() {
  const {
    points,
    categories,
    searchText,
    selectedCategory,
    loading,
    error,
    handleSearch,
    handleCategoryChange,
  } = usePoints();

  const handlePointPress = useCallback(
    (point: PointOfInterest) => {
      router.push({
        pathname: '/details/[id]',
        params: { id: point.id },
      });
    },
    []
  );

  const renderHeader = () => (
    <>
      <Header />

      <View style={styles.discoveryArea}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={21}
            color="#777777"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar lugares em Teresina"
            placeholderTextColor="#999999"
            value={searchText}
            onChangeText={handleSearch}
            returnKeyType="search"
          />

          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}
              hitSlop={8}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#999999"
              />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          renderItem={({ item }) => {
            const selected =
              selectedCategory === item.id;

            return (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selected && styles.categoryButtonSelected,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  handleCategoryChange(item.id)
                }
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected &&
                      styles.categoryTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Explore Teresina
            </Text>

            <Text style={styles.sectionSubtitle}>
              {points.length === 1
                ? '1 lugar encontrado'
                : `${points.length} lugares encontrados`}
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.screen}>
        <Header />

        <View style={styles.centerState}>
          <ActivityIndicator
            size="large"
            color="#E5B800"
          />

          <Text style={styles.stateTitle}>
            Preparando seu passeio
          </Text>

          <Text style={styles.stateDescription}>
            Carregando os lugares de Teresina...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <Header />

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
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={points}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PointCard
            point={item}
            onPress={handlePointPress}
          />
        )}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.stateIcon}>
              <Ionicons
                name="search-outline"
                size={32}
                color="#555555"
              />
            </View>

            <Text style={styles.stateTitle}>
              Nenhum lugar encontrado
            </Text>

            <Text style={styles.stateDescription}>
              Tente outro nome ou escolha uma categoria
              diferente.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  listContent: {
    paddingBottom: 24,
  },

  discoveryArea: {
    paddingTop: 18,
  },

  searchContainer: {
    height: 52,
    marginHorizontal: 18,

    paddingHorizontal: 15,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    borderWidth: 1,
    borderColor: '#E8E8E8',
  },

  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,

    fontSize: 15,
    color: '#111111',
  },

  clearButton: {
    padding: 4,
  },

  categoriesContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 6,
    gap: 8,
  },

  categoryButton: {
    minHeight: 38,

    paddingHorizontal: 16,
    paddingVertical: 9,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 20,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E6E6E6',
  },

  categoryButtonSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },

  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },

  categoryTextSelected: {
    color: '#111111',
    fontWeight: '700',
  },

  sectionHeader: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 14,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171717',
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#777777',
  },

  centerState: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyState: {
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 80,
    alignItems: 'center',
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
    marginTop: 16,

    fontSize: 18,
    fontWeight: '700',
    color: '#222222',

    textAlign: 'center',
  },

  stateDescription: {
    marginTop: 6,

    maxWidth: 280,

    fontSize: 14,
    lineHeight: 20,
    color: '#777777',

    textAlign: 'center',
  },
});