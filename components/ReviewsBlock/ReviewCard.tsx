'use client';

import StarRating from '@/components/StarRating/StarRating';
import cardCss from './ReviewCard.module.css';

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
    <div className={`${cardCss.reviewCardCustom} ${customClassName}`}>
      <div className={cardCss.starsBlockWrapperFlex}>
        <StarRating
          value={rate}
          readOnly
          showValue={false}
          size="sm"
          className={cardCss.cardRatingCustom}
        />
      </div>

      <div className={cardCss.textBlockWrapperFlex}>
        <p className={cardCss.cardContentText}>{description}</p>
      </div>

      <div className={cardCss.authorMetaGroupFlex}>
        <h4 className={cardCss.authorNameText}>{userName}</h4>
        {showLocationType && locationTypeName && (
          <span className={cardCss.locationBadgeCustom}>
            {locationTypeName}
          </span>
        )}
      </div>
    </div>
  );
}
