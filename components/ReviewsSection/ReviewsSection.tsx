// Власник: Відгуки
'use client';

import Link from 'next/link';
import ReviewsBlock from '@/components/ReviewsBlock/ReviewsBlock';
import { useAuthStore } from '@/lib/store/authStore';
import css from './ReviewsSection.module.css';

type ReviewsSectionProps = {
  locationId: string;
};

export default function ReviewsSection({ locationId }: ReviewsSectionProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const href = isAuthenticated ? `/locations/${locationId}/review` : '/auth-prompt';

  return (
    <section className={css.section}>
      <h2>Відгуки</h2>
      <ReviewsBlock locationId={locationId} />
      <Link href={href}>Залишити відгук</Link>
    </section>
  );
}
