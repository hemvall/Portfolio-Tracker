"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VRAD = 21;

/* ─── Ground & Paths ──────────────────────────── */
function Ground() {
  return (
    <group>
      {/* Main grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[VRAD + 8, 48]} />
        <meshLambertMaterial color={0x2d6e2d} />
      </mesh>
      {/* Outer dark ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[VRAD, VRAD + 22, 48]} />
        <meshLambertMaterial color={0x1a4a1a} />
      </mesh>
      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[7.5, 32]} />
        <meshLambertMaterial color={0xc8a87a} />
      </mesh>
      {/* Plaza ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[7.2, 7.8, 32]} />
        <meshLambertMaterial color={0xa07848} />
      </mesh>
    </group>
  );
}

function Paths() {
  const pathMat = useMemo(() => new THREE.MeshLambertMaterial({ color: 0xb09060 }), []);
  return (
    <group>
      {[0, 1, 2, 3].map((i) => {
        const a = (i * Math.PI) / 2 + Math.PI / 4;
        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, -a]}
            position={[Math.cos(a) * 11.5, 0.01, Math.sin(a) * 11.5]}
            material={pathMat}
          >
            <planeGeometry args={[2.2, 16]} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── Fountain ────────────────────────────────── */
function Fountain() {
  const dropsRef = useRef<THREE.Group>(null);
  const ripplesRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const dropData = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        angle: (i / 12) * Math.PI * 2,
        phase: (i / 12) * Math.PI * 2,
        t: i / 12,
      })),
    [],
  );

  const rippleData = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        phase: (i / 3) * Math.PI * 2,
        speed: 0.8 + i * 0.15,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;

    // Animate drops
    if (dropsRef.current) {
      dropsRef.current.children.forEach((drop, i) => {
        const d = dropData[i];
        d.t = (d.t + 0.038) % 1.0;
        const r = d.t * 2.2;
        const yy = 2.65 + d.t * 1.1 - d.t * d.t * 3.2;
        drop.position.set(Math.cos(d.angle) * r, Math.max(0.6, yy), Math.sin(d.angle) * r);
        const mat = (drop as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = d.t < 0.8 ? 0.9 : (1 - d.t) * 4.5;
      });
    }

    // Animate ripples
    if (ripplesRef.current) {
      ripplesRef.current.children.forEach((rr, i) => {
        const rd = rippleData[i];
        const ph = ((elapsed * rd.speed + rd.phase) % (Math.PI * 2));
        const scale = 0.3 + (ph / (Math.PI * 2)) * 2.4;
        rr.scale.setScalar(scale);
        const mat = (rr as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.55 - scale * 0.18);
      });
    }

    // Animate light
    if (lightRef.current) {
      lightRef.current.intensity = 2.2 + Math.sin(elapsed * 2.5) * 0.6;
    }
  });

  return (
    <group>
      {/* Basin */}
      <mesh position={[0, 0.275, 0]} castShadow>
        <cylinderGeometry args={[2.9, 3.3, 0.55, 24]} />
        <meshLambertMaterial color={0x9999aa} />
      </mesh>
      {/* Inner rim */}
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[2.6, 2.9, 0.08, 24]} />
        <meshLambertMaterial color={0x6677aa} />
      </mesh>
      {/* Water surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.56, 0]}>
        <circleGeometry args={[2.55, 32]} />
        <meshLambertMaterial color={0x44ccff} transparent opacity={0.88} />
      </mesh>
      {/* Ripples */}
      <group ref={ripplesRef}>
        {rippleData.map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.57, 0]}>
            <ringGeometry args={[0.1, 0.25, 24]} />
            <meshBasicMaterial color={0x88eeff} transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      {/* Pillar */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.26, 2.2, 10]} />
        <meshLambertMaterial color={0x9999aa} />
      </mesh>
      {/* Top bowl */}
      <mesh position={[0, 2.58, 0]}>
        <cylinderGeometry args={[0.78, 0.58, 0.24, 16]} />
        <meshLambertMaterial color={0x9999aa} />
      </mesh>
      {/* Water drops */}
      <group ref={dropsRef}>
        {dropData.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.055, 5, 5]} />
            <meshBasicMaterial color={0xaaeeff} transparent opacity={0.9} />
          </mesh>
        ))}
      </group>
      {/* Splash particles */}
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.8, 0.58 + Math.random() * 0.12, Math.sin(a) * 1.8]}>
            <sphereGeometry args={[0.04, 4, 4]} />
            <meshBasicMaterial color={0x66ddff} transparent opacity={0.6} />
          </mesh>
        );
      })}
      {/* Water light */}
      <pointLight ref={lightRef} position={[0, 1.2, 0]} color={0x00ccff} intensity={2.5} distance={8} />
    </group>
  );
}

/* ─── House ───────────────────────────────────── */
function House({
  position,
  size,
  wallColor,
  roofColor,
  church = false,
}: {
  position: [number, number, number];
  size: [number, number, number]; // w, h, d
  wallColor: number;
  roofColor: number;
  church?: boolean;
}) {
  const [w, h, d] = size;
  const bh = h * 0.58;
  const roofH = h * (church ? 0.6 : 0.42);
  const roofRadius = Math.sqrt(w * w + d * d) / 1.85;

  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, bh / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, bh, d]} />
        <meshLambertMaterial color={wallColor} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, bh + roofH / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[roofRadius, roofH, 4]} />
        <meshLambertMaterial color={roofColor} />
      </mesh>
      {/* Church spire */}
      {church && (
        <mesh position={[0, bh + roofH + 1.8, 0]} castShadow>
          <coneGeometry args={[0.38, 3.8, 6]} />
          <meshLambertMaterial color={roofColor} />
        </mesh>
      )}
      {/* Windows */}
      {[-1, 1].map((i) => (
        <mesh key={i} position={[i * w * 0.22, bh * 0.52, d / 2 + 0.01]}>
          <planeGeometry args={[0.52, 0.62]} />
          <meshBasicMaterial color={0xffee99} transparent opacity={0.8} />
        </mesh>
      ))}
      {/* Door */}
      <mesh position={[0, 0.43, d / 2 + 0.01]}>
        <planeGeometry args={[0.65, 0.85]} />
        <meshBasicMaterial color={0x3a2510} />
      </mesh>
    </group>
  );
}

/* ─── Lamp Post ───────────────────────────────── */
function LampPost({ position, lightColor }: { position: [number, number, number]; lightColor: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 3.5, 7]} />
        <meshLambertMaterial color={0x445566} />
      </mesh>
      <mesh position={[0.4, 3.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
        <meshLambertMaterial color={0x445566} />
      </mesh>
      <mesh position={[0.8, 3.4, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color={0xfffacc} />
      </mesh>
      <pointLight position={[0.8, 3.5, 0]} color={lightColor} intensity={1.8} distance={9} />
    </group>
  );
}

/* ─── Tree ────────────────────────────────────── */
const LEAF_COLORS = [0x2a8a2a, 0x3aaa3a, 0xff7722, 0xffaa11, 0xdd4422, 0x44aa66, 0x228844];

function Tree({ position, scale }: { position: [number, number, number]; scale: number }) {
  const leafColor = useMemo(() => LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)], []);
  const rotY = useMemo(() => Math.random() * Math.PI * 2, []);

  return (
    <group position={position} rotation={[0, rotY, 0]} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.21, 1.35, 6]} />
        <meshLambertMaterial color={0x6b3d15} />
      </mesh>
      {/* Canopy layers */}
      {([[1.95, 1.25], [1.35, 0.95], [0.85, 0.68]] as [number, number][]).map(([py, r], i) => (
        <mesh key={i} position={[0, py, 0]} castShadow>
          <coneGeometry args={[r, 1.1, 7]} />
          <meshLambertMaterial color={leafColor} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Bench ───────────────────────────────────── */
function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.54, 0]} castShadow>
        <boxGeometry args={[0.55, 0.11, 1.75]} />
        <meshLambertMaterial color={0x5a4020} />
      </mesh>
      {[-0.65, 0.65].map((oz, i) => (
        <mesh key={i} position={[0, 0.26, oz]}>
          <boxGeometry args={[0.48, 0.52, 0.09]} />
          <meshLambertMaterial color={0x5a4020} />
        </mesh>
      ))}
      <mesh position={[-0.26, 0.86, 0]}>
        <boxGeometry args={[0.07, 0.46, 1.75]} />
        <meshLambertMaterial color={0x5a4020} />
      </mesh>
    </group>
  );
}

/* ─── Desk with Laptop ────────────────────────── */
function Desk({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 0.9 + Math.sin(clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Desk top */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1.1, 0.06, 0.7]} />
        <meshLambertMaterial color={0x7a5530} />
      </mesh>
      {/* Legs */}
      {([[-0.48, -0.28], [0.48, -0.28], [-0.48, 0.28], [0.48, 0.28]] as [number, number][]).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.425, lz]}>
          <boxGeometry args={[0.07, 0.85, 0.07]} />
          <meshLambertMaterial color={0x7a5530} />
        </mesh>
      ))}
      {/* Laptop base */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.42, 0.04, 0.62]} />
        <meshLambertMaterial color={0x1a1a2e} />
      </mesh>
      {/* Screen */}
      <mesh position={[-0.28, 1.14, 0]} rotation={[0, 0, -0.38]}>
        <boxGeometry args={[0.04, 0.38, 0.60]} />
        <meshLambertMaterial color={0x1a1a2e} />
      </mesh>
      {/* Screen face */}
      <mesh position={[-0.185, 1.14, 0]} rotation={[0, Math.PI / 2, -0.38]}>
        <planeGeometry args={[0.36, 0.56]} />
        <meshBasicMaterial color={0x041810} />
      </mesh>
      {/* Flat line on screen */}
      <mesh position={[-0.181, 1.13, 0]} rotation={[0, Math.PI / 2, -0.38]}>
        <boxGeometry args={[0.016, 0.32, 0.01]} />
        <meshBasicMaterial color={0x26a17a} />
      </mesh>
      <pointLight ref={lightRef} position={[-0.5, 1.2, 0]} color={0x26a17a} intensity={0.9} distance={3} />
    </group>
  );
}

/* ─── Flowers ─────────────────────────────────── */
const FLOWER_COLORS = [0xff4488, 0xff8800, 0xffee00, 0xff2255, 0xaa44ff, 0xff6644];

function Flowers() {
  const flowers = useMemo(
    () =>
      Array.from({ length: 60 }, () => {
        const a = Math.random() * Math.PI * 2;
        const r = 8 + Math.random() * 12;
        return {
          x: Math.cos(a) * r,
          z: Math.sin(a) * r,
          color: FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)],
          size: 0.18 + Math.random() * 0.12,
        };
      }),
    [],
  );

  return (
    <group>
      {flowers.map((f, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[f.x, 0.02, f.z]}>
          <circleGeometry args={[f.size, 6]} />
          <meshBasicMaterial color={f.color} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Stars ───────────────────────────────────── */
function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 400;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 300;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={0xffffff} size={0.32} transparent opacity={0.65} />
    </points>
  );
}

/* ─── Tree positions ──────────────────────────── */
const TREE_POSITIONS: [number, number][] = [
  [-4, -19], [4, -19], [18, -5], [18, 5], [5, 18], [-5, 18], [-18, 5], [-18, -5],
  [11, -17], [-11, -17], [17, 11], [-17, 11],
];

const TREE_SCALES = TREE_POSITIONS.map(() => 0.65 + Math.random() * 0.45);

/* ─── Lamp configs ────────────────────────────── */
const LAMP_CONFIGS: { pos: [number, number, number]; color: number }[] = [
  { pos: [-6, 0, -6], color: 0xffdd88 },
  { pos: [6, 0, -6], color: 0xffcc66 },
  { pos: [-6, 0, 6], color: 0xffeebb },
  { pos: [6, 0, 6], color: 0xffddaa },
];

/* ─── World (exported) ────────────────────────── */
export function World() {
  return (
    <group>
      <Ground />
      <Paths />
      <Fountain />

      {/* Houses */}
      <House position={[-14, 0, -12]} size={[7, 9, 7]} wallColor={0xd4956a} roofColor={0x8b3a2a} church />
      <House position={[13, 0, -10]} size={[5, 7, 5]} wallColor={0x7abf88} roofColor={0x3d7a55} />
      <House position={[-11, 0, 9]} size={[5, 6, 5]} wallColor={0x9b8abf} roofColor={0x5a3d8a} />
      <House position={[13, 0, 9]} size={[4.5, 5.5, 4.5]} wallColor={0xe8c46a} roofColor={0xb8742a} />

      {/* Lamps */}
      {LAMP_CONFIGS.map((l, i) => (
        <LampPost key={i} position={l.pos} lightColor={l.color} />
      ))}

      {/* Trees */}
      {TREE_POSITIONS.map(([x, z], i) => (
        <Tree key={i} position={[x, 0, z]} scale={TREE_SCALES[i]} />
      ))}

      <Flowers />
      <Bench position={[-5, 0, 5]} />
      <Desk position={[-3.8, 0, 5]} />
      <Stars />
    </group>
  );
}
