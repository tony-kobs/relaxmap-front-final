'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import { logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function LogoutDialog() {
  const router = useRouter();
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = async () => {
    setIsLoading(true);

    try {
      await logout();
      clearIsAuthenticated();
      router.push('/login');
      router.refresh();
    } catch {
      setIsLoading(false);
      toast.error('Не вдалося вийти');
    }
  };

  return (
    <ConfirmationModal
      title="Ви впевнені, що хочете вийти?"
      confirmButtonText="Так"
      cancelButtonText="Ні"
      onConfirm={onConfirm}
      onCancel={() => router.back()}
      isLoading={isLoading}
    />
  );
}
