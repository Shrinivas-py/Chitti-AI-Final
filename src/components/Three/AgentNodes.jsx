import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AGENT_COLORS = [
  '#7C3AED', '#06B6D4', '#EC4899',
  '#A855F7', '#22D3EE', '#F472B6',
];

const ORBIT_RADII  = [3.8, 4.2, 3.6, 4.0, 3.9, 4.1];
const ORBIT_SPEEDS = [0.45, 0.35, 0.55, 0.4, 0.5, 0.3];
const ORBIT_TILTS  = [0, 0.4, -0.3, 0.6, -0.2, 0.5];

export function AgentNodes({ isThinking, activeAgents }) {
  const groupRef = useRef();
  const nodeRefs = useRef(Array(6).fill(null).map(() => React.createRef()));
  const lineRefs = useRef([]);

  // Precompute initial angles
  const initialAngles = useMemo(() =>
    Array(6).fill(0).map((_, i) => (i / 6) * Math.PI * 2),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    nodeRefs.current.forEach((ref, i) => {
      if (!ref.current) return;
      const speedMult = isThinking ? 1.8 : 0.6;
      const angle = initialAngles[i] + t * ORBIT_SPEEDS[i] * speedMult;
      const r = ORBIT_RADII[i];
      const tilt = ORBIT_TILTS[i];

      ref.current.position.x = Math.cos(angle) * r;
      ref.current.position.y = Math.sin(tilt + t * 0.1) * 0.8 + Math.sin(angle * 0.5) * 0.4;
      ref.current.position.z = Math.sin(angle) * r;

      // Pulse scale
      const pulse = 1 + Math.sin(t * 3 + i * 1.2) * 0.15;
      ref.current.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={groupRef}>
      {Array(6).fill(null).map((_, i) => {
        const color = AGENT_COLORS[i];
        const isActive = activeAgents > i;
        return (
          <group key={i} ref={nodeRefs.current[i]}>
            {/* Core sphere */}
            <mesh>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isActive ? 3 : 0.5}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
            {/* Halo ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.35, 0.012, 8, 64]} />
              <meshBasicMaterial color={color} transparent opacity={isActive ? 0.8 : 0.2} />
            </mesh>
            {/* Point light per agent */}
            <pointLight
              color={color}
              intensity={isActive ? 2.5 : 0.3}
              distance={4}
            />
          </group>
        );
      })}
    </group>
  );
}
