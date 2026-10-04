'use client';
// Власник: Створення локації
import { ErrorMessage, Field, Form, Formik } from 'formik';
import css from './LocationForm.module.css';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import {
  createLocation,
  updateLocation,
  getLocationTypes,
  getRegions,
} from '@/lib/api/clientApi';
import { Category } from '@/types/location';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import Loader from '../Loader/Loader';
import { toast } from 'react-hot-toast';
import { LocationSelect } from '../LocationSelect/LocationSelect';
import Image from 'next/image';

type LocationFormProps = {
  locationId?: string;
  initialLocation?: {
    name: string;
    type: string;
    region: string;
    description: string;
    images: string[];
  };
};

interface LocationFormValues {
  images: File | null;
  name: string;
  type: string;
  region: string;
  description: string;
}

const buildLocationFormSchema = (isEditing: boolean) =>
  Yup.object().shape({
    name: Yup.string()
      .min(3, 'Назва занадто маленька')
      .max(96, 'Назва занадто велика')
      .required('Вкажіть назву локації'),
    type: Yup.string().max(64).required('Вкажіть тип локації'),
    region: Yup.string().max(64).required('Вкажіть регіон'),
    description: Yup.string()
      .min(20, 'Замалий опис')
      .max(6000, 'Опис занадто великий')
      .required('Опишіть локацію детальніше'),
    images: Yup.mixed<File>()
      // початкове значення — null (файл не вибрано); без nullable() Yup
      // вважає форму невалідною і кнопка збереження лишається неактивною
      .nullable()
      // під час редагування фото можна лишити без змін
      .test('required', 'Додайте фото локації', (file) =>
        isEditing ? true : !!file,
      )
      .test(
        'fileType',
        'Дозволені тільки JPG та PNG',
        (file) => !file || ['image/jpeg', 'image/png'].includes(file.type),
      )
      .test(
        'fileSize',
        'Розмір фото має бути менше 1 МБ',
        (file) => !file || file.size < 1024 * 1024,
      ),
  });

export default function LocationForm({
  locationId,
  initialLocation,
}: LocationFormProps) {
  const fieldId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(initialLocation);

  const [regions, setRegions] = useState<Category[]>([]);
  const [locationTypes, setLocationTypes] = useState<Category[]>([]);
  // нове фото, вибране користувачем (blob-прев'ю)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // фото, що вже збережене за локацією (під час редагування)
  const existingImage = initialLocation?.images?.[0] ?? null;
  const previewSrc = imagePreview ?? existingImage;

  const initialValues: LocationFormValues = {
    images: null,
    name: initialLocation?.name ?? '',
    type: initialLocation?.type ?? '',
    region: initialLocation?.region ?? '',
    description: initialLocation?.description ?? '',
  };

  const LocationFormSchema = useMemo(
    () => buildLocationFormSchema(isEditing),
    [isEditing],
  );

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [regions, locationTypes] = await Promise.all([
          getRegions(),
          getLocationTypes(),
        ]);

        setRegions(regions);
        setLocationTypes(locationTypes);
      } catch {
        toast.error('Не вдалося завантажити дані для форми');
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (values: LocationFormValues) => {
    try {
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('type', values.type);
      formData.append('region', values.region);
      formData.append('description', values.description);

      if (values.images) {
        formData.append('images', values.images);
      }

      if (isEditing && locationId) {
        await updateLocation(locationId, formData);
        toast.success('Зміни збережено');
        await queryClient.invalidateQueries({ queryKey: ['locations'] });
        router.push(`/locations/${locationId}`);
      } else {
        const data = await createLocation(formData);
        toast.success('Локацію додано');
        await queryClient.invalidateQueries({ queryKey: ['locations'] });
        router.push(`/locations/${data._id}`);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 403) {
          toast.error('Редагувати може лише автор');
          return;
        }

        if (typeof message === 'string' && message) {
          toast.error(message);
          return;
        }
      }

      toast.error(
        isEditing
          ? 'Не вдалось оновити локацію, спробуйте ще раз'
          : 'Не вдалось створити локацію, спробуйте ще раз',
      );
    }
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section
      className={css.section}
      data-section="LocationForm"
      data-location-id={locationId}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={LocationFormSchema}
      >
        {({
          setFieldValue,
          setFieldTouched,
          isSubmitting,
          resetForm,
          dirty,
          isValid,
          errors,
          touched,
        }) =>
          isSubmitting ? (
            <Loader size={80} />
          ) : (
            <Form className={css.form}>
              <div className={css.imageField}>
                <span className={css.label}>Обкладинка статті</span>

                <div className={css.imageUpload}>
                  <div className={css.imagePreview}>
                    {previewSrc ? (
                      <Image
                        className={css.previewImage}
                        src={previewSrc}
                        alt="Попередній перегляд фото"
                        fill
                        sizes="100vw"
                      />
                    ) : (
                      <svg className={css.imageIcon} aria-hidden="true">
                        <use href="/sprite.svg#image" />
                      </svg>
                    )}
                  </div>

                  <label
                    className={css.imageButton}
                    htmlFor={`${fieldId}-images`}
                  >
                    Завантажити фото
                  </label>

                  <input
                    ref={fileInputRef}
                    className={css.imageInput}
                    type="file"
                    name="images"
                    id={`${fieldId}-images`}
                    accept="image/jpeg,image/png"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const file = event.currentTarget.files?.[0] ?? null;

                      setFieldValue('images', file);
                      setFieldTouched('images', true, false);

                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                      } else {
                        setImagePreview(null);
                      }
                    }}
                  />
                </div>

                <ErrorMessage name="images">
                  {(message) => <span className={css.error}>{message}</span>}
                </ErrorMessage>
              </div>

              <div className={css.fieldGroup}>
                <label className={css.label} htmlFor={`${fieldId}-name`}>
                  Назва місця
                </label>

                <Field
                  className={`${css.nameInput} ${
                    touched.name && errors.name ? css.inputError : ''
                  }`}
                  type="text"
                  name="name"
                  id={`${fieldId}-name`}
                  placeholder="Введіть назву місця"
                />

                <ErrorMessage name="name">
                  {(message) => <span className={css.error}>{message}</span>}
                </ErrorMessage>
              </div>

              <div className={css.fieldGroup}>
                <label className={css.label} htmlFor={`${fieldId}-type`}>
                  Тип місця
                </label>

                <LocationSelect
                  name="type"
                  id={`${fieldId}-type`}
                  placeholder="Оберіть тип місця"
                  options={locationTypes}
                />

                <ErrorMessage name="type">
                  {(message) => <span className={css.error}>{message}</span>}
                </ErrorMessage>
              </div>

              <div className={css.fieldGroup}>
                <label className={css.label} htmlFor={`${fieldId}-region`}>
                  Регіон
                </label>

                <LocationSelect
                  name="region"
                  id={`${fieldId}-region`}
                  placeholder="Оберіть регіон"
                  options={regions}
                />

                <ErrorMessage name="region">
                  {(message) => <span className={css.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <div className={css.fieldGroup}>
                <label className={css.label} htmlFor={`${fieldId}-description`}>
                  Детальний опис
                </label>

                <Field
                  className={`${css.descriptionInput} ${
                    touched.description && errors.description
                      ? css.inputError
                      : ''
                  }`}
                  as="textarea"
                  name="description"
                  rows={5}
                  id={`${fieldId}-description`}
                  placeholder="Детальний опис локації"
                />

                <ErrorMessage name="description">
                  {(message) => <span className={css.error}>{message}</span>}
                </ErrorMessage>
              </div>

              <div className={css.actions}>
                <button
                  className={css.cancelButton}
                  type="button"
                  onClick={() => handleCancel(resetForm)}
                >
                  {isEditing ? 'Відмінити зміни' : 'Відмінити'}
                </button>

                <button
                  className={css.submitButton}
                  type="submit"
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  {isEditing ? 'Зберегти зміни' : 'Опублікувати'}
                </button>
              </div>
            </Form>
          )
        }
      </Formik>
    </section>
  );
}
