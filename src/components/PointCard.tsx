import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PointOfInterest } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';

interface PointCardProps {
  point: PointOfInterest;
  onPress: (point: PointOfInterest) => void;
}

const PointCard: React.FC<PointCardProps> = React.memo(({
  point,
  onPress,
}) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(point.id);

  const handleFavoritePress = () => {
    toggleFavorite(point.id);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => onPress(point)}
    >
      <View style={styles.imageContainer}>
        {point.image ? (
          <Image
            source={{ uri: point.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons
              name="image-outline"
              size={36}
              color="#999999"
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          activeOpacity={0.8}
          hitSlop={8}
        >
          <Ionicons
            name={favorite ? 'star' : 'star-outline'}
            size={22}
            color={favorite ? '#FFD700' : '#222222'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.category}>
          {point.category}
        </Text>

        <Text
          style={styles.name}
          numberOfLines={2}
        >
          {point.name}
        </Text>

        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={15}
            color="#777777"
          />

          <Text
            style={styles.address}
            numberOfLines={1}
          >
            {point.address || 'Teresina - PI'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',

    marginHorizontal: 18,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: '#EEEEEE',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 190,
    backgroundColor: '#EEEEEE',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F1F1',
  },

  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,

    width: 42,
    height: 42,
    borderRadius: 21,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(255, 255, 255, 0.94)',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,

    elevation: 3,
  },

  content: {
    padding: 16,
  },

  category: {
    alignSelf: 'flex-start',

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: '#FFF7CC',

    fontSize: 11,
    fontWeight: '700',
    color: '#7A6500',

    textTransform: 'capitalize',

    marginBottom: 9,
  },

  name: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '700',
    color: '#161616',
  },

  locationContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  address: {
    flex: 1,
    marginLeft: 4,
    fontSize: 12,
    color: '#777777',
  },
});

export default PointCard;