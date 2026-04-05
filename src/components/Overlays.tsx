"use client";

import { useEffect, useRef, useMemo } from "react";

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed w-[14px] h-[14px] pointer-events-none z-[9999]"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: "1.5px solid rgba(168,130,255,0.5)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-[3px] h-[3px] rounded-full"
        style={{ transform: "translate(-50%, -50%)", background: "rgba(168,130,255,0.9)" }}
      />
    </div>
  );
}

export function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 6px)",
      }}
    />
  );
}

export function AmbientParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 15,
      size: 1 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.25,
    })),
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
