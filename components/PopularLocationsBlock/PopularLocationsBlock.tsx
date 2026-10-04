'use client';
// Власник: Популярні локації
import { useRef } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getLocations } from '@/lib/api/clientApi';
import LocationCard from '@/components/LocationCard/LocationCard';
import Loader from '@/components/Loader/Loader';
import arrowCss from '@/components/ReviewsBlock/ArrowNavigation.module.css';
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
          <Link href="/locations" className={css.allLink}>
            Всі локації
          </Link>
        </div>

        {isPending && <Loader size={48} />}

        {isError && (
          <p className={css.message}>
            Не вдалося завантажити локації. Спробуйте пізніше.
          </p>
        )}

        {!isPending && !isError && locations.length === 0 && (
          <p className={css.message}>Поки що немає локацій.</p>
        )}

        {locations.length > 0 && (
          <>
            <ul ref={trackRef} className={css.track}>
              {locations.map((location) => (
                <li key={location._id} className={css.slide}>
                  <LocationCard location={location} />
                </li>
              ))}
            </ul>

            {locations.length > 1 && (
              <div className={`${arrowCss.sliderControlsFlex} ${css.controls}`}>
                <button
                  type="button"
                  className={arrowCss.sliderArrowBtn}
                  onClick={(event) => {
                    scrollByOne(-1);
                    event.currentTarget.blur();
                  }}
                  aria-label="Попередня локація"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      d="M7.09502 12.8518L12.5968 18.3533C12.7668 18.5236 12.8527 18.7236 12.8545 18.9533C12.8565 19.183 12.7745 19.383 12.608 19.5533C12.4345 19.7236 12.2312 19.8066 11.998 19.8023C11.7648 19.798 11.5648 19.7112 11.398 19.542L4.446 12.5903C4.336 12.4236 4.281 12.2353 4.281 12.0253C4.281 11.8153 4.336 11.627 4.446 11.4603L11.398 4.5085C11.5648 4.33917 11.7648 4.25233 11.998 4.248C12.2312 4.24367 12.4345 4.32667 12.608 4.497C12.7745 4.66733 12.8565 4.86733 12.8545 5.097C12.8527 5.32667 12.7668 5.52667 12.5968 5.697L7.09502 11.1985H18.9712C19.2112 11.1985 19.4145 11.2785 19.5812 11.4385C19.748 11.5985 19.8312 11.7943 19.8312 12.0253C19.8312 12.2563 19.748 12.4543 19.5812 12.6193C19.4145 12.7743 19.2112 12.8518 18.9712 12.8518H7.09502Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className={arrowCss.sliderArrowBtn}
                  onClick={(event) => {
                    scrollByOne(1);
                    event.currentTarget.blur();
                  }}
                  aria-label="Наступна локація"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      d="M16.9051 12.8517H4.70234C4.45767 12.8517 4.25459 12.7709 4.09309 12.6092C3.93142 12.4476 3.85059 12.2476 3.85059 12.0092C3.85059 11.7709 3.93142 11.5734 4.09309 11.4167C4.25459 11.26 4.45767 11.1817 4.70234 11.1817H16.9051L11.4033 5.68002C11.2333 5.50969 11.1474 5.30969 11.1456 5.08002C11.1436 4.85036 11.2256 4.65036 11.3921 4.48002C11.5656 4.30969 11.7689 4.22669 12.0021 4.23102C12.2353 4.23536 12.4353 4.32219 12.6021 4.49136L19.5541 11.443C19.6641 11.6097 19.7191 11.798 19.7191 12.008C19.7191 12.218 19.6641 12.4064 19.5541 12.573L12.6021 19.5147C12.4345 19.684 12.2312 19.7709 12.0021 19.7752C11.7689 19.7795 11.5656 19.6965 11.3921 19.5262C11.2256 19.3559 11.1436 19.1559 11.1456 18.9262C11.1474 18.6965 11.2333 18.4965 11.4033 18.3262L16.9051 12.8517Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
