import { MetadataRoute } from 'next';
import { siteUrls } from '@/data/site-config';

// Required for static export
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'],
    },
    sitemap: `${siteUrls.baseUrl}/sitemap.xml`,
  };
}
