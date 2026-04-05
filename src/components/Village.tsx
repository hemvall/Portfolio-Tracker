"use client";

import { Canvas } from "@react-three/fiber";
import { World } from "./World";
import { Characters } from "./Characters";
import { CameraRig } from "./CameraRig";
import { Suspense } from "react";

export function Village() {
  return (
    <Canvas
      shadows
      camera={{ fov: 52, near: 0.1, far: 300, position: [0, 30, 42] }}
      gl={{ antialias: true, pixelRatio: Math.min(window.devicePixelRatio, 2) }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <fog attach="fog" args={[0x1a2a4a, 1, 120]} />
      <color attach="background" args={[0x1a2a4a]} />

      <ambientLight intensity={1.3} color={0xaabbdd} />
      <directionalLight
        position={[25, 40, 20]}
        intensity={1.8}
        color={0xfff8e8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <directionalLight position={[-15, 20, -15]} intensity={0.35} color={0x334488} />

      <Suspense fallback={null}>
        <World />
        <Characters />
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}
