// Власник: Новий відгук
import AddReviewForm from '@/components/AddReviewForm/AddReviewForm';
import css from './AddReviewModal.module.css';

type AddReviewModalProps = {
  locationId: string;
};

export default function AddReviewModal({ locationId }: AddReviewModalProps) {
  return (
    <section className={css.section} data-section="AddReviewModal">
      <h2>Залишити відгук</h2>
      <AddReviewForm locationId={locationId} />
    </section>
  );
}
