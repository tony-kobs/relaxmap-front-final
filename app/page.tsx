import type { Metadata } from 'next';
import AdvantagesBlock from '@/components/AdvantagesBlock/AdvantagesBlock';
import HeroBlock from '@/components/HeroBlock/HeroBlock';
import PopularLocationsBlock from '@/components/PopularLocationsBlock/PopularLocationsBlock';
import ReviewsBlock from '@/components/ReviewsBlock/ReviewsBlock';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants/seo';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — місця для відпочинку в Україні` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <HeroBlock />
      <AdvantagesBlock />
      <PopularLocationsBlock />
      <ReviewsBlock />
    </>
  );
}
