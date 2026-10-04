export const SITE_NAME = 'Relax Map';

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://relaxmap-front-final.vercel.app';

export const SITE_DESCRIPTION =
  'Знаходьте та діліться місцями для відпочинку в Україні';

export const SITE_LOCALE = 'uk_UA';

export const DEFAULT_OG_IMAGE = {
  url: '/images/hero-bg.webp',
  alt: 'Relax Map — місця для відпочинку в Україні',
};

const DESCRIPTION_MAX_LENGTH = 160;

/** Стискає пробіли й обрізає текст для meta description по межі слова. */
export function toMetaDescription(
  text: string | undefined,
  maxLength = DESCRIPTION_MAX_LENGTH,
): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;

  const cut = clean.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut;

  return `${base.replace(/[\s.,;:!?—-]+$/, '')}…`;
}
