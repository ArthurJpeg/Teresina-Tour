
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Constants from 'expo-constants';

const PRIVACY_URL =
  'https://arthurjpeg.github.io/Teresina-Tour/privacidade/';

const SUPPORT_EMAIL = 'afjcode@gmail.com';

export default function SobreScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'Não foi possível abrir',
        'Verifique se existe um aplicativo disponível para abrir este link.'
      );
    }
  };

  return (
    <View style={styles.screen}>
      {/* Cabeçalho fixo */}
      <SafeAreaView
        edges={['top']}
        style={styles.safeArea}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar para Explorar"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111111"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Sobre o aplicativo
          </Text>
        </View>
      </SafeAreaView>

      {/* Conteúdo com rolagem */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* Apresentação do aplicativo */}
        <View style={styles.brandArea}>
          <View style={styles.brandIcon}>
            <Ionicons
              name="compass-outline"
              size={36}
              color="#111111"
            />
          </View>

          <Text style={styles.appTitle}>
            Teresina Tour
          </Text>

          <Text style={styles.appSubtitle}>
            Conheça e explore Teresina
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeading}>
              <Ionicons
                name="information-circle-outline"
                size={23}
                color="#B38F00"
              />

              <Text style={styles.cardTitle}>
                Sobre o projeto
              </Text>
            </View>

            <Text style={styles.description}>
              O Teresina Tour é um aplicativo desenvolvido
              para facilitar a descoberta dos pontos
              turísticos, espaços culturais e eventos
              da cidade de Teresina, no Piauí.
            </Text>

            <Text style={styles.description}>
              Nossa proposta é valorizar o turismo local
              e reunir informações úteis para moradores
              e visitantes.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeading}>
              <Ionicons
                name="school-outline"
                size={23}
                color="#B38F00"
              />

              <Text style={styles.cardTitle}>
                Projeto acadêmico
              </Text>
            </View>

            <Text style={styles.description}>
              O Teresina Tour foi desenvolvido como
              projeto de extensão universitária do
              curso de Ciência da Computação da
              UNINASSAU.
            </Text>

            <Text style={styles.note}>
              Esta é uma iniciativa acadêmica
              independente, sem vínculo oficial
              com órgãos governamentais.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeading}>
              <Ionicons
                name="shield-checkmark-outline"
                size={23}
                color="#B38F00"
              />

              <Text style={styles.cardTitle}>
                Privacidade e suporte
              </Text>
            </View>

            <TouchableOpacity
              style={styles.linkRow}
              activeOpacity={0.7}
              onPress={() => openLink(PRIVACY_URL)}
              accessibilityRole="link"
              accessibilityLabel="Abrir Política de Privacidade"
            >
              <Ionicons
                name="document-text-outline"
                size={23}
                color="#444444"
              />

              <View style={styles.linkTextArea}>
                <Text style={styles.linkTitle}>
                  Política de Privacidade
                </Text>

                <Text style={styles.linkDescription}>
                  Saiba como tratamos informações e dados.
                </Text>
              </View>

              <Ionicons
                name="open-outline"
                size={19}
                color="#777777"
              />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.linkRow}
              activeOpacity={0.7}
              onPress={() =>
                openLink(`mailto:${SUPPORT_EMAIL}`)
              }
              accessibilityRole="button"
              accessibilityLabel="Enviar e-mail para suporte"
            >
              <Ionicons
                name="mail-outline"
                size={23}
                color="#444444"
              />

              <View style={styles.linkTextArea}>
                <Text style={styles.linkTitle}>
                  Entre em contato
                </Text>

                <Text style={styles.linkDescription}>
                  {SUPPORT_EMAIL}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color="#777777"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>
            Teresina Tour • Versão {version}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  safeArea: {
    backgroundColor: '#FFD700',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
  },

  brandArea: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 26,
    paddingHorizontal: 20,
    backgroundColor: '#FFD700',
  },

  brandIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  appTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#111111',
  },

  appSubtitle: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.65)',
    marginTop: 4,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 0,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 14,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },

  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#222222',
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555555',
    marginBottom: 10,
  },

  note: {
    fontSize: 13,
    lineHeight: 20,
    color: '#777777',
    marginTop: 4,
  },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    gap: 12,
  },

  linkTextArea: {
    flex: 1,
  },

  linkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
  },

  linkDescription: {
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
  },

  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },

  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
  },
});
