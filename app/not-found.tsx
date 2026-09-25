import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import css from './error.module.css';

export const metadata: Metadata = {
  title: 'Сторінку не знайдено',
  description: 'Цієї сторінки немає на мапі Relax Map.',
};

export default function NotFound() {
  return (
    <section className={css.stage}>
      <div className={css.scene}>
        <Image
          className={`${css.photo} ${css.photoMap}`}
          src="/status/not-found.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className={css.scrim} />
      <div className={css.card}>
        <p className={css.kicker}>Збилися зі стежки</p>
        <h1 className={css.title}>Цієї сторінки немає на мапі</h1>
        <p className={css.text}>
          Схоже, посилання застаріло або стежка обірвалась. Поверніться на головну і знайдіть нове місце для відпочинку.
        </p>
        <Link className={css.button} href="/">
          На головну
        </Link>
      </div>
    </section>
  );
}
