import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  /*
   * No Android com navegação por botões, damos um pouco
   * mais de espaço entre nossa Tab Bar e os controles
   * do próprio sistema.
   *
   * No iPhone mantemos apenas a Safe Area normal.
   */
  const extraBottomSpace = Platform.OS === 'android' ? 10 : 0;

  const bottomPadding =
    Math.max(insets.bottom, 6) + extraBottomSpace;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: '#111111',
        tabBarInactiveTintColor: '#777777',

        tabBarStyle: {
          backgroundColor: '#FFD700',

          borderTopWidth: 0,

          /*
           * 58px = área dos botões do aplicativo
           * + Safe Area
           * + pequeno respiro extra no Android.
           */
          height: 58 + bottomPadding,

          paddingTop: 6,
          paddingBottom: bottomPadding,

          elevation: 8,

          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 5,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarItemStyle: {
          paddingTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="compass-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="calendar-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="star-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}