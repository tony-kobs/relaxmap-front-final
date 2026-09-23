'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignUpForm.module.css';

const schema = Yup.object({
  name: Yup.string().min(2, 'Мінімум 2 символи').max(32, 'Максимум 32 символи').required("Ім'я обов'язкове"),
  email: Yup.string().email('Некоректний email').max(64, 'Максимум 64 символи').required("Email обов'язковий"),
  password: Yup.string().min(8, 'Мінімум 8 символів').max(128, 'Максимум 128 символів').required("Пароль обов'язковий"),
});

export default function SignUpForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
      validationSchema={schema}
      onSubmit={async (values, helpers) => {
        try {
          const user = await register(values);
          setUser(user);
          toast.success('Account created');
          router.push('/profile');
        } catch {
          toast.error('Could not create account');
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <label className={css.label}>
            Ім'я
            <Field className={css.input} type="text" name="name" />
            <ErrorMessage className={css.error} name="name" component="span" />
          </label>
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
            {isSubmitting ? 'Creating...' : 'Sign up'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
