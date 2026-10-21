import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type TripPlace = {
  label: string;
  coordinates: Coordinates | null;
};

function emptyPlace(): TripPlace {
  return { label: '', coordinates: null };
}

export function useTripDraft() {
  const [origin, setOrigin] = useState<TripPlace>(emptyPlace);
  const [destination, setDestination] = useState<TripPlace>(emptyPlace);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Поздний ответ GPS не должен затереть ручное изменение точки.
  const requestVersion = useRef(0);

  useEffect(() => {
    return () => {
      requestVersion.current += 1;
    };
  }, []);

  function cancelPendingResult() {
    requestVersion.current += 1;
    setIsLocating(false);
    setLocationError(null);
  }

  function setFrom(label: string) {
    cancelPendingResult();
    setOrigin({ label, coordinates: null });
  }

  function setTo(label: string) {
    setDestination({ label, coordinates: null });
  }

  function swapPlaces() {
    cancelPendingResult();
    setOrigin(destination);
    setDestination(origin);
  }

  async function locate() {
    if (isLocating) return;

    const version = ++requestVersion.current;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    setIsLocating(true);
    setLocationError(null);

    try {
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (version !== requestVersion.current) return;

      if (!permission.granted) {
        setLocationError(
          permission.canAskAgain
            ? 'Доступ к местоположению не разрешён. Можно повторить запрос или ввести начало поездки вручную.'
            : 'Разреши доступ к геопозиции в настройках телефона или введи начало поездки вручную.',
        );
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (version !== requestVersion.current) return;

      if (!servicesEnabled) {
        setLocationError(
          'На телефоне выключена геолокация. Включи её или введи начало поездки вручную.',
        );
        return;
      }

      const position = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        }),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => {
            reject(new Error('Location timeout'));
          }, 20000);
        }),
      ]);

      if (version !== requestVersion.current) return;

      setOrigin({
        label: 'Моё местоположение',
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    } catch {
      if (version !== requestVersion.current) return;

      setLocationError(
        'Не удалось определить местоположение. Попробуй ещё раз ближе к окну или введи начало поездки вручную.',
      );
    } finally {
      if (timeout !== undefined) clearTimeout(timeout);

      if (version === requestVersion.current) {
        setIsLocating(false);
      }
    }
  }

  return {
    origin,
    destination,
    from: origin.label,
    to: destination.label,
    setFrom,
    setTo,
    swapPlaces,
    locate,
    isLocating,
    locationError,
  };
}
