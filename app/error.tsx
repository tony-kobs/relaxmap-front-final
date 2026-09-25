'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import css from './error.module.css';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className={css.stage}>
      <div className={css.scene}>
        <Image
          className={`${css.photo} ${css.photoBridge}`}
          src="/status/error.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className={css.scrim} />
      <div className={`${css.card} ${css.cardEnd}`}>
        <p className={css.kicker}>Стежка перервалась</p>
        <h1 className={css.title}>Щось пішло не так</h1>
        <p className={css.text}>
          Не вдалося відкрити цю сторінку. Спробуйте ще раз — інколи дорога просто потребує другого кроку.
        </p>
        <button className={css.button} type="button" onClick={reset}>
          Спробувати знову
        </button>
      </div>
    </section>
  );
}
