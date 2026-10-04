// Власник: Форма локації
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getMe } from '@/lib/api/serverApi';
import { getLocationById } from '@/lib/api/locations';
import LocationForm from '@/components/LocationForm/LocationForm';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Редагування місця',
  robots: { index: false, follow: false },
};

type EditLocationPageProps = {
  params: Promise<{ locationId: string }>;
};

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const { locationId } = await params;
  const location = await getLocationById(locationId);

  if (!location) {
    notFound();
  }

  let currentUserId: string | null = null;
  try {
    const me = await getMe();
    currentUserId = me._id;
  } catch {
    currentUserId = null;
  }

  if (!currentUserId) {
    redirect('/login');
  }

  if (currentUserId !== location.owner._id) {
    redirect(`/locations/${locationId}`);
  }

  return (
    <>
      <h1 className={css.title}>Редагування місця</h1>
      <LocationForm
        locationId={locationId}
        initialLocation={{
          name: location.name,
          type: location.type?._id ?? '',
          region: location.region?._id ?? '',
          description: location.description,
          images: location.images,
        }}
      />
    </>
  );
}
