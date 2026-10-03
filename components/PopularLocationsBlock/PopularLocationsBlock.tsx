'use client';
// Власник: Популярні локації
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLocations } from '@/lib/api/clientApi';
import LocationCard from '@/components/LocationCard/LocationCard';
import Spinner from '@/components/Spinner/Spinner';
import css from './PopularLocationsBlock.module.css';

export default function PopularLocationsBlock() {
  const trackRef = useRef<HTMLUListElement>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ['locations', 'popular'],
    queryFn: () => getLocations({ limit: 6, sort: 'rating' }),
  });

  const locations = data?.data ?? [];

  const scrollByOne = (direction: 1 | -1) => {
    const track = trackRef.current;
    const slide = track?.firstElementChild as HTMLElement | null;
    if (!track || !slide) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (slide.offsetWidth + gap),
      behavior: 'smooth',
    });
  };

  return (
    <section className={css.section} data-section="PopularLocationsBlock">
      <div className="container">
        <div className={css.header}>
          <h2 className={css.title}>Популярні локації</h2>

          {locations.length > 1 && (
            <div className={css.controls}>
              <button
                type="button"
                className={css.arrow}
                onClick={() => scrollByOne(-1)}
                aria-label="Попередня локація"
              >
                <svg className={css.arrowIcon} aria-hidden="true">
                  <use href="/sprite.svg#chevron-left" />
                </svg>
              </button>
              <button
                type="button"
                className={css.arrow}
                onClick={() => scrollByOne(1)}
                aria-label="Наступна локація"
              >
                <svg className={css.arrowIcon} aria-hidden="true">
                  <use href="/sprite.svg#chevron-right" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {isPending && <Spinner />}

        {isError && (
          <p className={css.message}>
            Не вдалося завантажити локації. Спробуйте пізніше.
          </p>
        )}

        {!isPending && !isError && locations.length === 0 && (
          <p className={css.message}>Поки що немає локацій.</p>
        )}

        {locations.length > 0 && (
          <ul ref={trackRef} className={css.track}>
            {locations.map((location) => (
              <li key={location._id} className={css.slide}>
                <LocationCard location={location} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
