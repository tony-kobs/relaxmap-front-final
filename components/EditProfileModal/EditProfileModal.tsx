'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './EditProfileModal.module.css';

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState(user?.name || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user?.avatar || '');
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Synchronize state with current user when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user?.name || '');
      setPreviewUrl(user?.avatar || '');
      setAvatarFile(null);
      setNameError('');
    }
  }, [isOpen, user]);

  // Handle ESC and scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      root.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Будь ласка, оберіть файл зображення');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Розмір фото не повинен перевищувати 2 МБ');
      return;
    }

    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Імʼя обовʼязкове');
      return;
    }
    if (trimmedName.length < 2) {
      setNameError('Імʼя повинно містити щонайменше 2 символи');
      return;
    }
    if (trimmedName.length > 32) {
      setNameError('Імʼя не повинно перевищувати 32 символи');
      return;
    }

    setNameError('');
    setIsLoading(true);

    try {
      let updatedUser;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('name', trimmedName);
        formData.append('avatar', avatarFile);
        updatedUser = await updateMe(formData);
      } else {
        updatedUser = await updateMe({ name: trimmedName });
      }

      setUser(updatedUser);
      toast.success('Профіль успішно оновлено!');
      onClose();
    } catch {
      toast.error('Не вдалося оновити профіль. Спробуйте ще раз');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={css.backdrop}
      onMouseDown={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={css.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={css.closeButton}
          onClick={onClose}
          disabled={isLoading}
          aria-label="Закрити"
        >
          <svg className={css.closeIcon} width="24" height="24" aria-hidden="true">
            <use href="/sprite.svg#close" />
          </svg>
        </button>

        <h2 id="edit-profile-title" className={css.title}>
          Редагувати профіль
        </h2>

        <form className={css.form} onSubmit={handleSubmit} noValidate>
          {/* Avatar section */}
          <div className={css.section}>
            <span className={css.label}>Аватар</span>
            <div className={css.avatarRow}>
              <div className={css.avatarPreview}>
                {previewUrl ? (
                  <Image
                    className={css.avatarImage}
                    src={previewUrl}
                    alt={user?.name || 'Аватар'}
                    width={80}
                    height={80}
                    unoptimized={previewUrl.startsWith('blob:')}
                  />
                ) : (
                  <span className={css.avatarFallback}>
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className={css.hiddenFileInput}
                onChange={handleFileChange}
              />

              <button
                type="button"
                className={css.uploadButton}
                onClick={handleUploadClick}
                disabled={isLoading}
              >
                Завантажити фото
              </button>
            </div>
          </div>

          {/* Name section */}
          <div className={css.section}>
            <label className={css.label} htmlFor="profile-name">
              Імʼя
            </label>
            <input
              id="profile-name"
              className={`${css.input} ${nameError ? css.inputError : ''}`}
              type="text"
              value={name}
              placeholder="Введіть нове імʼя"
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              disabled={isLoading}
            />
            {nameError ? <span className={css.errorText}>{nameError}</span> : null}
          </div>

          {/* Actions */}
          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
              disabled={isLoading}
            >
              Відмінити
            </button>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={css.buttonContent}>
                  <ClipLoader color="#ffffff" size={16} />
                  <span>Збереження...</span>
                </span>
              ) : (
                'Зберегти'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
