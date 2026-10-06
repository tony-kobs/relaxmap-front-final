// Власник: Редагування локації
import { notFound } from 'next/navigation';
import { getLocationById } from '@/lib/api/locations';
import css from './LocationDescription.module.css';

type LocationDescriptionProps = {
  locationId: string;
};

export default async function LocationDescription({
  locationId,
}: LocationDescriptionProps) {
  const location = await getLocationById(locationId);

  if (!location) {
    notFound();
  }

  return (
    <section
      className={css.section}
      data-section="LocationDescription"
      data-location-id={locationId}
    >
      <p className={css.text}>{location.description}</p>
    </section>
  );
}
