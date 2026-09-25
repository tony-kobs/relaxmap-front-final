// Власник: Новий відгук
'use client';

import { useState } from 'react';
import StarRating from '@/components/StarRating/StarRating';
import css from './AddReviewForm.module.css';

type AddReviewFormProps = {
  locationId: string;
};

export default function AddReviewForm({ locationId }: AddReviewFormProps) {
  const [rate, setRate] = useState(0);

  return (
    <section className={css.section} data-section="AddReviewForm" data-location-id={locationId}>
      <StarRating className={css.rating} value={rate} onChange={setRate} />
    </section>
  );
}
