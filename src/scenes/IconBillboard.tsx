import { useRef, Suspense, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface IconBillboardProps {
  iconPath: string;
  scale?: number;
}

const BillboardContent = ({ iconPath, scale = 1.3 }: IconBillboardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, iconPath);

  // Configure texture for crisp, high-quality rendering
  useEffect(() => {
    if (texture) {
      // Disable mipmaps completely - they cause downsampling blur
      texture.generateMipmaps = false;
      // Use linear filtering for smooth, anti-aliased rendering
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      // Clamp to edge to prevent texture bleeding
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      // Set proper color space for correct rendering
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Billboard behavior - always face the camera
  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} renderOrder={1}>
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        opacity={1.0}
        color={new THREE.Color(2.5, 2.5, 2.5)}
        side={THREE.DoubleSide}
        depthWrite={true}
        depthTest={true}
        toneMapped={false}
      />
    </mesh>
  );
};

export const IconBillboard = ({ iconPath, scale = 1.3 }: IconBillboardProps) => {
  return (
    <Suspense fallback={null}>
      <BillboardContent iconPath={iconPath} scale={scale} />
    </Suspense>
  );
};
