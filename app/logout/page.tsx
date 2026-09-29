import type { Metadata } from 'next';
import LogoutDialog from './LogoutDialog';

export const metadata: Metadata = {
  title: 'Підтвердження виходу',
};

export default function LogoutPage() {
  return <LogoutDialog />;
}
