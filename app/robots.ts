import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth-prompt',
        '/logout',
        '/profile',
        '/reset-password',
        '/locations/add',
        '/locations/*/edit',
        '/locations/*/review',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
