'use client';

import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserById, updateUserAvatar } from '@/lib/api/clientApi';
import Spinner from '@/components/Spinner/Spinner';
import css from './ProfileInfo.module.css';

type UserData = {
  _id: string;
  name: string;
  avatar: string | null;
};

type ProfileInfoProps = {
  userId: string;
  isMyProfile: boolean;
  locationsCount?: number;
};

export default function ProfileInfo({ userId, isMyProfile, locationsCount = 12 }: ProfileInfoProps) {
  const queryClient = useQueryClient();

  const { data: user, isPending, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return await updateUserAvatar(formData);
    },
    onSuccess: (newAvatarData) => {
      queryClient.setQueryData(['user', userId], (oldUserData: UserData | undefined) => {
        if (!oldUserData) return undefined;
        
        const newAvatarUrl = newAvatarData.url; 

        if (!newAvatarUrl) return oldUserData;

        return {
          ...oldUserData,
          avatar: newAvatarUrl,
        };
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatarMutation.mutate(file);
    }
  };

  if (isPending) return <Spinner />;
  if (isError || !user) return <p className={css.error}>Не вдалося завантажити профіль</p>;

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <section className={css.section} data-section="ProfileInfo">
      <label className={`${css.avatarWrap} ${isMyProfile ? css.editable : ''}`}>
        {user.avatar ? (
          <Image 
            src={user.avatar} 
            alt={user.name || 'Користувач'} 
            width={100} 
            height={100} 
            className={css.avatar} 
          />
        ) : (
          <div className={css.avatarPlaceholder}>{firstLetter}</div>
        )}
        
        {isMyProfile && (
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        )}
      </label>

      <div className={css.info}>
        <h2 className={css.name}>{user.name}</h2>
        <p className={css.subtitle}>Статей: {locationsCount}</p>
      </div>
    </section>
  );
}