'use client';

import { useSyncExternalStore } from 'react';
import {
  LOCATIONS_PAGE_SIZE,
  LOCATIONS_PAGE_SIZE_TABLET,
  LOCATIONS_TABLET_MEDIA,
} from '@/lib/constants/locations';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(LOCATIONS_TABLET_MEDIA);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(LOCATIONS_TABLET_MEDIA).matches
    ? LOCATIONS_PAGE_SIZE_TABLET
    : LOCATIONS_PAGE_SIZE;
}

// На сервері ширина вікна невідома: null, доки клієнт не прочитає matchMedia.
// Так розмітка гідратації збігається, а запит чекає на відомий розмір порції.
function getServerSnapshot() {
  return null;
}

/** Порція карток каталогу: 6 на планшеті (2 колонки), 9 — на мобільному й десктопі. */
export function useCatalogPageSize(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
