import { MetadataRoute } from 'next';
import { siteUrls } from '@/data/site-config';

// Required for static export
export const dynamic = 'force-static';

// One page: crawlers drop #fragments, so section anchors are not separate URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrls.baseUrl }];
}
