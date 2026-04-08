import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// MeshDistortMaterial can be heavy, let's do it purely with Three.js primitives
// for maximum compatibility and performance.

export function MCPCore({ isThinking }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const ringRef  = useRef();
  const ring2Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = isThinking ? 1.4 : 0.5;

    if (outerRef.current) {
      outerRef.current.rotation.x = Math.sin(t * 0.3) * 0.3;
      outerRef.current.rotation.y = t * speed * 0.4;
      const s = 1 + Math.sin(t * (isThinking ? 3.5 : 1.5)) * 0.06;
      outerRef.current.scale.setScalar(s);
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * speed * 0.6;
      innerRef.current.rotation.z = t * speed * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * speed * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * speed * 0.4;
    }
  });

  const innerColor  = isThinking ? '#A855F7' : '#7C3AED';
  const outerColor  = isThinking ? '#06B6D4' : '#3B82F6';
  const emissiveInt = isThinking ? 3 : 1.5;

  return (
    <group>
      {/* Outer translucent shell */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial
          color={outerColor}
          emissive={outerColor}
          emissiveIntensity={0.4}
          transparent
          opacity={0.12}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe outer shell */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1.65, 24, 24]} />
        <meshBasicMaterial color={outerColor} wireframe transparent opacity={0.15} />
      </mesh>

      {/* Inner solid core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.9, 3]} />
        <meshStandardMaterial
          color={innerColor}
          emissive={innerColor}
          emissiveIntensity={emissiveInt}
          roughness={0.05}
          metalness={0.9}
        />
      </mesh>

      {/* Orbiting ring 1 */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.02, 16, 120]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Orbiting ring 2 */}
      <mesh ref={ring2Ref} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[1.45, 0.015, 16, 120]} />
        <meshStandardMaterial
          color="#EC4899"
          emissive="#EC4899"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Lights emanating from core */}
      <pointLight color="#7C3AED" intensity={isThinking ? 12 : 5} distance={14} />
      <pointLight color="#06B6D4" intensity={isThinking ? 6 : 2} distance={20} position={[2, 1, 0]} />
      <pointLight color="#EC4899" intensity={isThinking ? 4 : 1.5} distance={15} position={[-2, -1, 0]} />
    </group>
  );
}
