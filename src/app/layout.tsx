import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Metadata } from 'next';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

// Metadata needs to be exported this way in Next.js 13+
export const metadata: Metadata = {
  title: 'Ronit Jadhav - Geospatial Developer',
  description:
    "Based in Germany, I'm a Geospatial Developer and a Software Engineer. I love to work with maps, data, and code. I'm passionate about open-source, web technologies, and building cool stuff.",
  metadataBase: new URL('https://ronitjadhav.github.io'),
  openGraph: {
    type: 'website',
    title: 'Ronit Jadhav - Geospatial Developer',
    description:
      "Based in Germany, I'm a Geospatial Developer and a Software Engineer. I love to work with maps, data, and code. I'm passionate about open-source, web technologies, and building cool stuff.",
    url: 'https://ronitjadhav.github.io/ronit.io',
    siteName: 'Ronit Jadhav',
    images: [
      {
        url: 'https://ronitjadhav.github.io/ronit.io/ronit.png',
        width: 1200,
        height: 630,
        alt: 'Ronit Jadhav',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ronit Jadhav',
    description:
      "Based in Germany, I'm a Geospatial Developer and a Software Engineer. I love to work with maps, data, and code. I'm passionate about open-source, web technologies, and building cool stuff.",
    images: ['https://ronitjadhav.github.io/ronit.io/ronit.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
