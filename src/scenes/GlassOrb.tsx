import { useRef, useState, useMemo } from 'react';
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
  id: string;
}

export const GlassOrb = ({ position, iconPath, angle, onClick, id }: GlassOrbProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Detect mobile devices and adjust quality settings
  const isMobile = useMemo(() => {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  // Quality settings based on device
  const quality = useMemo(() => ({
    samples: isMobile ? 16 : 64,
    resolution: isMobile ? 512 : 2048,
    sphereSegments: isMobile ? 32 : 64,
  }), [isMobile]);

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
        renderOrder={0}
        name={`orb-${id}`}
      >
        <sphereGeometry args={[1, quality.sphereSegments, quality.sphereSegments]} />
        <MeshTransmissionMaterial
          // Glass transmission for depth with environment
          transmission={0.95}
          thickness={0.4}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.025}
          // Subtle mint/seafoam green tint
          color={hovered ? '#87A795' : '#a8c5b3'}
          // Subtle glow on hover
          emissive={'#87A795'}
          emissiveIntensity={hovered ? 0.7 : 0.25}
          // Responsive quality settings - lower on mobile for better performance
          samples={quality.samples}
          resolution={quality.resolution}
          // Enable transparency for proper rendering
          transparent={true}
          toneMapped={false}
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
