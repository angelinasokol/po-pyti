
import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './src/navigation/RootNavigator';

export default function App() {

  // Загружаем фирменные шрифты приложения
  const [fontsLoaded, fontError] = useFonts({
    'Nunito-Black': require('./assets/fonts/Nunito-Black.ttf'),

    'Nunito-ExtraBold': require('./assets/fonts/Nunito-ExtraBold.ttf'),

    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),

    'Nunito-Medium': require('./assets/fonts/Nunito-Medium.ttf'),
  });

  // Показываем ошибку, если шрифт не загрузился
  if (fontError) {
    throw fontError;
  }

  // Не отображаем интерфейс до загрузки шрифтов
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>

      <StatusBar style="dark" />

      <RootNavigator />

    </SafeAreaProvider>
  );
}
