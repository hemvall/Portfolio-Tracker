"use client";

import dynamic from "next/dynamic";
import { ActivityFeed } from "@/components/ActivityFeed";
import { TokenStats } from "@/components/TokenStats";
import { PortfolioBar } from "@/components/PortfolioBar";
import { ShopPanel } from "@/components/ShopPanel";
import { useShopStore } from "@/lib/shopStore";
import Link from "next/link";

const PixelScene = dynamic(
  () => import("@/components/PixelScene").then((m) => m.PixelScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white/20 animate-pulse text-xl font-mono">
          summoning your bagfolk...
        </div>
      </div>
    ),
  }
);

function ShopButton() {
  const open = useShopStore((s) => s.openShop);
  const isOpen = useShopStore((s) => s.shopOpen);
  const coins = useShopStore((s) => s.coins);

  return (
    <button
      onClick={open}
      className="glow-button flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
      style={{
        background: isOpen
          ? "linear-gradient(135deg, rgba(255, 110, 199, 0.25), rgba(191, 0, 255, 0.25))"
          : undefined,
        borderColor: isOpen ? "#ff6ec766" : undefined,
      }}
    >
      <span>🛍️</span>
      <span>shop</span>
      <span
        className="font-mono text-[10px] px-1.5 py-0.5 rounded"
        style={{ background: "rgba(255, 204, 0, 0.15)", color: "#ffcc00" }}
      >
        🪙 {coins}
      </span>
    </button>
  );
}

export default function PortfolioPage() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <h1
            className="text-xl font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #00f0ff, #bf00ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            bagfolk
          </h1>
          <span className="text-white/20 text-xs group-hover:text-white/40 transition-colors">
            &larr; back
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ShopButton />
          <span className="text-white/20 text-xs font-mono">
            0xd3g3n...420
          </span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* 2D Pixel Scene */}
        <div className="flex-1 relative">
          <PixelScene />
        </div>

        {/* Shop panel (left side) */}
        <ShopPanel />

        {/* Right sidebar */}
        <div className="absolute right-4 top-4 flex flex-col gap-3 z-10">
          <TokenStats />
          <ActivityFeed />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="p-3">
        <PortfolioBar />
      </div>
    </div>
  );
}
