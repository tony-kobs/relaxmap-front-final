'use client';

import { useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import LocationCard from '@/components/LocationCard/LocationCard';
import Loader from '@/components/Loader/Loader';
import Pagination from '@/components/Pagination/Pagination';
import { nextServer } from '@/lib/api/api';
import {
  LOCATIONS_PAGE_SIZE,
  locationsQueryKey,
} from '@/lib/constants/locations';
import type { Location, LocationQuery, Paginated } from '@/types/location';
import css from './LocationsGrid.module.css';

const DEFAULT_SORT = 'popular';

async function fetchCatalogPage(page: number, filters: LocationQuery) {
  const { data } = await nextServer.get<Paginated<Location>>('/locations', {
    params: { ...filters, page, limit: LOCATIONS_PAGE_SIZE },
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
    queryKey: locationsQueryKey(undefined, { ...filters, page }),
    queryFn: () => fetchCatalogPage(page, filters),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) return;

    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) {
      params.set('page', String(nextPage));
    } else {
      params.delete('page');
    }

    // Неглибока навігація: без запиту за сторінкою і без route loading,
    // тож список не зникає, а useSearchParams оновлюється сам
    const query = params.toString();
    window.history.pushState(
      null,
      '',
      query ? `${pathname}?${query}` : pathname,
    );
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
