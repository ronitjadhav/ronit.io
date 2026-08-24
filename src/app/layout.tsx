import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Metadata } from 'next';
import { siteConfig, siteUrls, seoConfig, skills } from '@/data/site-config';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

// Metadata needs to be exported this way in Next.js 13+
export const metadata: Metadata = {
  title: {
    default: seoConfig.title,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteUrls.baseUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  metadataBase: new URL(siteUrls.baseUrl),
  alternates: {
    canonical: siteUrls.baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: seoConfig.title,
    description: seoConfig.description,
    url: siteUrls.baseUrl,
    siteName: seoConfig.siteName,
    images: [
      {
        url: seoConfig.ogImage,
        width: 1200,
        height: 630,
        alt: seoConfig.title,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.title,
    description: seoConfig.description,
    images: [seoConfig.ogImage],
    creator: siteUrls.twitterHandle,
  },
  verification: seoConfig.googleVerification ? { google: seoConfig.googleVerification } : undefined,
  category: 'technology',
  classification: 'Portfolio Website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.jobTitle,
    description: seoConfig.description,
    url: siteUrls.baseUrl,
    image: seoConfig.ogImage,
    address: {
      '@type': 'PostalAddress',
      addressCountry: siteConfig.location,
    },
    knowsAbout: skills.map((s) => s.text),
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    sameAs: [siteUrls.github, siteUrls.linkedin].filter(Boolean),
  };

  return (
    // next-themes writes `class` and `color-scheme` onto <html> from a blocking
    // script before React hydrates, so the DOM legitimately differs from the
    // server markup here. Required by next-themes; scoped to this one element.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={spaceGrotesk.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
