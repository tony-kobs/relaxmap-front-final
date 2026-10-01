'use client';

import { useState, useEffect, useRef } from 'react';
import { getLocations } from '@/lib/api/clientApi';
import LocationCard from '../LocationCard/LocationCard';
import type { Location } from '@/types/location';
import css from './PopularLocationsBlock.module.css';

export default function PopularLocationsBlock() {
  const [locations, setLocations] = useState<Location[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getLocations({ limit: 6, sort: 'popular' })
      .then((res) => {
        setLocations(res.data);
      })
      .catch(console.error);
  }, []);

  const scrollByOne = (direction: number) => {
    if (trackRef.current) {
      const slide = trackRef.current.firstElementChild as HTMLElement;
      if (slide) {
        const slideWidth = slide.offsetWidth;
        const gap = 16;
        trackRef.current.scrollBy({ left: direction * (slideWidth + gap), behavior: 'smooth' });
      }
    }
  };

  if (!locations.length) return null;

  return (
    <section className={css.section}>
      <h2 className={css.title}>Популярні локації</h2>
      <div className={css.carouselWrapper}>
        <button className={css.arrowBtn} onClick={() => scrollByOne(-1)} aria-label="Попередня локація">
          &lt;
        </button>
        <div className={css.carouselTrack} ref={trackRef}>
          {locations.map((loc) => (
            <div key={loc._id} className={css.slide}>
              <LocationCard location={loc} />
            </div>
          ))}
        </div>
        <button className={css.arrowBtn} onClick={() => scrollByOne(1)} aria-label="Наступна локація">
          &gt;
        </button>
      </div>
    </section>
  );
}


