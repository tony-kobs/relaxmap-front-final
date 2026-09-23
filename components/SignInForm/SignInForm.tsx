'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignInForm.module.css';

export default function SignInForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={async (values, helpers) => {
        try {
          const user = await login(values);
          setUser(user);
          toast.success('Signed in');
          router.push('/profile');
        } catch {
          toast.error('Invalid email or password');
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <label className={css.label}>
            Email
            <Field className={css.input} type="email" name="email" />
            <ErrorMessage className={css.error} name="email" component="span" />
          </label>
          <label className={css.label}>
            Password
            <Field className={css.input} type="password" name="password" />
            <ErrorMessage
              className={css.error}
              name="password"
              component="span"
            />
          </label>
          <button className={css.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
