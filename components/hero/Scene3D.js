"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const INK = "#0d0c0b";
const PAPER = "#f2f0ec";
const OK = "#3c7a52";
const WARN = "#a9660f";

function DriftingShape({ position, scale, color, geometry, speed, scrollRef, glow }) {
  const mesh = useRef(null);
  const material = useRef(null);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const scroll = scrollRef.current;
    mesh.current.rotation.x += delta * speed * 0.12;
    mesh.current.rotation.y += delta * speed * 0.18;
    mesh.current.rotation.z = Math.sin(t * 0.15 + position[0]) * 0.2 + scroll.progress * 1.4;
    mesh.current.position.y = position[1] + Math.sin(t * 0.3 + position[0] * 2) * 0.25 - scroll.progress * 1.2;
    if (glow && material.current) {
      material.current.emissiveIntensity = 0.35 + Math.sin(t * 0.6 + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={mesh} position={position} scale={scale}>
        {geometry}
        <meshStandardMaterial
          ref={material}
          color={color}
          roughness={0.45}
          metalness={0.1}
          transparent
          opacity={0.55}
          emissive={glow ? color : "#000000"}
          emissiveIntensity={glow ? 0.35 : 0}
        />
      </mesh>
    </Float>
  );
}

function AmbientGlow({ position, color, scale }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.14} />
    </mesh>
  );
}

function Rig({ scrollRef }) {
  useFrame((state) => {
    const scroll = scrollRef.current;
    const targetX = state.pointer.x * 0.4;
    const targetY = -state.pointer.y * 0.25 - scroll.progress * 0.6;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.03;
    state.camera.position.y += (targetY + 0.3 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, -scroll.progress * 0.8, 0);
    state.camera.position.z = 6.4 + scroll.progress * 1.6;
  });
  return null;
}

const SHAPES = [
  { position: [-3.6, 0.9, -3.2], scale: 0.85, color: INK, geometry: <icosahedronGeometry args={[1, 0]} />, speed: 0.6 },
  { position: [3.6, -1, -3.6], scale: 0.75, color: OK, geometry: <torusGeometry args={[0.8, 0.28, 24, 64]} />, speed: 0.85 },
  { position: [3, 1.6, -4.4], scale: 0.5, color: WARN, geometry: <octahedronGeometry args={[1, 0]} />, speed: 1.05, glow: true },
  { position: [-3.4, -1.6, -4], scale: 0.45, color: INK, geometry: <dodecahedronGeometry args={[1, 0]} />, speed: 0.4 },
  { position: [4.2, 0.3, -5], scale: 0.4, color: INK, geometry: <icosahedronGeometry args={[1, 0]} />, speed: 0.5 },
  { position: [-4.4, 0, -5.4], scale: 0.35, color: OK, geometry: <octahedronGeometry args={[1, 0]} />, speed: 0.7 },
  { position: [4.6, -1.8, -4.2], scale: 0.32, color: OK, geometry: <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />, speed: 0.55, glow: true },
  { position: [-4.8, 1.6, -4.8], scale: 0.3, color: WARN, geometry: <sphereGeometry args={[1, 24, 24]} />, speed: 0.9 },
];

export default function Scene3D({ scrollRef, reducedMotion }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.3, 6.4], fov: 42 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color(PAPER);
        scene.fog = new THREE.Fog(PAPER, 9, 15);
      }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 5, 4]} intensity={1.35} color={PAPER} />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color={INK} />
      <pointLight position={[3, 1.8, -3]} intensity={6} color={WARN} distance={8} decay={2} />
      <pointLight position={[-3.5, -1, -3]} intensity={5} color={OK} distance={8} decay={2} />

      <AmbientGlow position={[-2.5, 1.4, -6]} color={OK} scale={2.4} />
      <AmbientGlow position={[3.2, -1.2, -6.5]} color={WARN} scale={2} />

      {SHAPES.map((shape, i) => (
        <DriftingShape key={i} {...shape} scrollRef={scrollRef} />
      ))}

      {!reducedMotion && (
        <>
          <Sparkles count={45} scale={[9, 6, 6]} size={2.2} speed={0.25} opacity={0.32} color={INK} />
          <Sparkles count={30} scale={[6, 4, 3]} size={1.4} speed={0.4} opacity={0.4} color={OK} />
        </>
      )}

      {!reducedMotion && <Rig scrollRef={scrollRef} />}

      <EffectComposer enableNormalPass={false}>
        <Bloom intensity={0.55} luminanceThreshold={0.3} luminanceSmoothing={0.3} />
      </EffectComposer>
    </Canvas>
  );
}
