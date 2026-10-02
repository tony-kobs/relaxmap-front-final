'use client';
// Власник: Каталог
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { getLocationTypes, getRegions } from '@/lib/api/clientApi';
import css from './FilterPanel.module.css';

export const DEFAULT_SORT = 'popular';

const SORT_OPTIONS = [
  { value: 'popular', label: 'За популярністю' },
  { value: 'rating', label: 'За рейтингом' },
  { value: 'new', label: 'Новіші спочатку' },
];

type ParamChanges = Record<string, string | string[] | null>;

export default function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const region = searchParams.get('region') ?? '';
  const types = searchParams.getAll('type');
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

    for (const [key, value] of Object.entries(changes)) {
      params.delete(key);
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item));
      } else if (value) {
        params.set(key, value);
      }
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

  const toggleType = (id: string) => {
    const next = types.includes(id)
      ? types.filter((typeId) => typeId !== id)
      : [...types, id];
    updateParams({ type: next });
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
            className={css.field}
            type="search"
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Пошук за назвою"
            aria-label="Пошук за назвою"
            maxLength={96}
          />

          <select
            className={css.field}
            value={region}
            onChange={(event) =>
              updateParams({ region: event.target.value || null })
            }
            aria-label="Регіон"
          >
            <option value="">Усі регіони</option>
            {regions.map(({ _id, name }) => (
              <option key={_id} value={_id}>
                {name}
              </option>
            ))}
          </select>

          <select
            className={css.field}
            value={sort}
            onChange={(event) => updateParams({ sort: event.target.value })}
            aria-label="Сортування"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <fieldset className={css.fieldset}>
          <legend className={css.legend}>Тип локації</legend>
          <ul className={css.types}>
            {locationTypes.map(({ _id, name }) => (
              <li key={_id}>
                <label className={css.typeLabel}>
                  <input
                    className={css.checkbox}
                    type="checkbox"
                    checked={types.includes(_id)}
                    onChange={() => toggleType(_id)}
                  />
                  {name}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        {hasFilters && (
          <button className={css.reset} type="button" onClick={handleReset}>
            Скинути фільтри
          </button>
        )}
      </form>
    </section>
  );
}
