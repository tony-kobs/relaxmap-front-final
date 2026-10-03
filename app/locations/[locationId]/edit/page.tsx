import { notFound } from 'next/navigation';
import LocationForm from '@/components/LocationForm/LocationForm';
import type { Location } from '@/types/location';

type EditLocationPageProps = {
  params: Promise<{ locationId: string }>;
};

async function getLocation(id: string): Promise<Location | null> {
  try {
    const baseUrl = process.env.BACKEND_URL;
    const res = await fetch(`${baseUrl}/locations/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? json;
  } catch {
    return null;
  }
}

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const { locationId } = await params;
  const location = await getLocation(locationId);

  if (!location) {
    notFound();
  }

  return (
    <>
      <h1>Редагування місця</h1>
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
