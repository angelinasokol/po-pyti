
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>По пути</Text>

      <Text style={styles.title}>
        Куда отправимся?
      </Text>

      <Text style={styles.subtitle}>
        Хорошая история начинается с дороги.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Уже есть планы?
        </Text>

        <Text style={styles.description}>
          Укажи направление, а мы найдём
          интересное по пути.
        </Text>

        <View style={styles.button}>
          <Text style={styles.buttonText}>
            Создать путешествие
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Интересное рядом
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 38,
  },

  logo: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.dark,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.dark,
    marginTop: 38,
  },

  subtitle: {
    fontSize: 15,
    color: colors.secondary,
    marginTop: 8,
    lineHeight: 22,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 32,
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardTitle: {
    color: colors.dark,
    fontSize: 22,
    fontWeight: '900',
  },

  description: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  button: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: colors.dark,
    fontWeight: '800',
    fontSize: 15,
  },

  sectionTitle: {
    marginTop: 32,
    fontSize: 21,
    fontWeight: '900',
    color: colors.dark,
  },
});
