import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { LandingScene } from './scenes/LandingScene';
import { ThemeToggle } from './components/ThemeToggle';
import { Me } from './pages/Me';
import { Library } from './pages/Library';
import { Projects } from './pages/Projects';
import { Thoughts } from './pages/Thoughts';

type Section = 'landing' | 'me' | 'library' | 'projects' | 'thoughts';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('landing');
  const [cameraSettings, setCameraSettings] = useState({
    position: [0, 2, 10] as [number, number, number],
    fov: 50
  });

  // Adjust camera for mobile/portrait screens
  useEffect(() => {
    const updateCamera = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobile = window.innerWidth <= 768;

      if (isPortrait && isMobile) {
        // Zoom out more on portrait mobile to fit all orbs
        setCameraSettings({
          position: [0, 2, 14],
          fov: 60
        });
      } else if (isMobile) {
        // Moderate zoom for landscape mobile
        setCameraSettings({
          position: [0, 2, 12],
          fov: 55
        });
      } else {
        // Default for desktop
        setCameraSettings({
          position: [0, 2, 10],
          fov: 50
        });
      }
    };

    updateCamera();
    window.addEventListener('resize', updateCamera);
    return () => window.removeEventListener('resize', updateCamera);
  }, []);

  const handleNavigate = (section: string) => {
    setCurrentSection(section as Section);
  };

  const handleBackToLanding = () => {
    setCurrentSection('landing');
  };

  const renderPage = () => {
    switch (currentSection) {
      case 'me':
        return <Me />;
      case 'library':
        return <Library />;
      case 'projects':
        return <Projects />;
      case 'thoughts':
        return <Thoughts />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <ThemeToggle />

      {/* 3D Canvas - always rendered, hidden when viewing pages */}
      <div className={`relative w-full h-full transition-opacity duration-500 ease-in-out ${currentSection !== 'landing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Canvas
          camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
          }}
          dpr={window.innerWidth <= 768 ? [1, 1.5] : [1, 2]}
        >
          <LandingScene onNavigate={handleNavigate} />
        </Canvas>
      </div>

      {/* Page content */}
      <AnimatePresence mode="wait">
        {currentSection !== 'landing' && (
          <div key={currentSection} className="absolute inset-0 z-[100] overflow-y-auto bg-background">
            <button
              className="fixed top-4 left-4 z-[1000] flex h-10 w-10 md:top-8 md:left-8 md:h-12 md:w-12 items-center justify-center rounded-full border border-[rgba(157,205,180,0.3)] bg-[rgba(157,205,180,0.15)] shadow-[0_2px_6px_rgba(157,205,180,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:border-[rgba(157,205,180,0.5)] hover:bg-[rgba(157,205,180,0.25)] hover:shadow-[0_3px_10px_rgba(157,205,180,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-95"
              onClick={handleBackToLanding}
              aria-label="Back to landing"
            >
              <img
                src="/icons/back_arrow.png"
                alt="Back"
                className="h-3/5 w-3/5 object-contain [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.2))]"
              />
            </button>
            {renderPage()}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
