import { siteConfig, siteUrls, seoConfig } from '@/data/site-config';

export const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteUrls.baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Journey',
      item: `${siteUrls.baseUrl}#journey`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Projects',
      item: `${siteUrls.baseUrl}#projects`,
    },
  ],
};

export const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: seoConfig.siteName,
  description:
    'Professional portfolio showcasing geospatial development and software engineering projects',
  author: {
    '@type': 'Person',
    name: siteConfig.name,
  },
  url: siteUrls.baseUrl,
  dateCreated: '2024',
  inLanguage: 'en-US',
  audience: {
    '@type': 'Audience',
    audienceType: 'Employers, Clients, Recruiters',
  },
};
