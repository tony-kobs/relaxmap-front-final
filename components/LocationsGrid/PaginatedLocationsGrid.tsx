'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import LocationCard from '@/components/LocationCard/LocationCard';
import Loader from '@/components/Loader/Loader';
import Pagination from '@/components/Pagination/Pagination';
import { nextServer } from '@/lib/api/api';
import {
  LOCATIONS_DESKTOP_MEDIA,
  LOCATIONS_PAGE_SIZE,
  LOCATIONS_PAGE_SIZE_COMPACT,
  locationsQueryKey,
} from '@/lib/constants/locations';
import type { Location, LocationQuery, Paginated } from '@/types/location';
import css from './LocationsGrid.module.css';

const DEFAULT_SORT = 'popular';

/** 8 карток до 1440px, 9 — на десктопі. null, доки невідома ширина вікна. */
function useCatalogPageSize() {
  const [pageSize, setPageSize] = useState<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia(LOCATIONS_DESKTOP_MEDIA);
    const apply = () => {
      setPageSize(
        media.matches ? LOCATIONS_PAGE_SIZE : LOCATIONS_PAGE_SIZE_COMPACT,
      );
    };

    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  return pageSize;
}

async function fetchCatalogPage(
  page: number,
  filters: LocationQuery,
  limit: number,
) {
  const { data } = await nextServer.get<Paginated<Location>>('/locations', {
    params: { ...filters, page, limit },
    paramsSerializer: { indexes: null },
  });
  return data;
}

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/** Сітка каталогу з посторінковою пагінацією; сторінка зберігається в ?page= */
export default function PaginatedLocationsGrid() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLElement>(null);

  const page = parsePage(searchParams.get('page'));
  const pageSize = useCatalogPageSize();
  const filters: LocationQuery = {};
  const search = searchParams.get('search')?.trim();
  const region = searchParams.get('region');
  const types = searchParams.getAll('type');
  if (search) filters.search = search;
  if (region) filters.region = region;
  if (types.length) filters.type = types;
  filters.sort = (searchParams.get('sort') ??
    DEFAULT_SORT) as LocationQuery['sort'];

  const { data, isPending, isError, isFetching, isPlaceholderData } = useQuery({
    queryKey: locationsQueryKey(undefined, {
      ...filters,
      page,
      limit: pageSize ?? undefined,
    }),
    queryFn: () => {
      if (pageSize === null) {
        throw new Error('Розмір сторінки каталогу ще невідомий');
      }
      return fetchCatalogPage(page, filters, pageSize);
    },
    enabled: pageSize !== null,
    placeholderData: (previousData, previousQuery) => {
      const previousFilters = previousQuery?.queryKey[2] as
        | LocationQuery
        | undefined;
      // Інший limit — інший набір карток, попередню сторінку не показуємо.
      if (previousFilters?.limit !== pageSize) return undefined;
      return previousData;
    },
  });

  const writePage = useCallback(
    (nextPage: number, mode: 'push' | 'replace') => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextPage > 1) {
        params.set('page', String(nextPage));
      } else {
        params.delete('page');
      }

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      if (mode === 'push') {
        window.history.pushState(null, '', url);
      } else {
        window.history.replaceState(null, '', url);
      }
    },
    [pathname, searchParams],
  );

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) return;

    // Неглибока навігація: без запиту за сторінкою і без route loading,
    // тож список не зникає, а useSearchParams оновлюється сам
    writePage(nextPage, 'push');
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (pageSize === null || !data || isPlaceholderData) return;
    if (data.totalPages > 0 && page > data.totalPages) {
      writePage(data.totalPages, 'replace');
    }
  }, [data, isPlaceholderData, page, pageSize, writePage]);

  if (isPending) {
    return (
      <section className={css.section} data-section="LocationsGrid">
        <Loader size={56} />
      </section>
    );
  }

  if (isError) {
    return (
      <section className={css.section} data-section="LocationsGrid">
        <p className={css.message}>
          Не вдалося завантажити локації. Спробуйте пізніше.
        </p>
      </section>
    );
  }

  const locations = data.data;
  const totalPages = data.totalPages;
  const isChangingPage = isFetching && isPlaceholderData;

  return (
    <section
      ref={sectionRef}
      className={`${css.section} ${css.paged}`}
      data-section="LocationsGrid"
      aria-busy={isFetching}
    >
      {locations.length === 0 ? (
        <div className={css.empty}>
          <p className={css.emptyTitle}>Нічого не знайдено</p>
          <p className={css.message}>
            Спробуйте змінити пошуковий запит або скинути фільтри.
          </p>
        </div>
      ) : (
        <div className={css.pagedBody}>
          {isChangingPage && (
            <div className={css.overlay}>
              <Loader size={48} />
            </div>
          )}
          <ul className={`${css.grid} ${isChangingPage ? css.dimmed : ''}`}>
            {locations.map((location) => (
              <li key={location._id} className={css.card}>
                <LocationCard location={location} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <Pagination
        pageCount={totalPages}
        currentPage={Math.min(page, Math.max(totalPages, 1))}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
