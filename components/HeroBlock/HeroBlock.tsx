'use client';

import { FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import css from './HeroBlock.module.css';

export default function HeroBlock() {
  const router = useRouter();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('search');
    const search = typeof value === 'string' ? value.trim() : '';
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    router.push(`/locations${query}`);
  };

  return (
    <section className={css.section}>
      <Image
        className={css.bg}
        src="/images/hero-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
      />

      <div className="container">
        <div className={css.heroContent}>
          <h1 className={css.heroTitle}>
            Відкрий для себе Україну. Знайди ідеальне місце для відпочинку
          </h1>
          <p className={css.heroSubtitle}>
            Тисячі перевірених локацій з реальними фото та відгуками від
            мандрівників
          </p>
        </div>

        <form className={css.searchForm} onSubmit={onSubmit}>
          <input
            name="search"
            type="search"
            className={css.searchInput}
            placeholder="Введіть назву, тип або регіон..."
            aria-label="Пошук за назвою, типом локації або регіоном"
          />
          <button className={css.searchButton} type="submit">
            Знайти місце
          </button>
        </form>
      </div>
    </section>
  );
}
