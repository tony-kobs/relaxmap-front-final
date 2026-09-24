// Власник: Деталі локації
import css from './LocationInfoBlock.module.css';

type LocationInfoBlockProps = {
  locationId: string;
};

export default function LocationInfoBlock({ locationId }: LocationInfoBlockProps) {
  return <section className={css.section} data-section="LocationInfoBlock" data-location-id={locationId} />;
}
