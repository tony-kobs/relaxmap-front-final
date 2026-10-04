'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';
import LocationsGrid from '@/components/LocationsGrid/LocationsGrid';
import ProfilePlaceholder from '@/components/ProfilePlaceholder/ProfilePlaceholder';
import Spinner from '@/components/Spinner/Spinner';
import { getUserLocations } from '@/lib/api/clientApi';

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default function ProfilePage({ params }: PageProps) {
  const [userId, setUserId] = useState<string>('');
  const [page, setPage] = useState(1);
  const [allLocations, setAllLocations] = useState<unknown[]>([]);

  const { isPending, isFetching } = useQuery({
    queryKey: ['user-locations', userId, page],
    queryFn: async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
      
      const data = await getUserLocations(resolvedParams.userId);
      const locationsList = Array.isArray(data) ? data : (data as { locations?: unknown[] })?.locations || [];
      
      setAllLocations(prev => (page === 1 ? locationsList : [...prev, ...locationsList]));
      return data;
    },
  });

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (isPending && page === 1) return <Spinner />;

  const hasLocations = allLocations.length > 0;

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <ProfileInfo 
        userId={userId} 
        isMyProfile={true} 
        locationsCount={allLocations.length} 
      />

      <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '32px 0 24px' }}>Локації</h2>

      {hasLocations ? (
        <>
          {/* Викликаємо LocationsGrid без пропсів, як він і був задуманий у проєкті */}
          <LocationsGrid />

          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <button 
              onClick={handleLoadMore} 
              disabled={isFetching}
              style={{
                backgroundColor: '#a8583b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isFetching ? 'Завантаження...' : 'Показати ще'}
            </button>
          </div>
        </>
      ) : (
        <ProfilePlaceholder isAuthenticated={true} />
      )}
    </main>
  );
}