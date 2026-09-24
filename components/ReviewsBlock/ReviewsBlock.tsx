// Власник: Відгуки
import css from './ReviewsBlock.module.css';

type ReviewsBlockProps = {
  locationId?: string;
};

export default function ReviewsBlock({ locationId }: ReviewsBlockProps) {
  return (
    <section className={css.section} data-location-id={locationId}>
      {locationId ? null : <h2>Відгуки</h2>}
    </section>
  );
}
