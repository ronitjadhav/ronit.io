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
    <div
      className={`min-h-screen ${
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

      <main className="flex min-h-screen flex-col">
        {loadingState.isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <Navbar />
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
  );
}
