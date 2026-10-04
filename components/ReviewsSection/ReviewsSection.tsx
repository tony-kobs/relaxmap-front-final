'use client';

import Link from 'next/link';
import ReviewsBlock from '../ReviewsBlock/ReviewsBlock';
import { useAuthStore } from '@/lib/store/authStore';
import css from './ReviewsSection.module.css';

type ReviewsSectionProps = {
  locationId: string;
};

const AUTH_PROMPT_ROUTE = '/auth-prompt';

export default function ReviewsSection({ locationId }: ReviewsSectionProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const batonHref = isAuthenticated
    ? `/locations/${locationId}/review`
    : AUTH_PROMPT_ROUTE;

  return (
    <section
      className={css.reviewsSectionCustom}
      data-location-id={locationId}
      data-section="ReviewsSection"
    >
      <div className={css.reviewsSectionWrapper}>
        <div className={css.sectionHeaderTopFlex}>
          <h2 className={css.sectionHeadingText}>Відгуки</h2>
          <Link href={batonHref} className={css.actionBatonLink}>
            Залишити відгук
          </Link>
        </div>

        <ReviewsBlock locationId={locationId} showTitle={false} embedded />
      </div>
    </section>
  );
}
