'use client';
// Власник: Каталог
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { getLocationTypes, getRegions } from '@/lib/api/clientApi';
import FilterSelect from '@/components/FilterSelect/FilterSelect';
import css from './FilterPanel.module.css';

export const DEFAULT_SORT = 'popular';

const SORT_OPTIONS = [
  { value: 'popular', label: 'За популярністю' },
  { value: 'rating', label: 'За рейтингом' },
  { value: 'new', label: 'Новіші спочатку' },
];

type ParamChanges = Record<string, string | null>;

export default function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const region = searchParams.get('region') ?? '';
  const locationType = searchParams.get('type') ?? '';
  const sort = searchParams.get('sort') ?? DEFAULT_SORT;

  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') ?? '',
  );

  const { data: regions = [] } = useQuery({
    queryKey: ['categories', 'regions'],
    queryFn: getRegions,
    staleTime: Infinity,
  });

  const { data: locationTypes = [] } = useQuery({
    queryKey: ['categories', 'types'],
    queryFn: getLocationTypes,
    staleTime: Infinity,
  });

  const updateParams = (changes: ParamChanges) => {
    const params = new URLSearchParams(searchParams.toString());
    // будь-яка зміна фільтрів повертає список на першу порцію
    params.delete('page');

    for (const [key, value] of Object.entries(changes)) {
      params.delete(key);
      if (value) {
        params.set(key, value);
      }
    }

    // type — одне значення, навіть якщо в адресі лишились повтори
    const type = params.get('type');
    if (params.getAll('type').length > 1 && type) {
      params.delete('type');
      params.set('type', type);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateParams({ search: value.trim() || null });
  }, 400);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleReset = () => {
    debouncedSearch.cancel();
    setSearchValue('');
    router.replace(pathname, { scroll: false });
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <section className={css.section} data-section="FilterPanel">
      <form
        className={css.form}
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          debouncedSearch.flush();
        }}
      >
        <div className={css.row}>
          <input
            className={`${css.field} ${css.search}`}
            type="search"
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Пошук"
            aria-label="Пошук за назвою"
            maxLength={96}
          />

          <FilterSelect
            className={css.region}
            value={region}
            onChange={(value) => updateParams({ region: value || null })}
            ariaLabel="Регіон"
            options={[
              { value: '', label: 'Регіон' },
              ...regions.map(({ _id, name }) => ({ value: _id, label: name })),
            ]}
          />

          <FilterSelect
            className={css.type}
            value={locationType}
            onChange={(value) => updateParams({ type: value || null })}
            ariaLabel="Тип локації"
            options={[
              { value: '', label: 'Тип локації' },
              ...locationTypes.map(({ _id, name }) => ({
                value: _id,
                label: name,
              })),
            ]}
          />

          <FilterSelect
            className={css.sort}
            value={sort}
            onChange={(value) => updateParams({ sort: value })}
            ariaLabel="Сортування"
            options={SORT_OPTIONS.map(({ value, label }) => ({
              value,
              label,
            }))}
          />
        </div>

        {hasFilters && (
          <button className={css.reset} type="button" onClick={handleReset}>
            Скинути фільтри
          </button>
        )}
      </form>
    </section>
  );
}
