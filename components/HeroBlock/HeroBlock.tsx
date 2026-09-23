// Власник: Перший екран
'use client';

import { FormEvent } from 'react';
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
      <h1>Відкрий для себе Україну. Знайди ідеальне місце для відпочинку</h1>
      <p>
        Тисячі перевірених локацій з реальними фото та відгуками від мандрівників
      </p>
      <form onSubmit={onSubmit}>
        <input name="search" placeholder="Введіть назву, тип або регіон..." />
        <button type="submit">Знайти місце</button>
      </form>
    </section>
  );
}
