'use client';

// Власник: Створення локації
import { ErrorMessage, Field, Form, Formik } from 'formik';
import css from './LocationForm.module.css';
import { useEffect, useId, useRef, useState } from 'react';
import {
  createLocation,
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
};

interface LocationFormValues {
  images: File | null;
  name: string;
  type: string;
  region: string;
  description: string;
}

const initialValues: LocationFormValues = {
  images: null,
  name: '',
  type: '',
  region: '',
  description: '',
};

const LocationFormSchema = Yup.object().shape({
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
    .required('Додайте фото локації')
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

export default function LocationForm({ locationId }: LocationFormProps) {
  const fieldId = useId();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [regions, setRegions] = useState<Category[]>([]);
  const [locationTypes, setLocationTypes] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

      const data = await createLocation(formData);
      router.push(`/locations/${data._id}`);
    } catch {
      toast.error('Не вдалось створити локацію, спробуйте ще раз');
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
                    {imagePreview ? (
                      <Image
                        className={css.previewImage}
                        src={imagePreview}
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
                  Тип Місця
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
                  Відмінити
                </button>

                <button
                  className={css.submitButton}
                  type="submit"
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  Опублікувати
                </button>
              </div>
            </Form>
          )
        }
      </Formik>
    </section>
  );
}
