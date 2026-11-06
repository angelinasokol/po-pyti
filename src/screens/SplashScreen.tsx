
import React, { useEffect, useRef } from 'react';

import {
  View,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;

// Заранее загружаем изображения онбординга
const ONBOARDING_ASSETS = [
  require('../../assets/images/onboarding/church-hero.png'),
  require('../../assets/images/onboarding/Церковь.png'),
  require('../../assets/images/onboarding/stories-bubble.png'),
  require('../../assets/images/onboarding/p3-горы.png'),
  require('../../assets/images/onboarding/p3-bubl.png'),
  require('../../assets/images/onboarding/p4-Фотоколлаж.png'),
];

export default function SplashScreen({ navigation }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1.12)).current;
  const isLeaving = useRef(false);

  useEffect(() => {
    // Прогреваем кэш картинок, пока открыта заставка
    Asset.loadAsync(ONBOARDING_ASSETS).catch(error => {
      console.warn('Не удалось предзагрузить изображения:', error);
    });

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      Animated.timing(scale, {
        toValue: 1,
        duration: 1100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      opacity.stopAnimation();
      scale.stopAnimation();
    };
  }, [opacity, scale]);

  const openOnboarding = () => {
    if (isLeaving.current) return;

    isLeaving.current = true;

    Animated.timing(opacity, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        navigation.replace('Onboarding');
      } else {
        isLeaving.current = false;
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Animated.Image
        source={require(
          '../../assets/images/backgrounds/Page1.png'
        )}
        resizeMode="contain"
        style={[
          styles.image,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      />

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={openOnboarding}
        accessibilityRole="button"
        accessibilityLabel="Начать знакомство с приложением"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },
});
