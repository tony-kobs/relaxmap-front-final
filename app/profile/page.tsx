import type { Metadata } from 'next';
import ProfileRedirect from './ProfileRedirect';

export const metadata: Metadata = {
  title: 'Мій профіль',
  description: 'Перенаправлення на сторінку вашого профілю на Relax Map.',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileRedirect />;
}
