import AddReviewModal from '@/components/AddReviewModal/AddReviewModal';

type AddReviewPageProps = {
  params: Promise<{ locationId: string }>;
};

export default async function AddReviewPage({ params }: AddReviewPageProps) {
  const { locationId } = await params;

  return <AddReviewModal locationId={locationId} />;
}
