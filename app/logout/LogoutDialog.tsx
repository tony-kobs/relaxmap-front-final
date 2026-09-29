'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import { logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function LogoutDialog() {
  const router = useRouter();
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const dismissedRef = useRef(false);

  const close = () => {
    dismissedRef.current = true;
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const onConfirm = async () => {
    setIsLoading(true);

    try {
      await logout();
      if (dismissedRef.current) return;
      clearIsAuthenticated();
      router.replace('/login');
    } catch {
      if (dismissedRef.current) return;
      setIsLoading(false);
      toast.error('Не вдалося вийти');
    }
  };

  return (
    <ConfirmationModal
      title="Ви точно хочете вийти?"
      description="Ми будемо сумувати за вами!"
      confirmButtonText="Вийти"
      cancelButtonText="Відмінити"
      onConfirm={onConfirm}
      onCancel={close}
      isLoading={isLoading}
    />
  );
}
