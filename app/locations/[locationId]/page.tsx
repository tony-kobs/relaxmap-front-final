// Власник: Деталі локації
import LocationDescription from '@/components/LocationDescription/LocationDescription';
import LocationGallery from '@/components/LocationGallery/LocationGallery';
import LocationInfoBlock from '@/components/LocationInfoBlock/LocationInfoBlock';
import ReviewsSection from '@/components/ReviewsSection/ReviewsSection';

type LocationDetailsPageProps = {
  params: Promise<{ locationId: string }>;
};

export default async function LocationDetailsPage({ params }: LocationDetailsPageProps) {
  const { locationId } = await params;

  return (
    <>
      <LocationInfoBlock locationId={locationId} />
      <LocationGallery locationId={locationId} />
      <LocationDescription locationId={locationId} />
      <ReviewsSection locationId={locationId} />
    </>
  );
}
