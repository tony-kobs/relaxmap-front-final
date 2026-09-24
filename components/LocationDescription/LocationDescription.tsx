// Власник: Редагування локації
import css from './LocationDescription.module.css';

type LocationDescriptionProps = {
  locationId: string;
};

export default function LocationDescription({ locationId }: LocationDescriptionProps) {
  return (
    <section className={css.section} data-section="LocationDescription" data-location-id={locationId} />
  );
}
