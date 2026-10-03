import { notFound } from 'next/navigation';
import css from './LocationDescription.module.css';

type LocationDescriptionProps = {
  locationId: string;
};

async function getLocationDescription(id: string) {
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

export default async function LocationDescription({
  locationId,
}: LocationDescriptionProps) {
  const location = await getLocationDescription(locationId);

  if (!location) {
    notFound();
  }

  return (
    <section
      className={css.section}
      data-section="LocationDescription"
      data-location-id={locationId}
    >
      <h2 className={css.title}>Опис</h2>
      <p className={css.text}>{location.description}</p>
    </section>
  );
}
