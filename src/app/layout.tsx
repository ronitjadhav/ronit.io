import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Ronit Jadhav',
    description: 'This is my personal website where I share my thoughts and experiences along with my projects.',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <body className={spaceGrotesk.className}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}