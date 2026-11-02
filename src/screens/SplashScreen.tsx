
import React from 'react';
import {
  View,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;

export default function SplashScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Прячем системную строку статуса */}
      <StatusBar hidden />

      {/* Весь готовый макет из Figma */}
      <Image
        source={require(
          '../../assets/images/backgrounds/Page1.png'
        )}
        style={styles.background}
        resizeMode="contain"
      />

      {/* Невидимая кнопка на весь экран */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => navigation.replace('Onboarding')}
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
  },

  background: {
    width: '100%',
    height: '100%',
  },
});
