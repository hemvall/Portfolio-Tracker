"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Topbar } from "@/components/Topbar";
import { Tooltip } from "@/components/Tooltip";
import { InfoPanel } from "@/components/InfoPanel";
import { CustomCursor, Scanlines, AmbientParticles } from "@/components/Overlays";
import { useVillageStore } from "@/lib/store";

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
  const hydrate = useVillageStore((s) => s.hydrateFromStorage);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#06080f]">
      <CustomCursor />
      <Scanlines />
      <AmbientParticles />
      <Village />
      <Topbar />
      <InfoPanel />
      <Tooltip />
    </div>
  );
}
