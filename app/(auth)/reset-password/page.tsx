import type { Metadata } from 'next';
import ResetPasswordForm from '@/components/ResetPasswordForm/ResetPasswordForm';
import css from '../login/page.module.css';

export const metadata: Metadata = {
  title: 'Новий пароль',
  description: 'Встановлення нового пароля на платформі Relax Map',
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;
  const tokenValue = (Array.isArray(token) ? token[0] : token)?.trim() ?? '';

  return (
    <section className={css.wrap}>
      <h1 className={css.title}>Новий пароль</h1>
      <ResetPasswordForm token={tokenValue} />
    </section>
  );
}
