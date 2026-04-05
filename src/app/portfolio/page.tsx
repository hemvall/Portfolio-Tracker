"use client";

import dynamic from "next/dynamic";
import { Topbar } from "@/components/Topbar";
import { Tooltip } from "@/components/Tooltip";
import { CustomCursor, Scanlines, AmbientParticles } from "@/components/Overlays";

const Village = dynamic(
  () => import("@/components/Village").then((m) => m.Village),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex items-center justify-center bg-[#06080f]">
        <div
          style={{
            fontFamily: "'Orbitron', monospace, sans-serif",
            fontSize: 12,
            letterSpacing: 4,
            color: "rgba(255,255,255,0.25)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        >
          BUILDING VILLAGE...
        </div>
      </div>
    ),
  },
);

export default function PortfolioPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#06080f]">
      <CustomCursor />
      <Scanlines />
      <AmbientParticles />
      <Village />
      <Topbar />
      <Tooltip />
    </div>
  );
}
