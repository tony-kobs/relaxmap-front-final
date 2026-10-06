'use client';

import { useSyncExternalStore } from 'react';
import {
  LOCATIONS_DESKTOP_MEDIA,
  LOCATIONS_PAGE_SIZE,
  LOCATIONS_PAGE_SIZE_COMPACT,
} from '@/lib/constants/locations';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(LOCATIONS_DESKTOP_MEDIA);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(LOCATIONS_DESKTOP_MEDIA).matches
    ? LOCATIONS_PAGE_SIZE
    : LOCATIONS_PAGE_SIZE_COMPACT;
}

// На сервері ширина вікна невідома: null, доки клієнт не прочитає matchMedia.
// Так розмітка гідратації збігається, а запит чекає на відомий розмір порції.
function getServerSnapshot() {
  return null;
}

/** Порція карток каталогу: 9 на десктопі (3×3), 6 — на планшеті й мобільному. */
export function useCatalogPageSize(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
