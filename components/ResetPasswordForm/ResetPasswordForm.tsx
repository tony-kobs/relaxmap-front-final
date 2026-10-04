'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { isAxiosError } from 'axios';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { resetPassword } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from '@/components/LoginForm/LoginForm.module.css';

const resetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Пароль повинен містити щонайменше 8 символів')
    .max(128, 'Пароль не повинен перевищувати 128 символів')
    .required('Пароль обовʼязковий'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Паролі не збігаються')
    .required('Повторіть пароль'),
});

type ResetPasswordFormProps = {
  token: string;
};

function InvalidLink({ message }: { message: string }) {
  return (
    <div className={css.form}>
      <p className={css.text}>{message}</p>
      <div className={css.links}>
        <Link href="/forgot-password" className={css.link}>
          Надіслати новий лист
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!token) {
    return (
      <InvalidLink message="Посилання для зміни пароля неповне. Запросіть новий лист." />
    );
  }

  if (isTokenInvalid) {
    return (
      <InvalidLink message="Посилання недійсне або термін його дії (15 хвилин) минув. Запросіть новий лист." />
    );
  }

  return (
    <Formik
      initialValues={{ password: '', confirmPassword: '' }}
      validationSchema={resetPasswordValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={async (values, helpers) => {
        try {
          await resetPassword({ token, password: values.password });
          // Бекенд видаляє всі сесії користувача, тож чистимо і локальний стан
          clearIsAuthenticated();
          toast.success('Пароль змінено. Увійдіть з новим паролем');
          router.push('/login');
        } catch (error: unknown) {
          const status = isAxiosError(error)
            ? error.response?.status
            : undefined;
          if (status === 401 || status === 404) {
            toast.error('Посилання недійсне або застаріло');
            setIsTokenInvalid(true);
            return;
          }
          toast.error('Не вдалося змінити пароль. Спробуйте ще раз');
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={css.form} noValidate>
          <label className={css.label} htmlFor="password">
            <span className={css.labelText}>Новий пароль*</span>
            <div className={css.inputWrapper}>
              <Field
                id="password"
                className={`${css.input} ${
                  touched.password && errors.password ? css.inputError : ''
                }`}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="********"
                autoComplete="new-password"
              />
              <button
                type="button"
                className={css.eyeButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? 'Приховати пароль' : 'Показати пароль'
                }
              >
                <svg className={css.eyeIcon} aria-hidden="true">
                  <use
                    href={`/sprite.svg#${showPassword ? 'eye-off' : 'eye'}`}
                  />
                </svg>
              </button>
            </div>
            <ErrorMessage
              className={css.error}
              name="password"
              component="span"
            />
          </label>

          <label className={css.label} htmlFor="confirmPassword">
            <span className={css.labelText}>Повторіть пароль*</span>
            <Field
              id="confirmPassword"
              className={`${css.input} ${
                touched.confirmPassword && errors.confirmPassword
                  ? css.inputError
                  : ''
              }`}
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="********"
              autoComplete="new-password"
            />
            <ErrorMessage
              className={css.error}
              name="confirmPassword"
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
                <span>Зберігаємо...</span>
              </span>
            ) : (
              'Змінити пароль'
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
}
