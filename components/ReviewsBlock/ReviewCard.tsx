'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import StarRating from '@/components/StarRating/StarRating';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import { deleteFeedback } from '@/lib/api/clientApi';
import { locationDetailsQueryKey } from '@/lib/constants/locations';
import { useAuthStore } from '@/lib/store/authStore';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
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
  owner?: {
    _id: string;
    name: string;
  };
  userName: string;
  rate: number;
  description: string;
  status?: 'pending' | 'approved';
  createdAt?: string;
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
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.user?._id);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { rate, description, userName, locationId, owner } = review;
  const locationTypeName = locationId?.type?.name;
  const isOwnReview = Boolean(currentUserId && owner?._id === currentUserId);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFeedback(review._id);
      const reviewedLocationId = locationId?._id;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['feedbacks'] }),
        queryClient.invalidateQueries({ queryKey: ['locations'] }),
        ...(reviewedLocationId
          ? [
              queryClient.invalidateQueries({
                queryKey: locationDetailsQueryKey(reviewedLocationId),
              }),
            ]
          : []),
      ]);
      toast.success('Відгук видалено');
      setIsConfirmOpen(false);
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Не вдалося видалити відгук. Спробуйте ще раз'),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={`${cardCss.reviewCardCustom} ${customClassName}`}>
        <div className={cardCss.starsBlockWrapperFlex}>
          <StarRating
            value={rate}
            readOnly
            showValue={false}
            size="sm"
            className={cardCss.cardRatingCustom}
          />

          {isOwnReview && (
            <button
              type="button"
              className={cardCss.deleteButton}
              onClick={() => setIsConfirmOpen(true)}
              aria-label="Видалити відгук"
            >
              <svg className={cardCss.deleteIcon} width="20" height="20" aria-hidden="true">
                <use href="/sprite.svg#trash" />
              </svg>
            </button>
          )}
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

      {isConfirmOpen &&
        createPortal(
          <ConfirmationModal
            title="Видалити відгук?"
            description="Цю дію неможливо скасувати"
            confirmButtonText="Видалити"
            cancelButtonText="Відмінити"
            onConfirm={handleDelete}
            onCancel={() => {
              if (!isDeleting) setIsConfirmOpen(false);
            }}
            isLoading={isDeleting}
          />,
          document.body,
        )}
    </>
  );
}
