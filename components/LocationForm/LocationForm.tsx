// Власник: Створення локації
import css from './LocationForm.module.css';

type LocationFormProps = {
  locationId?: string;
};

export default function LocationForm({ locationId }: LocationFormProps) {
  return <section className={css.section} data-section="LocationForm" data-location-id={locationId} />;
}
