import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from './LocationGallery.module.css';

interface LocationGalleryProps {
  locationId: string;
}

async function getLocationImages(id: string) {
  try {
    const baseUrl = process.env.BACKEND_URL;
    const res = await fetch(`${baseUrl}/locations/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Помилка завантаження фото в галереї:', error);
    return null;
  }
}

export default async function LocationGallery({
  locationId,
}: LocationGalleryProps) {
  const location = await getLocationImages(locationId);

  if (!location) {
    notFound();
  }

  const mainImage =
    location.image ||
    (location.images && location.images[0]) ||
    'https://goit.study';

  return (
    <div className={styles.galleryWrapper}>
      <Image
        src={mainImage}
        alt={location.name || 'Location Image'}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
        priority
        unoptimized
        className={styles.mainImage}
      />
    </div>
  );
}
