// Власник: Форма локації
import LocationForm from '@/components/LocationForm/LocationForm';

type EditLocationPageProps = {
  params: Promise<{ locationId: string }>;
};

export default async function EditLocationPage({ params }: EditLocationPageProps) {
  const { locationId } = await params;

  return (
    <>
      <h1>Редагування місця</h1>
      <LocationForm locationId={locationId} />
    </>
  );
}
