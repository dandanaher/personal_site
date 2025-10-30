import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
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
  const tiltGroupRef = useRef<THREE.Group>(null);

  // Rotate the orbs automatically and add wobble to tilt
  useFrame((state) => {
    if (groupRef.current) {
      // Simple automatic rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }

    // Add wobble to the tilt (±5 degrees over the rotation)
    if (tiltGroupRef.current) {
      const baseTilt = Math.PI / 12; // 15 degrees
      const wobble = Math.sin(state.clock.elapsedTime * 0.1) * (Math.PI / 36); // ±5 degrees
      tiltGroupRef.current.rotation.z = baseTilt + wobble;
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

      {/* Tilted orbital plane - 15 degrees with ±5 degree wobble (right side higher, left side lower) */}
      <group ref={tiltGroupRef}>
        {/* Rotating orbs group - rotates within the tilted plane, controlled by drag */}
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
      </group>
    </>
  );
};
