import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { GlassOrb } from './GlassOrb';
import * as THREE from 'three';

interface LandingSceneProps {
  onNavigate: (section: string) => void;
}

const ORBS = [
  { id: 'me', label: 'Me', icon: '🧑', color: '#10b981' },
  { id: 'library', label: 'Library', icon: '📚', color: '#10b981' },
  { id: 'projects', label: 'Projects', icon: '🚀', color: '#10b981' },
  { id: 'thoughts', label: 'Thoughts', icon: '💭', color: '#10b981' },
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
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
      />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Orbiting orbs group */}
      <group ref={groupRef}>
        {ORBS.map((orb, index) => (
          <GlassOrb
            key={orb.id}
            position={orbPositions[index].position}
            label={orb.label}
            icon={orb.icon}
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
