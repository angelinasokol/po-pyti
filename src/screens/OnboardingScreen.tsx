
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Onboarding'
>;

const slides = [
  {
    title: 'Слушайте истории\nо местах по пути',
    description:
      'Открывайте удивительные факты и истории о местах вокруг.',
    illustration: 'Деревянная церковь у озера',
  },
  {
    title: 'Находим\nинтересные остановки',
    description:
      'Замечайте необычные места, которые встречаются по дороге.',
    illustration: 'Скалы, река и горы',
  },
  {
    title: 'Всё по времени',
    description:
      'Узнавайте, сколько времени займёт остановка.',
    illustration: 'Фотографии мест и +35 минут',
  },
  {
    title: 'Готовы\nк путешествию?',
    description:
      'Дальше — маршруты, истории и новые открытия. Поехали!',
    illustration: 'Путик с картой',
  },
];

export default function OnboardingScreen({
  navigation,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = slides[currentIndex];

  function handleNext() {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Home');
    }
  }

  function handleSkip() {
    navigation.replace('Home');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.circleTop} />

      <Pressable
        style={styles.skip}
        onPress={handleSkip}
      >
        <Text style={styles.skipText}>Пропустить</Text>
      </Pressable>

      <View style={styles.illustration}>
        <Text style={styles.illustrationText}>
          {currentSlide.illustration}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {currentSlide.title}
        </Text>

        <Text style={styles.description}>
          {currentSlide.description}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Pressable
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1
              ? 'Начать'
              : 'Далее →'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingBottom: 24,
    overflow: 'hidden',
  },

  circleTop: {
    position: 'absolute',
    top: -100,
    left: -70,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.lightGreen,
  },

  skip: {
    alignSelf: 'flex-end',
    marginTop: 12,
    padding: 10,
    zIndex: 2,
  },

  skipText: {
    color: colors.secondary,
    fontSize: 14,
  },

  illustration: {
    flex: 1,
    marginTop: 20,
    marginBottom: 28,
    backgroundColor: colors.lightGreen,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  illustrationText: {
    fontSize: 15,
    color: colors.secondary,
    textAlign: 'center',
  },

  content: {
    alignItems: 'center',
    minHeight: 135,
  },

  title: {
    color: colors.dark,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 36,
    textAlign: 'center',
  },

  description: {
    color: colors.secondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
  },

  footer: {
    gap: 22,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#DAE3D2',
  },

  activeDot: {
    backgroundColor: colors.dark,
  },

  nextButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextButtonText: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: '800',
  },
});
