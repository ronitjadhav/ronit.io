import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Metadata } from 'next';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap', // Better font loading performance
  preload: true,
  variable: '--font-space-grotesk',
});

// Metadata needs to be exported this way in Next.js 13+
export const metadata: Metadata = {
  title: {
    default: 'Ronit Jadhav - Geospatial Developer & Software Engineer',
    template: '%s | Ronit Jadhav',
  },
  description:
    "Based in Germany, I'm a Geospatial Developer and Software Engineer specializing in maps, data visualization, and web technologies. Expert in ArcGIS, QGIS, OpenLayers, Python, and JavaScript.",
  keywords: [
    'Geospatial Developer',
    'Software Engineer',
    'Germany',
    'ArcGIS',
    'QGIS',
    'OpenLayers',
    'Leaflet',
    'Python',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'PostGIS',
    'GIS',
    'Web Development',
    'Data Visualization',
    'Maps',
    'Cartography',
    'Remote Sensing',
  ],
  authors: [{ name: 'Ronit Jadhav', url: 'https://ronitjadhav.github.io' }],
  creator: 'Ronit Jadhav',
  publisher: 'Ronit Jadhav',
  metadataBase: new URL('https://ronitjadhav.github.io'),
  alternates: {
    canonical: 'https://ronitjadhav.github.io/ronit.io',
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
    title: 'Ronit Jadhav - Geospatial Developer & Software Engineer',
    description:
      "Based in Germany, I'm a Geospatial Developer and Software Engineer specializing in maps, data visualization, and web technologies. Expert in ArcGIS, QGIS, OpenLayers, Python, and JavaScript.",
    url: 'https://ronitjadhav.github.io/ronit.io',
    siteName: 'Ronit Jadhav Portfolio',
    images: [
      {
        url: 'https://ronitjadhav.github.io/ronit.io/ronit.png',
        width: 1200,
        height: 630,
        alt: 'Ronit Jadhav - Geospatial Developer & Software Engineer',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ronit Jadhav - Geospatial Developer & Software Engineer',
    description:
      "Based in Germany, I'm a Geospatial Developer and Software Engineer specializing in maps, data visualization, and web technologies.",
    images: ['https://ronitjadhav.github.io/ronit.io/ronit.png'],
    creator: '@ronitjadhav', // Add your Twitter handle if you have one
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual code when available
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
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
    name: 'Ronit Jadhav',
    jobTitle: 'Geospatial Developer & Software Engineer',
    description:
      'Geospatial Developer and Software Engineer specializing in maps, data visualization, and web technologies.',
    url: 'https://ronitjadhav.github.io/ronit.io',
    image: 'https://ronitjadhav.github.io/ronit.io/ronit.png',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Germany',
    },
    knowsAbout: [
      'Geospatial Development',
      'Software Engineering',
      'ArcGIS',
      'QGIS',
      'OpenLayers',
      'Leaflet',
      'Python',
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'PostGIS',
      'Web Development',
      'Data Visualization',
      'Geographic Information Systems',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    sameAs: [
      'https://github.com/ronitjadhav',
      'https://linkedin.com/in/ronitjadhav',
      // Add other social profiles as needed
    ],
  };

  return (
    <html lang="en">
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
