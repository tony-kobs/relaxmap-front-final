import type { Metadata } from 'next';
import AuthPromptModal from '@/components/AuthPromptModal/AuthPromptModal';

export const metadata: Metadata = {
  title: 'Потрібна авторизація',
  description: 'Увійдіть або зареєструйтесь, щоб продовжити на Relax Map.',
  robots: { index: false, follow: false },
};

export default function AuthPromptPage() {
  return <AuthPromptModal />;
}
