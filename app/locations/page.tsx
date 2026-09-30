import { Suspense } from 'react';
import type { Metadata } from 'next';
import FilterPanel from '@/components/FilterPanel/FilterPanel';
import LocationsGrid from '@/components/LocationsGrid/LocationsGrid';

export const metadata: Metadata = {
  title: 'Локації',
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
