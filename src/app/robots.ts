import { MetadataRoute } from 'next'

// Required for static export
export const dynamic = 'force-static'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'],
    },
    sitemap: 'https://ronitjadhav.github.io/ronit.io/sitemap.xml',
  }
}
