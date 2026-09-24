import AddReviewModal from '@/components/AddReviewModal/AddReviewModal';

type AddReviewModalPageProps = {
  params: Promise<{ locationId: string }>;
};

export default async function AddReviewModalPage({ params }: AddReviewModalPageProps) {
  const { locationId } = await params;

  return <AddReviewModal locationId={locationId} />;
}
