"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useVillageStore } from "@/lib/store";
import { CHAIN_CONFIGS, WalletData } from "@/lib/types";

const VRAD = 21;

/* ─── Collision boxes (match the buildings) ───── */
const CBOXES = [
  { cx: 0, cz: 0, hw: 3.2, hd: 3.2 },
  { cx: -14, cz: -12, hw: 4.2, hd: 3.5 },
  { cx: 13, cz: -10, hw: 3.2, hd: 3.2 },
  { cx: -11, cz: 9, hw: 3.2, hd: 3.2 },
  { cx: 13, cz: 9, hw: 2.8, hd: 2.8 },
];

function collide(nx: number, nz: number, r: number) {
  for (const b of CBOXES) {
    const dx = nx - b.cx;
    const dz = nz - b.cz;
    const px = b.hw + r - Math.abs(dx);
    const pz = b.hd + r - Math.abs(dz);
    if (px > 0 && pz > 0) {
      if (px < pz) nx += px * Math.sign(dx);
      else nz += pz * Math.sign(dz);
    }
  }
  const d = Math.sqrt(nx * nx + nz * nz);
  if (d > VRAD - r) {
    const s = (VRAD - r) / d;
    nx *= s;
    nz *= s;
  }
  return { x: nx, z: nz };
}

function lerp(a: number, b: number, k: number) {
  return a + (b - a) * k;
}

/* ─── Name Tag (Sprite) — bigger, more readable ── */
function NameTag({ wallet }: { wallet: WalletData }) {
  const cfg = CHAIN_CONFIGS[wallet.chain];

  const texture = useMemo(() => {
    const W = 400;
    const H = 110;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d")!;

    // Background
    ctx.fillStyle = "rgba(4,6,16,0.88)";
    ctx.beginPath();
    const r = 16;
    ctx.moveTo(r, 0);
    ctx.lineTo(W - r, 0);
    ctx.quadraticCurveTo(W, 0, W, r);
    ctx.lineTo(W, H - r);
    ctx.quadraticCurveTo(W, H, W - r, H);
    ctx.lineTo(r, H);
    ctx.quadraticCurveTo(0, H, 0, H - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    // Border
    ctx.strokeStyle = cfg.hex;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Name
    ctx.fillStyle = "#fff";
    ctx.font = "bold 26px Orbitron, monospace, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(wallet.name, W / 2, 32);

    // Label
    ctx.fillStyle = cfg.hex;
    ctx.font = "15px sans-serif";
    ctx.fillText(cfg.label, W / 2, 54);

    // Value — large and prominent
    const valColor = wallet.change >= 0 ? "#00FF88" : "#FF3B5C";
    ctx.fillStyle = valColor;
    ctx.font = "bold 20px Orbitron, monospace, sans-serif";
    const sign = wallet.change >= 0 ? "\u25B2+" : "\u25BC";
    ctx.fillText(
      "$" + wallet.value.toLocaleString() + "  " + sign + Math.abs(wallet.change) + "%",
      W / 2,
      84,
    );

    // Chain indicator dot
    ctx.fillStyle = cfg.hex;
    ctx.beginPath();
    ctx.arc(W / 2 - 80, 96, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "11px sans-serif";
    ctx.fillText(wallet.chain.toUpperCase(), W / 2 - 55, 100);

    const tex = new THREE.CanvasTexture(cv);
    return tex;
  }, [wallet, cfg]);

  return (
    <sprite scale={[5.5, 1.5, 1]}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}

/* ─── Selection Ring ──────────────────────────── */
function SelectionRing({ color, scale }: { color: number; scale: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.elapsedTime;
      ringRef.current.rotation.z = t * 0.5;
      const pulse = 1.0 + Math.sin(t * 3) * 0.08;
      ringRef.current.scale.setScalar(pulse);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.5 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <ringGeometry args={[1.1 * scale, 1.4 * scale, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── Single Character ────────────────────────── */
function Character({ wallet }: { wallet: WalletData }) {
  const groupRef = useRef<THREE.Group>(null);
  const setHovered = useVillageStore((s) => s.setHoveredWallet);
  const setSelected = useVillageStore((s) => s.setSelectedWallet);
  const selectedWallet = useVillageStore((s) => s.selectedWallet);
  const updatePosition = useVillageStore((s) => s.updateCharacterPosition);
  const isSelected = selectedWallet?.id === wallet.id;
  const cfg = CHAIN_CONFIGS[wallet.chain];
  const s = cfg.scale;

  // Refs for animated parts
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leg0Ref = useRef<THREE.Mesh>(null);
  const leg1Ref = useRef<THREE.Mesh>(null);
  const arm0Ref = useRef<THREE.Mesh>(null);
  const arm1Ref = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.PointLight>(null);
  const confettiRefs = useRef<THREE.Mesh[]>([]);

  // Internal state
  const state = useRef({
    time: Math.random() * 100,
    wanderAngle: Math.random() * Math.PI * 2,
    wanderTimer: 0,
    facingAngle: 0,
    velX: 0,
    velZ: 0,
    memeTargetX: wallet.startX,
    memeTargetZ: wallet.startZ,
  });

  const headY = (0.65 + 1.05 + 0.34) * s;
  const hR = 0.34 * s;
  const tagY = (0.65 + 1.05 + hR * 2 + 0.65) * s;
  const auraColor = wallet.change > 3 ? 0x00ff88 : wallet.change >= 0 ? cfg.color : 0xff3b5c;
  const darkerColor = useMemo(() => Math.max(0, cfg.color - 0x303030), [cfg.color]);

  const confettiColors = useMemo(
    () => [0xff2222, 0x22ff22, 0x2222ff, 0xffff22, 0xff22ff, 0x22ffff],
    [],
  );

  function applyWalkRig(
    t: number,
    freq: number,
    legAmp: number,
    armAmp: number,
    bobAmp: number,
    swayAmp: number,
    leanFwd: number,
  ) {
    const phase = t * freq;
    if (leg0Ref.current && leg1Ref.current) {
      leg0Ref.current.rotation.x = lerp(leg0Ref.current.rotation.x, Math.sin(phase) * legAmp, 0.18);
      leg1Ref.current.rotation.x = lerp(leg1Ref.current.rotation.x, -Math.sin(phase) * legAmp, 0.18);
    }
    if (arm0Ref.current && arm1Ref.current) {
      arm0Ref.current.rotation.x = lerp(arm0Ref.current.rotation.x, -Math.sin(phase) * armAmp, 0.18);
      arm1Ref.current.rotation.x = lerp(arm1Ref.current.rotation.x, Math.sin(phase) * armAmp, 0.18);
      arm0Ref.current.rotation.z = lerp(arm0Ref.current.rotation.z, Math.cos(phase) * swayAmp * 0.4, 0.12);
      arm1Ref.current.rotation.z = lerp(arm1Ref.current.rotation.z, -Math.cos(phase) * swayAmp * 0.4, 0.12);
    }
    if (groupRef.current) {
      groupRef.current.position.y = lerp(groupRef.current.position.y, Math.abs(Math.sin(phase)) * bobAmp, 0.14);
    }
    if (bodyRef.current) {
      bodyRef.current.rotation.z = lerp(bodyRef.current.rotation.z, Math.sin(phase) * swayAmp, 0.12);
    }
    if (headRef.current) {
      headRef.current.rotation.z = lerp(headRef.current.rotation.z, -Math.sin(phase) * swayAmp * 0.5, 0.1);
      headRef.current.rotation.x = lerp(headRef.current.rotation.x, leanFwd, 0.08);
    }
  }

  function relaxRig() {
    if (leg0Ref.current) leg0Ref.current.rotation.x = lerp(leg0Ref.current.rotation.x, 0, 0.1);
    if (leg1Ref.current) leg1Ref.current.rotation.x = lerp(leg1Ref.current.rotation.x, 0, 0.1);
    if (arm0Ref.current) {
      arm0Ref.current.rotation.x = lerp(arm0Ref.current.rotation.x, 0, 0.1);
      arm0Ref.current.rotation.z = lerp(arm0Ref.current.rotation.z, 0, 0.1);
    }
    if (arm1Ref.current) {
      arm1Ref.current.rotation.x = lerp(arm1Ref.current.rotation.x, 0, 0.1);
      arm1Ref.current.rotation.z = lerp(arm1Ref.current.rotation.z, 0, 0.1);
    }
    if (bodyRef.current) bodyRef.current.rotation.z = lerp(bodyRef.current.rotation.z, 0, 0.1);
    if (groupRef.current) groupRef.current.position.y = lerp(groupRef.current.position.y, 0, 0.1);
  }

  function smoothFaceDir(targetAngle: number, stiffness: number) {
    const ud = state.current;
    let diff = targetAngle - ud.facingAngle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    ud.facingAngle += diff * stiffness;
    if (groupRef.current) groupRef.current.rotation.y = ud.facingAngle;
  }

  // Set initial pose for stable
  useEffect(() => {
    if (wallet.chain === "stable") {
      if (headRef.current) headRef.current.rotation.x = 0.18;
      if (leg0Ref.current) {
        leg0Ref.current.rotation.x = 1.45;
        leg0Ref.current.position.z = 0.28 * s;
        leg0Ref.current.position.y = 0.5 * s;
      }
      if (leg1Ref.current) {
        leg1Ref.current.rotation.x = 1.45;
        leg1Ref.current.position.z = 0.28 * s;
        leg1Ref.current.position.y = 0.5 * s;
      }
      if (arm0Ref.current) arm0Ref.current.rotation.x = 0.9;
      if (arm1Ref.current) arm1Ref.current.rotation.x = 0.9;
      if (bodyRef.current) bodyRef.current.rotation.x = 0.12;
    }
  }, [wallet.chain, s]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const ud = state.current;
    const dt = Math.min(delta, 0.04);
    ud.time += dt;
    const t = ud.time;
    const G = groupRef.current;

    let nx = G.position.x;
    let nz = G.position.z;

    // BTC - Majestic slow patrol
    if (wallet.chain === "btc") {
      ud.wanderAngle += 0.0038;
      const tx = wallet.startX + Math.cos(ud.wanderAngle) * 2.6;
      const tz = wallet.startZ + Math.sin(ud.wanderAngle) * 1.7;
      ud.velX = lerp(ud.velX, (tx - G.position.x) * 1.8, 0.12);
      ud.velZ = lerp(ud.velZ, (tz - G.position.z) * 1.8, 0.12);
      nx = G.position.x + ud.velX * dt;
      nz = G.position.z + ud.velZ * dt;
      const speed = Math.sqrt(ud.velX * ud.velX + ud.velZ * ud.velZ);
      if (speed > 0.01) smoothFaceDir(Math.atan2(ud.velX, ud.velZ), 0.07);
      applyWalkRig(t, 0.9, 0.14, 0.1, 0.025, 0.012, 0.0);
    }

    // ETH - Pendulum pacing
    else if (wallet.chain === "eth") {
      const tx = wallet.startX + Math.sin(t * 0.52) * 3.0;
      const tz = wallet.startZ + Math.sin(t * 0.28) * 1.3;
      ud.velX = lerp(ud.velX, (tx - G.position.x) * 2.0, 0.11);
      ud.velZ = lerp(ud.velZ, (tz - G.position.z) * 2.0, 0.11);
      nx = G.position.x + ud.velX * dt;
      nz = G.position.z + ud.velZ * dt;
      const speed = Math.sqrt(ud.velX * ud.velX + ud.velZ * ud.velZ);
      if (speed > 0.06) smoothFaceDir(Math.atan2(ud.velX, ud.velZ), 0.1);
      const isReading = speed < 0.12;
      if (isReading) {
        relaxRig();
        if (headRef.current) headRef.current.rotation.x = lerp(headRef.current.rotation.x, 0.26, 0.06);
      } else {
        applyWalkRig(t, 1.1, 0.22, 0.15, 0.038, 0.016, 0.05);
        if (headRef.current) headRef.current.rotation.x = lerp(headRef.current.rotation.x, 0.05, 0.08);
      }
    }

    // SOL - Runs laps around the fountain (center 0,0)
    else if (wallet.chain === "sol") {
      const FOUNTAIN_R = 5.0; // orbit radius just outside the basin
      ud.wanderAngle += 0.018;
      const tx = Math.cos(ud.wanderAngle) * FOUNTAIN_R;
      const tz = Math.sin(ud.wanderAngle) * FOUNTAIN_R;
      ud.velX = lerp(ud.velX, (tx - G.position.x) * 2.6, 0.14);
      ud.velZ = lerp(ud.velZ, (tz - G.position.z) * 2.6, 0.14);
      nx = G.position.x + ud.velX * dt;
      nz = G.position.z + ud.velZ * dt;
      const speed = Math.sqrt(ud.velX * ud.velX + ud.velZ * ud.velZ);
      if (speed > 0.05) smoothFaceDir(Math.atan2(ud.velX, ud.velZ), 0.13);
      applyWalkRig(t, 2.6, 0.36, 0.26, 0.08, 0.025, 0.1);
      if (bodyRef.current) bodyRef.current.rotation.x = lerp(bodyRef.current.rotation.x, -0.1, 0.09);
    }

    // MEME - Chaotic wander
    else if (wallet.chain === "meme") {
      ud.wanderTimer += dt;
      if (ud.wanderTimer > 0.9 + Math.random() * 0.6) {
        const spread = 4.0;
        ud.memeTargetX = wallet.startX + (Math.random() - 0.5) * spread * 2;
        ud.memeTargetZ = wallet.startZ + (Math.random() - 0.5) * spread * 2;
        ud.wanderTimer = 0;
      }
      ud.velX = lerp(ud.velX, (ud.memeTargetX - G.position.x) * 2.8, 0.14);
      ud.velZ = lerp(ud.velZ, (ud.memeTargetZ - G.position.z) * 2.8, 0.14);
      nx = G.position.x + ud.velX * dt;
      nz = G.position.z + ud.velZ * dt;
      const speed = Math.sqrt(ud.velX * ud.velX + ud.velZ * ud.velZ);
      if (speed > 0.05) smoothFaceDir(Math.atan2(ud.velX, ud.velZ), 0.13);
      applyWalkRig(t, 6.5, 0.52, 0.42, 0.28, 0.06, 0.0);
      G.rotation.y += Math.sin(t * 4.5) * 0.03;

      confettiRefs.current.forEach((cf, i) => {
        if (!cf) return;
        const phase = (i / 6) * Math.PI * 2;
        const a = phase + t * 2.2;
        const cy = 2.3 + Math.sin(t * 3 + phase) * 0.18;
        cf.position.x = lerp(cf.position.x, Math.cos(a) * 0.72, 0.2);
        cf.position.y = lerp(cf.position.y, cy, 0.15);
        cf.position.z = lerp(cf.position.z, Math.sin(a) * 0.72, 0.2);
      });
    }

    // STABLE - Seated at desk
    else if (wallet.chain === "stable") {
      nx = wallet.startX;
      nz = wallet.startZ;
      G.position.y = lerp(G.position.y, 0, 0.08);
      G.rotation.y = lerp(G.rotation.y, Math.PI * 0.5, 0.05);
      if (bodyRef.current) bodyRef.current.rotation.z = lerp(bodyRef.current.rotation.z, Math.sin(t * 0.55) * 0.012, 0.04);
      if (headRef.current) {
        headRef.current.rotation.x = lerp(headRef.current.rotation.x, 0.18 + Math.max(0, Math.sin(t * 0.28)) * 0.2, 0.04);
        headRef.current.rotation.z = lerp(headRef.current.rotation.z, Math.sin(t * 0.16) * 0.018, 0.04);
      }
      if (leg0Ref.current) leg0Ref.current.rotation.x = lerp(leg0Ref.current.rotation.x, 1.45, 0.06);
      if (leg1Ref.current) leg1Ref.current.rotation.x = lerp(leg1Ref.current.rotation.x, 1.45, 0.06);
      if (arm0Ref.current) arm0Ref.current.rotation.x = lerp(arm0Ref.current.rotation.x, 0.9 + Math.sin(t * 2.2) * 0.04, 0.08);
      if (arm1Ref.current) arm1Ref.current.rotation.x = lerp(arm1Ref.current.rotation.x, 0.9 - Math.sin(t * 2.2) * 0.04, 0.08);
    }

    // Collision
    const pos = collide(nx, nz, 0.65);
    G.position.x = pos.x;
    G.position.z = pos.z;

    // Report position to store for camera tracking
    updatePosition(wallet.id, pos.x, pos.z);

    // Aura pulse
    if (auraRef.current) {
      const base = wallet.change > 5 ? 1.4 : wallet.change >= 0 ? 0.82 : 0.5;
      const target = base + Math.sin(t * (wallet.chain === "meme" ? 4.2 : 1.5)) * 0.25;
      auraRef.current.intensity = lerp(auraRef.current.intensity, target, 0.12);
    }
  });

  const handleClick = useCallback((e: THREE.Event) => {
    (e as any).stopPropagation?.();
    setSelected(wallet);
  }, [wallet, setSelected]);

  const handlePointerOver = useCallback(() => setHovered(wallet), [wallet, setHovered]);
  const handlePointerOut = useCallback(() => setHovered(null), [setHovered]);

  return (
    <group
      ref={groupRef}
      position={[wallet.startX, 0, wallet.startZ]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Selection ring */}
      {isSelected && <SelectionRing color={cfg.color} scale={s} />}

      {/* Body */}
      <mesh ref={bodyRef} position={[0, (0.65 + 1.05 / 2) * s, 0]} castShadow>
        <boxGeometry args={[0.62 * s, 1.05 * s, 0.4 * s]} />
        <meshLambertMaterial color={cfg.color} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, headY, 0]} castShadow>
        <sphereGeometry args={[hR, 10, 10]} />
        <meshLambertMaterial color={0xf5d5a0} />
      </mesh>

      {/* Eyes */}
      {[-0.1, 0.1].map((ex, i) => (
        <mesh key={i} position={[ex * s, headY + 0.04 * s, hR * 0.9]}>
          <sphereGeometry args={[0.048 * s, 5, 5]} />
          <meshBasicMaterial color={wallet.change < 0 ? 0x881111 : 0x111111} />
        </mesh>
      ))}

      {/* Mouth */}
      <mesh position={[0, headY - 0.065 * s, hR * 0.88]} rotation={[0, 0, wallet.change >= 0 ? 0 : Math.PI]}>
        <torusGeometry args={[0.085 * s, 0.016 * s, 5, 10, Math.PI]} />
        <meshBasicMaterial color={0x882211} />
      </mesh>

      {/* Legs */}
      <mesh ref={leg0Ref} position={[-0.14 * s, 0.31 * s, 0]}>
        <boxGeometry args={[0.19 * s, 0.62 * s, 0.19 * s]} />
        <meshLambertMaterial color={darkerColor} />
      </mesh>
      <mesh ref={leg1Ref} position={[0.14 * s, 0.31 * s, 0]}>
        <boxGeometry args={[0.19 * s, 0.62 * s, 0.19 * s]} />
        <meshLambertMaterial color={darkerColor} />
      </mesh>

      {/* Arms */}
      <mesh ref={arm0Ref} position={[-0.46 * s, (0.65 + 0.82) * s, 0]}>
        <boxGeometry args={[0.17 * s, 0.58 * s, 0.17 * s]} />
        <meshLambertMaterial color={cfg.color} />
      </mesh>
      <mesh ref={arm1Ref} position={[0.46 * s, (0.65 + 0.82) * s, 0]}>
        <boxGeometry args={[0.17 * s, 0.58 * s, 0.17 * s]} />
        <meshLambertMaterial color={cfg.color} />
      </mesh>

      {/* BTC Accessories */}
      {wallet.chain === "btc" && (
        <>
          <mesh position={[0, headY + hR + 0.16 * s, 0]}>
            <cylinderGeometry args={[0.19 * s, 0.25 * s, 0.36 * s, 8]} />
            <meshLambertMaterial color={0xffd700} />
          </mesh>
          <mesh position={[0, headY + hR - 0.01 * s, 0]}>
            <cylinderGeometry args={[0.36 * s, 0.36 * s, 0.053 * s, 12]} />
            <meshLambertMaterial color={0xffd700} />
          </mesh>
          <mesh position={[0.52 * s, 0.48 * s, 0]} rotation={[0, 0, 0.18]}>
            <cylinderGeometry args={[0.036, 0.036, 1.6 * s, 6]} />
            <meshLambertMaterial color={0xffd700} />
          </mesh>
        </>
      )}

      {/* ETH Accessories */}
      {wallet.chain === "eth" && (
        <>
          {[-0.12, 0.12].map((ex, i) => (
            <mesh key={i} position={[ex * s, headY + 0.04 * s, hR * 0.84]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.085 * s, 0.012, 5, 12]} />
              <meshBasicMaterial color={0xaaaacc} />
            </mesh>
          ))}
          <mesh position={[-0.5 * s, (0.65 + 0.85) * s, 0.1]} rotation={[0, 0, 0.28]}>
            <boxGeometry args={[0.3 * s, 0.38 * s, 0.065]} />
            <meshLambertMaterial color={0xcc3333} />
          </mesh>
        </>
      )}

      {/* SOL Accessories */}
      {wallet.chain === "sol" && (
        <mesh position={[0, headY + 0.08 * s, 0]}>
          <torusGeometry args={[hR * 1.04, 0.045 * s, 6, 16]} />
          <meshBasicMaterial color={0xff44ff} />
        </mesh>
      )}

      {/* MEME Accessories */}
      {wallet.chain === "meme" && (
        <>
          <mesh position={[0, headY + hR + 0.22 * s, 0]}>
            <coneGeometry args={[0.21 * s, 0.5 * s, 8]} />
            <meshLambertMaterial color={0xff3399} />
          </mesh>
          {confettiColors.map((col, i) => (
            <mesh key={i} ref={(el) => { if (el) confettiRefs.current[i] = el; }}>
              <boxGeometry args={[0.08, 0.08, 0.02]} />
              <meshBasicMaterial color={col} />
            </mesh>
          ))}
        </>
      )}

      {/* Aura light */}
      <pointLight
        ref={auraRef}
        position={[0, 1.4 * s, 0]}
        color={auraColor}
        intensity={wallet.change > 5 ? 1.3 : 0.75}
        distance={5.5}
      />

      {/* Selection highlight light */}
      {isSelected && (
        <pointLight position={[0, 3 * s, 0]} color={cfg.color} intensity={2.5} distance={8} />
      )}

      {/* Name tag */}
      <group position={[0, tagY, 0]}>
        <NameTag wallet={wallet} />
      </group>
    </group>
  );
}

/* ─── Characters Container ────────────────────── */
export function Characters() {
  const wallets = useVillageStore((s) => s.wallets);

  return (
    <group>
      {wallets.map((w) => (
        <Character key={w.id} wallet={w} />
      ))}
    </group>
  );
}
