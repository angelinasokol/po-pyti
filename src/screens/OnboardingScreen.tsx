import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

import { colors } from '../theme/colors';
import BtnArrows from '../../assets/images/icons/btn_arrows.svg';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Onboarding'
>;

type Slide = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  bubble?: ImageSourcePropType;
  animation: 'up' | 'right' | 'zoom' | 'final';
};

// Все параметры компоновки и скорости находятся здесь.
const UI = {
  headerHeight: 48,
  skipRight: 25,
  skipFontSize: 16,

  imageWidth: '100%' as const,
  imageOffsetX: 0,
  imageOffsetY: 0,
  collageScale: 1.06,

  bubbleWidth: 130,
  bubbleHeight: 125,
  bubbleTop: 17,
  bubbleRight: 14,

  titleFontSize: 32,
  titleLineHeight: 42,
  descriptionFontSize: 16,
  descriptionLineHeight: 23,
  descriptionMarginTop: 12,
  textSectionHeight: 160,
  textSectionHorizontal: 22,

  footerHeight: 132,
  arrowSize: 66,
  arrowRight: 24,
  arrowTop: 10,
  dotSize: 18,
  dotGap: 8,
  dotsBottom: 15,
  inactiveDotColor: '#DCE2D9',

  fadeOutDuration: 85,
  fadeInDuration: 160,
  imageDuration: 280,
  textDelay: 90,
  textDuration: 230,

  // Последний экран: карта, Путик и кнопка.
  finalArtworkRatio: 0.55,
  finalArtworkMaxHeight: 470,
  finalMapTop: -28,
  finalMapHeightRatio: 0.96,
  finalPutikWidthRatio: 0.78,
  finalPutikHeightRatio: 0.61,
  finalPutikTopRatio: 0.41,
  finalPutikRight: 6,
  finalTextHorizontal: 22,
  finalTitleSize: 32,
  finalTitleLineHeight: 39,
  finalDescriptionSize: 18,
  finalDescriptionLineHeight: 26,
  finalDescriptionMarginTop: 18,
  finalButtonHeight: 58,
  finalButtonBottom: 8,
};

const IMAGES = {
  background: require('../../assets/images/onboarding/church-hero.png'),
  church: require('../../assets/images/onboarding/Церковь.png'),
  churchBubble: require('../../assets/images/onboarding/stories-bubble.png'),
  mountains: require('../../assets/images/onboarding/p3-горы.png'),
  mountainsBubble: require('../../assets/images/onboarding/p3-bubl.png'),
  collage: require('../../assets/images/onboarding/p4-Фотоколлаж.png'),
  maps: require('../../assets/images/onboarding/p5-maps.png'),
  putik: require('../../assets/images/onboarding/p5-putik.png'),
};

// Четыре экрана знакомства. Заставка с логотипом — отдельно.
const slides: Slide[] = [
  {
    title: 'Слушайте истории\nо местах по пути',
    description: 'Удивительные факты о местах,\nкоторые вы проезжаете.',
    image: IMAGES.church,
    bubble: IMAGES.churchBubble,
    animation: 'up',
  },
  {
    title: 'Находим интересные\nостановки',
    description: 'Подскажем, куда интересно\nзаглянуть по дороге.',
    image: IMAGES.mountains,
    bubble: IMAGES.mountainsBubble,
    animation: 'right',
  },
  {
    title: 'Всё по времени',
    description: 'Узнайте заранее, сколько минут\nдобавит остановка.',
    image: IMAGES.collage,
    animation: 'zoom',
  },
  {
    title: 'Готовы\nк путешествию?',
    description: 'Дальше — маршрут, истории\nи новые открытия. Поехали!',
    image: IMAGES.maps,
    animation: 'final',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];
  const isFinalSlide = currentSlide.animation === 'final';

  const { width, height } = useWindowDimensions();
  const compact = height < 760;
  const titleFontSize = compact ? 28 : UI.titleFontSize;
  const footerHeight = compact ? 120 : UI.footerHeight;
  const textSectionHeight = compact ? 150 : UI.textSectionHeight;
  const bubbleWidth = Math.min(UI.bubbleWidth, width * 0.34);

  const finalArtworkHeight = Math.min(
    Math.round(height * (compact ? 0.52 : UI.finalArtworkRatio)),
    UI.finalArtworkMaxHeight
  );
  const finalMapHeight = finalArtworkHeight * UI.finalMapHeightRatio;
  const finalPutikWidth = width * UI.finalPutikWidthRatio;
  const finalPutikHeight = finalArtworkHeight * UI.finalPutikHeightRatio;
  const finalPutikTop = finalArtworkHeight * UI.finalPutikTopRatio;

  const opacity = useRef(new Animated.Value(0)).current;
  const imageProgress = useRef(new Animated.Value(0)).current;
  const bubbleProgress = useRef(new Animated.Value(0)).current;
  const textProgress = useRef(new Animated.Value(0)).current;
  const putikProgress = useRef(new Animated.Value(0)).current;
  const isSwitching = useRef(false);

  // Подгружаем все PNG заранее, чтобы переходы не подтормаживали.
  useEffect(() => {
    Asset.loadAsync(Object.values(IMAGES)).catch(error => {
      console.warn('Не удалось предзагрузить картинки:', error);
    });
  }, []);

  // Короткие анимации при появлении очередного слайда.
  useEffect(() => {
    isSwitching.current = true;
    opacity.setValue(0);
    imageProgress.setValue(0);
    bubbleProgress.setValue(0);
    textProgress.setValue(0);
    putikProgress.setValue(0);

    const fade = Animated.timing(opacity, {
      toValue: 1,
      duration: UI.fadeInDuration,
      useNativeDriver: true,
    });

    const imageAnimation = Animated.timing(imageProgress, {
      toValue: 1,
      duration: UI.imageDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    const bubbleAnimation = Animated.spring(bubbleProgress, {
      toValue: 1,
      speed: 18,
      bounciness: 5,
      useNativeDriver: true,
    });

    const textAnimation = Animated.sequence([
      Animated.delay(UI.textDelay),
      Animated.timing(textProgress, {
        toValue: 1,
        duration: UI.textDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const putikAnimation = Animated.sequence([
      Animated.delay(70),
      Animated.spring(putikProgress, {
        toValue: 1,
        speed: 13,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]);

    fade.start(({ finished }) => {
      if (finished) isSwitching.current = false;
    });
    imageAnimation.start();
    textAnimation.start();
    if (currentSlide.bubble) bubbleAnimation.start();
    if (isFinalSlide) putikAnimation.start();

    return () => {
      fade.stop();
      imageAnimation.stop();
      bubbleAnimation.stop();
      textAnimation.stop();
      putikAnimation.stop();
    };
  }, [currentIndex, opacity, imageProgress, bubbleProgress, textProgress, putikProgress]);

  // Разные движения для церкви, гор и коллажа.
  const initialX = currentSlide.animation === 'right' ? 24 : 0;
  const initialY = currentSlide.animation === 'up' ? 18 : 0;
  const initialScale = currentSlide.animation === 'zoom'
    ? 0.94
    : currentSlide.animation === 'up' ? 1.025 : 0.98;
  const targetScale = currentSlide.animation === 'zoom' ? UI.collageScale : 1;

  const imageTranslateX = imageProgress.interpolate({
    inputRange: [0, 1], outputRange: [initialX, 0],
  });
  const imageTranslateY = imageProgress.interpolate({
    inputRange: [0, 1], outputRange: [initialY, 0],
  });
  const imageScale = imageProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [initialScale * targetScale, targetScale],
  });
  const bubbleScale = bubbleProgress.interpolate({
    inputRange: [0, 1], outputRange: [0.78, 1],
  });
  const textTranslateY = textProgress.interpolate({
    inputRange: [0, 1], outputRange: [12, 0],
  });
  const mapsScale = imageProgress.interpolate({
    inputRange: [0, 1], outputRange: [0.94, 1],
  });
  const putikTranslateY = putikProgress.interpolate({
    inputRange: [0, 1], outputRange: [38, 0],
  });
  const putikScale = putikProgress.interpolate({
    inputRange: [0, 1], outputRange: [0.87, 1],
  });

  // Только последовательное знакомство: стрелка ведёт вперёд.
  // Свайпы и переходы назад по точкам намеренно отсутствуют.
  const handleNext = () => {
    if (isSwitching.current || currentIndex >= slides.length - 1) return;
    isSwitching.current = true;

    Animated.timing(opacity, {
      toValue: 0,
      duration: UI.fadeOutDuration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setCurrentIndex(index => index + 1);
      } else {
        isSwitching.current = false;
      }
    });
  };

  const handleSkip = () => navigation.replace('Home');
  const handleStart = () => navigation.replace('Home');

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {!isFinalSlide && (
        <Image
          source={IMAGES.background}
          style={styles.backgroundImage}
          resizeMode="stretch"
        />
      )}

      <SafeAreaView
        style={styles.safeArea}
        edges={isFinalSlide ? ['top', 'bottom'] : ['top']}
      >
        {isFinalSlide ? (
          // Финальный слайд: карта, Путик и кнопка.
          <Animated.View style={[styles.finalContent, { opacity }]}>
            <View style={[styles.finalArtwork, { height: finalArtworkHeight }]}>
              <Animated.Image
                source={IMAGES.maps}
                resizeMode="contain"
                style={[
                  styles.finalMap,
                  {
                    top: UI.finalMapTop,
                    width,
                    height: finalMapHeight,
                    opacity: imageProgress,
                    transform: [{ scale: mapsScale }],
                  },
                ]}
              />

              <Animated.Image
                source={IMAGES.putik}
                resizeMode="contain"
                style={[
                  styles.finalPutik,
                  {
                    top: finalPutikTop,
                    right: UI.finalPutikRight,
                    width: finalPutikWidth,
                    height: finalPutikHeight,
                    opacity: putikProgress,
                    transform: [
                      { translateY: putikTranslateY },
                      { scale: putikScale },
                    ],
                  },
                ]}
              />
            </View>

            <Animated.View
              style={[
                styles.finalTextBlock,
                {
                  opacity: textProgress,
                  transform: [{ translateY: textTranslateY }],
                },
              ]}
            >
              <Text
                style={[
                  styles.finalTitle,
                  compact && { fontSize: 28, lineHeight: 35 },
                ]}
              >
                {currentSlide.title}
              </Text>

              <Text
                style={[
                  styles.finalDescription,
                  compact && { fontSize: 17, lineHeight: 24 },
                ]}
              >
                {currentSlide.description}
              </Text>
            </Animated.View>

            <View style={styles.finalSpacer} />

            <Pressable
              onPress={handleStart}
              accessibilityRole="button"
              accessibilityLabel="Начать путешествие"
              style={({ pressed }) => [
                styles.finalStartButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.finalStartText}>Начать</Text>
            </Pressable>
          </Animated.View>
        ) : (
          // Первые три слайда: иллюстрация, текст, стрелка и точки.
          <>
            <View style={styles.header}>
              <Pressable
                onPress={handleSkip}
                hitSlop={12}
                style={styles.skipButton}
                accessibilityRole="button"
                accessibilityLabel="Пропустить знакомство"
              >
                <Text style={styles.skipText}>Пропустить</Text>
              </Pressable>
            </View>

            <Animated.View style={[styles.content, { opacity }]}>
              <View style={styles.heroSection}>
                <Animated.Image
                  source={currentSlide.image}
                  resizeMode="contain"
                  style={[
                    styles.heroImage,
                    {
                      transform: [
                        { translateX: UI.imageOffsetX },
                        { translateY: UI.imageOffsetY },
                        { translateX: imageTranslateX },
                        { translateY: imageTranslateY },
                        { scale: imageScale },
                      ],
                    },
                  ]}
                />

                {currentSlide.bubble && (
                  <Animated.Image
                    source={currentSlide.bubble}
                    resizeMode="contain"
                    style={[
                      styles.bubbleImage,
                      {
                        width: bubbleWidth,
                        height: UI.bubbleHeight,
                        opacity: bubbleProgress,
                        transform: [{ scale: bubbleScale }],
                      },
                    ]}
                  />
                )}
              </View>

              <View
                style={[
                  styles.textSection,
                  {
                    height: currentSlide.animation === 'zoom'
                      ? textSectionHeight - 10
                      : textSectionHeight,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.textGroup,
                    {
                      opacity: textProgress,
                      transform: [{ translateY: textTranslateY }],
                    },
                  ]}
                >
                  <Text
                    allowFontScaling
                    maxFontSizeMultiplier={1.15}
                    adjustsFontSizeToFit
                    minimumFontScale={0.82}
                    numberOfLines={2}
                    style={[
                      styles.title,
                      {
                        fontSize: titleFontSize,
                        lineHeight: compact ? 38 : UI.titleLineHeight,
                      },
                      currentIndex === 1 && {
                        fontSize: compact ? 25 : 28,
                        lineHeight: compact ? 34 : 38,
                      },
                    ]}
                  >
                    {currentSlide.title}
                  </Text>

                  <Text
                    allowFontScaling
                    maxFontSizeMultiplier={1.15}
                    style={[
                      styles.description,
                      compact && { fontSize: 15, lineHeight: 21 },
                    ]}
                  >
                    {currentSlide.description}
                  </Text>
                </Animated.View>
              </View>
            </Animated.View>

            <View style={[styles.footer, { height: footerHeight }]}>
              <Pressable
                onPress={handleNext}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.nextButton,
                  pressed && styles.pressedButton,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Следующая страница"
              >
                <BtnArrows
                  width={UI.arrowSize}
                  height={UI.arrowSize}
                  color={colors.secondary}
                />
              </Pressable>

              {/* Точки показывают этап знакомства, но не перелистывают. */}
              <View style={styles.pagination} accessibilityLabel={`Экран ${currentIndex + 1} из ${slides.length}`}>
                {slides.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dotTouchArea,
                    ]}
                  >
                    <View
                      style={[
                        styles.dot,
                        currentIndex === index && styles.activeDot,
                      ]}
                    />
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  safeArea: { flex: 1 },

  header: {
    height: UI.headerHeight,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: UI.skipRight,
  },
  skipButton: {
    minHeight: 44,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontFamily: 'Nunito-Medium',
    fontSize: UI.skipFontSize,
    color: colors.secondary,
  },

  content: { flex: 1, minHeight: 0 },
  heroSection: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: UI.imageWidth,
    height: '100%',
  },
  bubbleImage: {
    position: 'absolute',
    top: UI.bubbleTop,
    right: UI.bubbleRight,
  },

  textSection: {
    width: '100%',
    paddingHorizontal: UI.textSectionHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: UI.titleFontSize,
    color: colors.dark,
    textAlign: 'center',
    includeFontPadding: false,
  },
  description: {
    fontFamily: 'Nunito-Medium',
    fontSize: UI.descriptionFontSize,
    lineHeight: UI.descriptionLineHeight,
    color: '#68776D',
    textAlign: 'center',
    marginTop: UI.descriptionMarginTop,
    includeFontPadding: false,
  },

  footer: { width: '100%', position: 'relative' },
  nextButton: {
    position: 'absolute',
    right: UI.arrowRight,
    top: UI.arrowTop,
    width: UI.arrowSize,
    height: UI.arrowSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: UI.dotsBottom,
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI.dotGap,
  },
  dotTouchArea: {
    width: 29,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: UI.dotSize,
    height: UI.dotSize,
    borderRadius: UI.dotSize / 2,
    backgroundColor: UI.inactiveDotColor,
  },
  activeDot: { backgroundColor: colors.dark },
  pressedButton: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },

  finalContent: { flex: 1, width: '100%' },
  finalArtwork: {
    width: '100%',
    position: 'relative',
    overflow: 'visible',
  },
  finalMap: { position: 'absolute', left: 0 },
  finalPutik: { position: 'absolute' },
  finalTextBlock: {
    paddingHorizontal: UI.finalTextHorizontal,
    paddingTop: 10,
  },
  finalTitle: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: UI.finalTitleSize,
    lineHeight: UI.finalTitleLineHeight,
    color: colors.dark,
    textAlign: 'left',
    includeFontPadding: false,
  },
  finalDescription: {
    fontFamily: 'Nunito-Medium',
    fontSize: UI.finalDescriptionSize,
    lineHeight: UI.finalDescriptionLineHeight,
    color: '#68776D',
    marginTop: UI.finalDescriptionMarginTop,
    includeFontPadding: false,
  },
  finalSpacer: { flex: 1, minHeight: 12 },
  finalStartButton: {
    height: UI.finalButtonHeight,
    marginHorizontal: UI.finalTextHorizontal,
    marginBottom: UI.finalButtonBottom,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalStartText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 21,
    color: colors.dark,
  },
});
