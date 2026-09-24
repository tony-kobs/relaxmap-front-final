// Власник: Профіль
import LocationsGrid from '@/components/LocationsGrid/LocationsGrid';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';

type ProfilePageProps = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;

  return (
    <>
      <ProfileInfo userId={userId} />
      <LocationsGrid userId={userId} />
    </>
  );
}
