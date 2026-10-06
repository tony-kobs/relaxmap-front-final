// Власник: Деталі локації
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocationDescription from '@/components/LocationDescription/LocationDescription';
import LocationGallery from '@/components/LocationGallery/LocationGallery';
import LocationInfoBlock from '@/components/LocationInfoBlock/LocationInfoBlock';
import LocationMap from '@/components/LocationMap/LocationMap';
import ReviewsSection from '@/components/ReviewsSection/ReviewsSection';
import { getLocationById } from '@/lib/api/locations';
import {
  DEFAULT_OG_IMAGE,
  SITE_LOCALE,
  SITE_NAME,
  toMetaDescription,
} from '@/lib/constants/seo';
import css from './page.module.css';

type LocationDetailsPageProps = {
  params: Promise<{ locationId: string }>;
};

export async function generateMetadata({
  params,
}: LocationDetailsPageProps): Promise<Metadata> {
  const { locationId } = await params;
  const location = await getLocationById(locationId);

  if (!location) {
    return {
      title: 'Місце не знайдено',
      description: 'Такого місця відпочинку немає на мапі Relax Map.',
      robots: { index: false },
    };
  }

  const title = `${location.name} | ${SITE_NAME}`;
  const description =
    toMetaDescription(location.description) ||
    `${location.name} — місце відпочинку на Relax Map.`;
  const url = `/locations/${location._id}`;
  const image = location.images?.[0];
  const images = image
    ? [{ url: image, alt: location.name }]
    : [DEFAULT_OG_IMAGE];

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((item) => item.url),
    },
  };
}

export default async function LocationDetailsPage({
  params,
}: LocationDetailsPageProps) {
  const { locationId } = await params;
  const location = await getLocationById(locationId);

  if (!location) {
    notFound();
  }

  return (
    <>
      <div className={`container ${css.locationDetailsPage}`}>
        <div className="adaptive-top-container">
          <LocationGallery locationId={locationId} />
          <LocationInfoBlock locationId={locationId} />
        </div>
        <LocationDescription locationId={locationId} />
        <LocationMap locationId={locationId} />
        <ReviewsSection locationId={locationId} />
      </div>
    </>
  );
}
