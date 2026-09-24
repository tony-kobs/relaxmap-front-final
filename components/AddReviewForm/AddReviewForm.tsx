// Власник: Новий відгук
import css from './AddReviewForm.module.css';

type AddReviewFormProps = {
  locationId: string;
};

export default function AddReviewForm({ locationId }: AddReviewFormProps) {
  return <section className={css.section} data-section="AddReviewForm" data-location-id={locationId} />;
}
