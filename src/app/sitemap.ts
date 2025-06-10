import { MetadataRoute } from 'next';

// Required for static export
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ronitjadhav.github.io/ronit.io';

  return [
    {
      url: baseUrl,
      lastModified: new Date('2024-12-01'), // Use static date for static export
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/#home`,
      lastModified: new Date('2024-12-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#journey`,
      lastModified: new Date('2024-12-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified: new Date('2024-12-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
