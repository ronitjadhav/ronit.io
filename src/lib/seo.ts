import { Metadata } from 'next';
import { siteConfig, siteUrls, seoConfig } from '@/data/site-config';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function generateSEO({
  title = seoConfig.title,
  description = seoConfig.description,
  keywords = [],
  image = seoConfig.ogImage,
  url = siteUrls.baseUrl,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}: SEOProps = {}): Metadata {
  const allKeywords = [...seoConfig.keywords, ...keywords, ...tags];

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: seoConfig.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: siteUrls.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateArticleSchema({
  headline,
  description,
  author = siteConfig.name,
  datePublished,
  dateModified,
  image,
  url,
}: {
  headline: string;
  description: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    image,
    url,
    publisher: {
      '@type': 'Person',
      name: author,
    },
  };
}

export function generateProjectSchema({
  name,
  description,
  url,
  image,
  technologies,
  dateCreated,
}: {
  name: string;
  description: string;
  url: string;
  image: string;
  technologies: string[];
  dateCreated: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    image,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    dateCreated,
    keywords: technologies.join(', '),
  };
}
