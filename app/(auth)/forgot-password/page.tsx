import type { Metadata } from 'next';
import ForgotPasswordForm from '@/components/ForgotPasswordForm/ForgotPasswordForm';
import css from '../login/page.module.css';

export const metadata: Metadata = {
  title: 'Відновлення пароля',
  description: 'Надішліть лист для зміни пароля на платформі Relax Map',
};

export default function ForgotPasswordPage() {
  return (
    <section className={css.wrap}>
      <h1 className={css.title}>Відновлення пароля</h1>
      <ForgotPasswordForm />
    </section>
  );
}
