// Власник: Деталі локації
import css from './LocationGallery.module.css';

type LocationGalleryProps = {
  locationId: string;
};

export default function LocationGallery({ locationId }: LocationGalleryProps) {
  return <section className={css.section} data-section="LocationGallery" data-location-id={locationId} />;
}
