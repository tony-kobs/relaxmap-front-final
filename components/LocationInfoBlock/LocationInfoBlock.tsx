import Link from 'next/link';
import { notFound } from 'next/navigation';
import StarRating from '@/components/StarRating/StarRating';
import css from './LocationInfoBlock.module.css';

type LocationInfoBlockProps = {
  locationId: string;
};

async function getLocationDetails(id: string) {
  try {
    const baseUrl = process.env.BACKEND_URL;
    const res = await fetch(`${baseUrl}/locations/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? json;
  } catch {
    return null;
  }
}

export default async function LocationInfoBlock({
  locationId,
}: LocationInfoBlockProps) {
  const location = await getLocationDetails(locationId);

  if (!location) {
    notFound();
  }

  return (
    <section
      className={css.section}
      data-section="LocationInfoBlock"
      data-location-id={locationId}
    >
      <StarRating
        value={location.rating || 0}
        readOnly
        showValue
        className={css.ratingCustom}
      />

      <h1 className={css.title}>{location.name}</h1>

      <div className={css.detailsList}>
        <p>
          <span className={css.label}>Регіон:</span>{' '}
          <span className={css.value}>
            {location.region?.name || 'Невідомий регіон'}
          </span>
        </p>
        <p>
          <span className={css.label}>Тип локації:</span>{' '}
          <span className={css.value}>{location.type?.name || 'Інше'}</span>
        </p>
        <p>
          <span className={css.label}>Автор статті:</span>{' '}
          {location.owner ? (
            <Link
              href={`/profile/${location.owner._id}`}
              className={css.authorLink}
            >
              {location.owner.name}
            </Link>
          ) : (
            <span className={css.value}>Анонім</span>
          )}
        </p>
      </div>
    </section>
  );
}
