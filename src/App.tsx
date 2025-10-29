import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { LandingScene } from './scenes/LandingScene';
import { ThemeToggle } from './components/ThemeToggle';
import { Me } from './pages/Me';
import { Library } from './pages/Library';
import { Projects } from './pages/Projects';
import { Thoughts } from './pages/Thoughts';
import './App.css';

type Section = 'landing' | 'me' | 'library' | 'projects' | 'thoughts';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('landing');

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
    <div className="app">
      <ThemeToggle />

      {/* 3D Canvas - always rendered, hidden when viewing pages */}
      <div className={`canvas-container ${currentSection !== 'landing' ? 'hidden' : ''}`}>
        <Canvas
          camera={{ position: [0, 2, 10], fov: 50 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
          }}
          dpr={[1, 2]}
        >
          <LandingScene onNavigate={handleNavigate} />
        </Canvas>
      </div>

      {/* Page content */}
      <AnimatePresence mode="wait">
        {currentSection !== 'landing' && (
          <div className="page-container">
            <button className="back-button" onClick={handleBackToLanding}>
              ← Back
            </button>
            {renderPage()}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
