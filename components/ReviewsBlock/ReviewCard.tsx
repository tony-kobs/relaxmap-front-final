// Власник: Відгуки
// --------------------------------------
// components/ReviewsBlock/ReviewCard.tsx
// Карточка відгуку (загальний шаблон): Шрифти, відступи, отримання даних бекенд

'use client';

import StarRating from '@/components/StarRating/StarRating';
import css from './ReviewCard.module.css';

export type ReviewData = {
  _id: string;
  locationId: {
    _id: string;
    type?: {
      _id: string;
      name: string;
      kind: string;
    };
  };
  owner: {
    _id: string;
    name: string;
  };
  userName: string;
  rate: number;
  description: string;
  status: 'pending' | 'approved';
  createdAt: string;
};

type ReviewCardProps = {
  review: ReviewData;
  showLocationType?: boolean;
  customClassName?: string;
};

export default function ReviewCard({
  review,
  showLocationType = false,
  customClassName = '',
}: ReviewCardProps) {
  const { rate, description, userName, locationId } = review;
  const locationTypeName = locationId?.type?.name;

  return (
    <div className={`${css.reviewCardCustom} ${customClassName}`}>
      <div className={css.starsBlockWrapperFlex}>
        <StarRating
          value={rate}
          readOnly
          showValue={false}
          size="sm"
          className={css.cardRatingCustom}
        />
      </div>

      <div className={css.textBlockWrapperFlex}>
        <p className={css.cardContentText}>{description}</p>
      </div>

      <div className={css.authorMetaGroupFlex}>
        <h4 className={css.authorNameText}>{userName}</h4>

        {showLocationType && locationTypeName && (
          <span className={css.locationBadgeCustom}>{locationTypeName}</span>
        )}
      </div>
    </div>
  );
}
