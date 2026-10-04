// Власник: Сесія
'use client';

import { useRouter } from 'next/navigation';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';

export default function AuthPromptModal() {
  const router = useRouter();

  const dismiss = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.replace('/');
  };

  return (
    <ConfirmationModal
      title="Потрібна авторизація"
      description="Щоб залишити відгук вам треба увійти, якщо ще немає облікового запису зареєструйтесь"
      cancelButtonText="Увійти"
      confirmButtonText="Зареєструватись"
      onDismiss={dismiss}
      onCancel={() => router.push('/login')}
      onConfirm={() => router.push('/register')}
    />
  );
}
