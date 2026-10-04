import type { Metadata } from 'next';
import { getPublicUserById } from '@/lib/api/users';
import { DEFAULT_OG_IMAGE, SITE_LOCALE, SITE_NAME } from '@/lib/constants/seo';

type ProfileLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
};

// Сторінка профілю — клієнтський компонент, тож метадані генеруємо в layout
export async function generateMetadata({
  params,
}: Pick<ProfileLayoutProps, 'params'>): Promise<Metadata> {
  const { userId } = await params;
  const user = await getPublicUserById(userId);

  if (!user) {
    return {
      title: 'Профіль',
      robots: { index: false },
    };
  }

  const title = `${user.name} | ${SITE_NAME}`;
  const description = `Профіль мандрівника ${user.name} на Relax Map: опубліковані місця для відпочинку.`;
  const url = `/profile/${user._id}`;
  const images = user.avatar
    ? [{ url: user.avatar, alt: user.name }]
    : [DEFAULT_OG_IMAGE];

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'profile',
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: images.map((item) => item.url),
    },
  };
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return children;
}
