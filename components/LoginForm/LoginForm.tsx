'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './LoginForm.module.css';

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Введіть коректну електронну пошту')
    .max(64, 'Пошта не повинна перевищувати 64 символи')
    .required('Пошта обовʼязкова'),
  password: Yup.string()
    .min(8, 'Пароль повинен містити щонайменше 8 символів')
    .max(128, 'Пароль не повинен перевищувати 128 символів')
    .required('Пароль обовʼязковий'),
});

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={async (values, helpers) => {
        try {
          const user = await login(values);
          setUser(user);
          toast.success(`Вітаємо, ${user.name || 'користувачу'}!`);
          router.push(user?._id ? `/profile/${user._id}` : '/profile');
        } catch {
          toast.error('Невірний email або пароль');
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={css.form} noValidate>
          <label className={css.label} htmlFor="email">
            <span className={css.labelText}>Пошта*</span>
            <Field
              id="email"
              className={`${css.input} ${
                touched.email && errors.email ? css.inputError : ''
              }`}
              type="email"
              name="email"
              placeholder="hello@relaxmap.ua"
              autoComplete="email"
            />
            <ErrorMessage className={css.error} name="email" component="span" />
          </label>

          <label className={css.label} htmlFor="password">
            <span className={css.labelText}>Пароль*</span>
            <div className={css.inputWrapper}>
              <Field
                id="password"
                className={`${css.input} ${
                  touched.password && errors.password ? css.inputError : ''
                }`}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="********"
                autoComplete="current-password"
              />
              <button
                type="button"
                className={css.eyeButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
              >
                <svg className={css.eyeIcon} aria-hidden="true">
                  <use href={`/sprite.svg#${showPassword ? 'eye-off' : 'eye'}`} />
                </svg>
              </button>
            </div>
            <ErrorMessage
              className={css.error}
              name="password"
              component="span"
            />
          </label>

          <button
            className={css.button}
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={css.buttonContent}>
                <ClipLoader color="#ffffff" size={18} />
                <span>Вхід...</span>
              </span>
            ) : (
              'Увійти'
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
}
