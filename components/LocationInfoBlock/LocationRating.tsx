'use client';

import { useQuery } from '@tanstack/react-query';
import StarRating from '@/components/StarRating/StarRating';
import { getLocation } from '@/lib/api/clientApi';
import { locationDetailsQueryKey } from '@/lib/constants/locations';
import css from './LocationInfoBlock.module.css';

type LocationRatingProps = {
  locationId: string;
  initialRating: number;
};

export default function LocationRating({
  locationId,
  initialRating,
}: LocationRatingProps) {
  // initialData робить дані «вже є», тож інвалідація після відгуку скасовує
  // поточний запит і тягне свіжий рейтинг, поки сторінка лишається під модалкою.
  const { data: rating = initialRating } = useQuery({
    queryKey: locationDetailsQueryKey(locationId),
    queryFn: async () => {
      const location = await getLocation(locationId);
      return location?.rating ?? 0;
    },
    initialData: initialRating,
  });

  return (
    <StarRating
      value={rating || 0}
      readOnly
      showValue
      className={css.ratingCustom}
    />
  );
}
