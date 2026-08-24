'use client';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/loadingScreen';
import Navbar from '@/components/Navbar';
import Header from '@/sections/HeroSection';
import Footer from '@/sections/footer';

// Below the fold and heavy (OpenLayers); the map also needs `window`.
const MapComponent = dynamic(() => import('@/components/openlayers-map/map'), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading Map…</div>,
  ssr: false,
});

const ProjectsShowcase = dynamic(() => import('@/sections/projects'), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading Projects…</div>,
});

const LazyToastContainer = dynamic(
  () => import('react-toastify').then((mod) => ({ default: mod.ToastContainer })),
  { ssr: false },
);

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-darkBg p-2 sm:p-4 md:p-6 lg:p-8">
      <LoadingScreen />
      {/* Contour SVG background behind all sections. Dark mode keeps more of it:
          the strokes are teal on near-black there, so they fade much faster than
          they do over white. */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-75"
        style={{ backgroundImage: 'url(/landing-dark.svg)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-container max-w-full bg-white dark:bg-black border-2 border-black dark:border-darkBorder shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#555555] sm:border-2 md:border-4 md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:md:shadow-[12px_12px_0px_0px_#555555] min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">
        <Navbar />
        <main className="flex min-h-full flex-col">
          <div className="flex-grow">
            <section id="home">
              <Header />
            </section>
            <section id="journey">
              <MapComponent />
            </section>
            <section id="projects">
              <ProjectsShowcase />
            </section>
          </div>
          <Footer />
        </main>
        <LazyToastContainer position="bottom-right" autoClose={5000} newestOnTop theme="colored" />
      </div>
    </div>
  );
}
