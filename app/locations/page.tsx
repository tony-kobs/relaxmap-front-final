import { Suspense } from 'react';
import type { Metadata } from 'next';
import FilterPanel from '@/components/FilterPanel/FilterPanel';
import LocationsGrid from '@/components/LocationsGrid/LocationsGrid';

export const metadata: Metadata = {
  title: 'Локації',
  description:
    'Каталог місць для відпочинку в Україні: пошук за назвою, регіоном і типом локації.',
  alternates: { canonical: '/locations' },
};

export default function LocationsPage() {
  return (
    <div className="container">
      <Suspense fallback={null}>
        <FilterPanel />
        <LocationsGrid />
      </Suspense>
    </div>
  );
}
