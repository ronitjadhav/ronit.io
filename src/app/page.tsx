'use client';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/loadingScreen';
import Navbar from '@/components/Navbar';
import Header from '@/sections/HeroSection';
import Footer from '@/sections/footer';

// Optimize dynamic imports with better loading strategies
const MapComponent = dynamic(() => import('@/components/openlayers-map/map'), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading Map...</div>,
  ssr: false,
});

const ProjectsShowcase = dynamic(() => import('@/sections/projects'), {
  loading: () => (
    <div className="h-screen flex items-center justify-center">Loading Projects...</div>
  ),
  ssr: false, // Projects don't need SSR for better performance
});

// Lazy load ToastContainer
const LazyToastContainer = dynamic(
  () => import('react-toastify').then((mod) => ({ default: mod.ToastContainer })),
  {
    ssr: false,
  },
);

// Define section interface
interface Section {
  id: string;
  component: React.ComponentType;
  priority: boolean;
}

export default function Home() {
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    isContentVisible: false,
  });

  // Define sections with priority flag
  const sections: Section[] = [
    { id: 'home', component: Header, priority: true },
    { id: 'journey', component: MapComponent, priority: false },
    { id: 'projects', component: ProjectsShowcase, priority: false },
  ];

  useEffect(() => {
    let mounted = true;

    const loadInitialContent = async () => {
      try {
        // Only wait for critical above-the-fold images
        const criticalImages = Array.from(document.images).filter((img) => {
          const rect = img.getBoundingClientRect();
          return rect.top < window.innerHeight;
        });

        await Promise.all([
          // Wait for critical images
          ...criticalImages
            .filter((img) => !img.complete)
            .map(
              (img) =>
                new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
                }),
            ),
          // Small delay for smoother transition
          new Promise((resolve) => setTimeout(resolve, 300)),
        ]);

        if (mounted) {
          setLoadingState({
            isLoading: false,
            isContentVisible: true,
          });
        }
      } catch (error) {
        console.error('Loading error:', error);
        if (mounted) {
          setLoadingState({
            isLoading: false,
            isContentVisible: true,
          });
        }
      }
    };

    loadInitialContent();

    return () => {
      mounted = false;
    };
  }, []);

  const { isLoading, isContentVisible } = loadingState;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-darkBg p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Contour SVG background behind all sections */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: 'url(/landing-dark.svg)' }}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 mx-auto w-container max-w-full bg-white dark:bg-black border-2 border-black dark:border-darkBorder shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#555555] sm:border-2 md:border-4 md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:md:shadow-[12px_12px_0px_0px_#555555] min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)] ${
          isContentVisible ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
      >
        <Navbar />
        <Suspense fallback={null}>
          <LazyToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Suspense>

        <main className="flex min-h-full flex-col">
          {loadingState.isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              <div className="flex-grow">
                {sections.map(({ id, component: Component }) => (
                  <section key={id} id={id}>
                    <Component />
                  </section>
                ))}
              </div>
              <Footer />
              <LazyToastContainer position="bottom-right" />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
