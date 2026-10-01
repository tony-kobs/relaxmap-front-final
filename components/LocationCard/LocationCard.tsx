'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import type { Location } from '@/types/location';
import css from './LocationCard.module.css';

type Props = {
  location: Location;
};

export default function LocationCard({ location }: Props) {
  const { user } = useAuthStore();
  const isOwner = user?._id === location.owner?._id;
  const imageSrc = location.images?.[0] || '/placeholder.jpg';

  return (
    <div className={css.card}>
      <div className={css.imageWrapper}>
        <Image 
          src={imageSrc} 
          alt={location.name} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={css.image}
        />
        {isOwner && (
          <Link href={"/locations//edit"} className={css.editLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </Link>
        )}
      </div>
      <div className={css.content}>
        <p className={css.type}>{location.type.name}</p>
        <h3 className={css.title}>{location.name}</h3>
        <Link href={"/locations/"} className={css.viewLink}>
          Переглянути локацію
        </Link>
      </div>
    </div>
  );
}


