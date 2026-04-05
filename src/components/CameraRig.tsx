"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useVillageStore } from "@/lib/store";

const DEFAULT_TARGET = { x: 0, y: 2, z: 0 };
const DEFAULT_RADIUS = 44;
const FOCUS_RADIUS = 18;

export function CameraRig() {
  const { camera, gl } = useThree();
  const selectedWallet = useVillageStore((s) => s.selectedWallet);
  const characterPositions = useVillageStore((s) => s.characterPositions);

  const state = useRef({
    theta: 0.3,
    phi: 0.62,
    radius: DEFAULT_RADIUS,
    dragging: false,
    pmx: 0,
    pmy: 0,
    targetTheta: 0.3,
    targetPhi: 0.62,
    targetRadius: DEFAULT_RADIUS,
  });

  const target = useRef(new THREE.Vector3(DEFAULT_TARGET.x, DEFAULT_TARGET.y, DEFAULT_TARGET.z));
  const goalTarget = useRef(new THREE.Vector3(DEFAULT_TARGET.x, DEFAULT_TARGET.y, DEFAULT_TARGET.z));

  useEffect(() => {
    const canvas = gl.domElement;
    const s = state.current;

    const onMouseDown = (e: MouseEvent) => {
      s.dragging = true;
      s.pmx = e.clientX;
      s.pmy = e.clientY;
    };
    const onMouseUp = () => { s.dragging = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!s.dragging) return;
      s.targetTheta -= (e.clientX - s.pmx) * 0.007;
      s.targetPhi = Math.max(0.2, Math.min(1.22, s.targetPhi - (e.clientY - s.pmy) * 0.006));
      s.pmx = e.clientX;
      s.pmy = e.clientY;
    };
    const onWheel = (e: WheelEvent) => {
      s.targetRadius = Math.max(5, Math.min(90, s.targetRadius + e.deltaY * 0.04));
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [gl]);

  useFrame(() => {
    const s = state.current;

    // Determine camera focus target
    if (selectedWallet) {
      const pos = characterPositions[selectedWallet.id];
      if (pos) {
        goalTarget.current.set(pos.x, 2, pos.z);
        // Zoom in when focused, but respect user scroll override
        if (!s.dragging) {
          s.targetRadius = Math.min(s.targetRadius, FOCUS_RADIUS);
          if (s.targetRadius > FOCUS_RADIUS) {
            s.targetRadius += (FOCUS_RADIUS - s.targetRadius) * 0.05;
          }
        }
      }
    } else {
      goalTarget.current.set(DEFAULT_TARGET.x, DEFAULT_TARGET.y, DEFAULT_TARGET.z);
      // Gently zoom back out when unfocused (only if closer than default)
      if (!s.dragging && s.targetRadius < DEFAULT_RADIUS * 0.7) {
        s.targetRadius += (DEFAULT_RADIUS - s.targetRadius) * 0.02;
      }
    }

    // Smoothly lerp toward the goal target
    target.current.lerp(goalTarget.current, 0.04);

    s.theta += (s.targetTheta - s.theta) * 0.08;
    s.phi += (s.targetPhi - s.phi) * 0.08;
    s.radius += (s.targetRadius - s.radius) * 0.08;

    const t = target.current;
    camera.position.set(
      t.x + s.radius * Math.sin(s.phi) * Math.sin(s.theta),
      t.y + s.radius * Math.cos(s.phi),
      t.z + s.radius * Math.sin(s.phi) * Math.cos(s.theta),
    );
    camera.lookAt(t);
  });

  return null;
}
