'use client';

import { useState, useEffect, useRef } from 'react';
import { getLocations } from '@/lib/api/clientApi';
import LocationCard from '../LocationCard/LocationCard';
import type { Location } from '@/types/location';
import css from './PopularLocationsBlock.module.css';

export default function PopularLocationsBlock() {
  const [locations, setLocations] = useState<Location[]>([] as unknown as Location[]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getLocations({ limit: 6, sort: 'rating' })
      .then((res) => {
        setLocations(res.data);
      })
      .catch(() => {
        setLocations([
          { _id: '1', name: 'Гірське озеро Синевир', type: { name: 'Природа' }, images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'], owner: { _id: 'owner1' } },
          { _id: '2', name: 'Кав\'ярня Центральна', type: { name: 'Заклад' }, images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'], owner: { _id: 'owner2' } },
          { _id: '3', name: 'Парк Шевченка', type: { name: 'Парк' }, images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'], owner: { _id: 'owner3' } },
          { _id: '4', name: 'Музей історії', type: { name: 'Музей' }, images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'], owner: { _id: 'owner4' } },
          { _id: '5', name: 'Гора Говерла', type: { name: 'Природа' }, images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'], owner: { _id: 'owner5' } }
        ] as unknown as Location[]);
      });
  }, [] as unknown as Location[]);

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
        <button className={css.arrowBtn} onClick={() => scrollByOne(-1)}>
          &lt;
        </button>
        <div className={css.carouselTrack} ref={trackRef}>
          {locations.map((loc) => (
            <div key={loc._id} className={css.slide}>
              <LocationCard location={loc} />
            </div>
          ))}
        </div>
        <button className={css.arrowBtn} onClick={() => scrollByOne(1)}>
          &gt;
        </button>
      </div>
    </section>
  );
}


