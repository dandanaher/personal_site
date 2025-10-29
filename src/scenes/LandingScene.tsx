import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { GlassOrb } from './GlassOrb';
import * as THREE from 'three';

interface LandingSceneProps {
  onNavigate: (section: string) => void;
}

const ORBS = [
  { id: 'me', label: 'Me', iconPath: '/icons/me_icon.png', color: '#9dcdb4' },
  { id: 'library', label: 'Library', iconPath: '/icons/library_icon.png', color: '#9dcdb4' },
  { id: 'projects', label: 'Projects', iconPath: '/icons/projects_icon.png', color: '#9dcdb4' },
  { id: 'thoughts', label: 'Thoughts', iconPath: '/icons/thoughts_icon.png', color: '#9dcdb4' },
];

export const LandingScene = ({ onNavigate }: LandingSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Rotate the entire group of orbs slowly
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1; // Slow rotation
    }
  });

  // Calculate positions in a circle
  const radius = 4;
  const orbPositions = ORBS.map((_, index) => {
    const angle = (index / ORBS.length) * Math.PI * 2;
    return {
      position: [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius,
      ] as [number, number, number],
      angle,
    };
  });

  return (
    <>
      {/* Lighting with subtle environment for depth */}
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, 3, -5]} intensity={0.6} color="#ffffff" />

      {/* Uniform environment for consistent reflections across all orbs */}
      <Environment preset="studio" background={false} blur={0.8} />

      {/* Orbiting orbs group */}
      <group ref={groupRef}>
        {ORBS.map((orb, index) => (
          <GlassOrb
            key={orb.id}
            id={orb.id}
            position={orbPositions[index].position}
            label={orb.label}
            iconPath={orb.iconPath as string | undefined}
            angle={orbPositions[index].angle}
            onClick={() => onNavigate(orb.id)}
          />
        ))}
      </group>

      {/* Camera controls - allow user to orbit around */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        autoRotate={false}
      />
    </>
  );
};
