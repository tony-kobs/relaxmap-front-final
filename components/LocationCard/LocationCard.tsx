// Власник: Популярні локації
import Link from 'next/link';
import Image from 'next/image';
import StarRating from '@/components/StarRating/StarRating';
import type { Location } from '@/types/location';
import css from './LocationCard.module.css';

type LocationCardProps = {
  location: Location;
  showEdit?: boolean;
};

export default function LocationCard({
  location,
  showEdit = false,
}: LocationCardProps) {
  const image = location.images?.[0];

  return (
    <article className={css.card}>
      <div className={css.imageWrap}>
        {image && (
          <Image
            src={image}
            alt={location.name}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 33vw"
            className={css.image}
          />
        )}
      </div>

      <div className={css.body}>
        <p className={css.type}>{location.type?.name}</p>
        <StarRating
          value={location.rating ?? 0}
          readOnly
          size="sm"
          className={css.rating}
        />
        <h3 className={css.name}>{location.name}</h3>
        <div className={css.actions}>
          <Link href={`/locations/${location._id}`} className={css.link}>
            Переглянути локацію
          </Link>

          {showEdit && (
            <Link
              href={`/locations/${location._id}/edit`}
              className={css.edit}
              aria-label="Редагувати місце"
            >
              <svg className={css.editIcon} aria-hidden="true">
                <use href="/sprite.svg#edit" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
