import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ──────────────────────────────────────────────────────────
   LIGHTWEIGHT 3D Scene — optimised for Windows performance
   - No solid grey globe: only wireframe mesh sphere remains
   - Dense glowing star field (1400 particles in 2 layers)
   - Subtle emissive glow on all elements
────────────────────────────────────────────────────────── */

function CoreSphere({ isThinking }) {
  const wire  = useRef();
  const inner = useRef();
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = isThinking ? 1.1 : 0.45;

    // Rotate wireframe
    if (wire.current) {
      wire.current.rotation.y =  t * s * 0.14;
      wire.current.rotation.x =  t * s * 0.06;
    }
    // Spin inner icosahedron
    if (inner.current) {
      inner.current.rotation.y = t * s * 0.26;
      inner.current.rotation.z = t * s * 0.10;
    }
    if (ring1.current) ring1.current.rotation.z = t * s * 0.35;
    if (ring2.current) ring2.current.rotation.x = t * s * 0.28;
  });

  return (
    <group>
      {/* Wireframe mesh globe — large, fills screen width */}
      <mesh ref={wire}>
        <sphereGeometry args={[5.0, 20, 20]} />
        <meshBasicMaterial color="#0F8C8C" wireframe transparent opacity={0.22} />
      </mesh>

      {/* Inner glowing icosahedron core — sits below text, acts as accent glow */}
      <mesh ref={inner} position={[0, -0.8, 0]}>
        <icosahedronGeometry args={[1.1, 3]} />
        <meshStandardMaterial
          color="#025959"
          emissive="#0F8C8C"
          emissiveIntensity={isThinking ? 3.2 : 1.8}
          roughness={0.08}
          metalness={0.9}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Warm accent ring — tilted */}
      <mesh ref={ring2} rotation={[0.9, 0, 0.5]}>
        <torusGeometry args={[6.6, 0.032, 8, 180]} />
        <meshBasicMaterial color="#BF3F57" />
      </mesh>

      {/* Core glow lights — scaled distance */}
      <pointLight color="#0F8C8C" intensity={isThinking ? 30 : 14} distance={38} />
      <pointLight color="#BF3F57" intensity={isThinking ? 14 : 6}  distance={44} position={[6, 4, 0]} />
      <pointLight color="#025959" intensity={isThinking ? 10 : 4}  distance={40} position={[-4, -4, 2]} />
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
   STARS — two layers: dense small stars + few big glowing ones
────────────────────────────────────────────────────────── */
function Stars() {
  const refSmall = useRef();
  const refBig   = useRef();

  // Small dense stars — 1200 pts
  const smallPos = useMemo(() => {
    const arr = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      const r = 8 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      arr[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      arr[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i*3+2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  // Bigger glowing stars — 200 pts
  const bigPos = useMemo(() => {
    const arr = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const r = 6 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      arr[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      arr[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i*3+2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (refSmall.current) refSmall.current.rotation.y = t * 0.008;
    if (refBig.current)   refBig.current.rotation.y   = t * -0.012;
  });

  return (
    <>
      {/* Dense small stars — teal tint */}
      <points ref={refSmall}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[smallPos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#9de8e8" transparent opacity={0.55} sizeAttenuation />
      </points>

      {/* Larger glowing accent stars — warm pink */}
      <points ref={refBig}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bigPos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.11} color="#e88ca0" transparent opacity={0.75} sizeAttenuation />
      </points>
    </>
  );
}

export function Scene3D({ isThinking }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.8], fov: 78 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      frameloop="always"
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 5, 3]} intensity={0.35} />
      <Stars />
      <CoreSphere isThinking={isThinking} />
    </Canvas>
  );
}
