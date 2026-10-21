import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-darkBg p-4">
      <div className="w-full max-w-md bg-bg dark:bg-black border-4 border-black dark:border-darkBorder shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#555555] p-6 sm:p-10 text-center text-text dark:text-darkText">
        <p className="text-7xl sm:text-8xl font-heading">404</p>
        <h1 className="mt-4 text-2xl font-heading">Off the map</h1>
        <p className="mt-2">This page doesn&apos;t exist, or it has moved.</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">Back to the homepage</Link>
        </Button>
      </div>
    </main>
  );
}
