'use client';
import { useEffect, useState } from "react";
import Header from "@/sections/HeroSection";
import Navbar from "@/components/Navbar";
import MapComponent from "@/components/openlayers-map/map";
import Footer from "@/sections/footer";
import ProjectsShowcase from "@/sections/projects";
import { ToastContainer } from "react-toastify";
import LoadingScreen from "@/components/loadingScreen";

// Type for section data
interface Section {
    id: string;
    component: React.ComponentType;
}

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [isContentVisible, setIsContentVisible] = useState(false);

    // Define sections configuration
    const sections: Section[] = [
        { id: 'home', component: Header },
        { id: 'journey', component: MapComponent },
        { id: 'projects', component: ProjectsShowcase }
    ];

    useEffect(() => {
        // Track when all critical resources are loaded
        const handleLoad = async () => {
            try {
                // Wait for document and images to load
                await Promise.all([
                    // Wait for document to be fully loaded
                    new Promise(resolve => {
                        if (document.readyState === 'complete') {
                            resolve(true);
                        } else {
                            window.addEventListener('load', () => resolve(true), { once: true });
                        }
                    }),
                    // Wait for key images to load (if any)
                    ...Array.from(document.images)
                        .filter(img => !img.complete)
                        .map(img => new Promise(resolve => {
                            img.onload = resolve;
                            img.onerror = resolve; // Handle failed image loads gracefully
                        }))
                ]);

                // Add a small delay for smooth transition
                await new Promise(resolve => setTimeout(resolve, 500));

                setIsLoading(false);

                // Trigger fade-in animation for content
                setTimeout(() => setIsContentVisible(true), 100);

            } catch (error) {
                console.error('Error during loading:', error);
                setIsLoading(false); // Ensure we don't get stuck on loading screen
            }
        };

        handleLoad();

        // Cleanup function
        return () => {
            window.removeEventListener('load', () => {});
        };
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className={`min-h-screen ${isContentVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
            <Navbar />
            <ToastContainer
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

            <main className="relative">
                {sections.map(({ id, component: Component }) => (
                    <section
                        key={id}
                        id={id}
                        className="scroll-mt-16" // Offset for fixed navbar
                    >
                        <Component />
                    </section>
                ))}
            </main>

            <Footer />
        </div>
    );
}