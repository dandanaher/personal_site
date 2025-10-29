import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { IconBillboard } from './IconBillboard';

interface GlassOrbProps {
  position: [number, number, number];
  label: string;
  iconPath?: string;
  angle: number;
  onClick: () => void;
}

export const GlassOrb = ({ position, iconPath, angle, onClick }: GlassOrbProps) => {
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
      {/* Glass sphere */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          // Glass transmission for depth with environment
          transmission={0.95}
          thickness={0.4}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.025}
          // Subtle mint/seafoam green tint
          color={hovered ? '#b8e6cf' : '#cceedd'}
          // Subtle glow on hover
          emissive={hovered ? '#a8d4bd' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
          // Backside
          backside={true}
          backsideThickness={0.3}
          // High quality rendering - increased samples and resolution for crisp glass
          samples={32}
          resolution={1024}
        />
      </mesh>

      {/* Icon billboard inside the orb - only render if iconPath exists */}
      {iconPath && <IconBillboard iconPath={iconPath} />}

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
