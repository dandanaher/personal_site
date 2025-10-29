import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface GlassOrbProps {
  position: [number, number, number];
  label: string;
  icon: string;
  angle: number;
  onClick: () => void;
}

export const GlassOrb = ({ position, angle, onClick }: GlassOrbProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate subtle floating motion
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle bobbing motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + angle) * 0.1;

      // Scale effect on hover
      const targetScale = hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          // Glass properties
          transmission={1}
          thickness={0.5}
          roughness={0.1}
          ior={1.5}
          chromaticAberration={0.02}
          // Color and emission
          color={hovered ? '#34d399' : '#10b981'}
          emissive={hovered ? '#34d399' : '#10b981'}
          emissiveIntensity={hovered ? 0.5 : 0.1}
          // Performance
          samples={16}
          resolution={256}
        />
      </mesh>

      {/* Invisible larger hitbox for easier interaction */}
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        visible={false}
      >
        <sphereGeometry args={[1.3, 16, 16]} />
      </mesh>
    </group>
  );
};
