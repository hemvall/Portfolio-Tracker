"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [wallet, setWallet] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/portfolio");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #00f0ff, transparent)",
            top: "10%",
            left: "20%",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #bf00ff, transparent)",
            bottom: "10%",
            right: "15%",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]"
          style={{
            background: "radial-gradient(circle, #ff6ec7, transparent)",
            top: "50%",
            left: "60%",
            animation: "float 12s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <h1
            className="text-6xl md:text-8xl font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #00f0ff, #bf00ff, #ff6ec7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(0, 240, 255, 0.3))",
            }}
          >
            bagfolk
          </h1>
          <p className="text-white/40 text-lg md:text-xl tracking-wide">
            your bags, but alive
          </p>
        </div>

        {/* Wallet input */}
        <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="paste wallet address..."
              className="glow-input w-full px-6 py-4 text-lg"
              style={{
                boxShadow: focused
                  ? "0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 30px rgba(0, 240, 255, 0.03)"
                  : "none",
              }}
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/20 pointer-events-none"
            >
              (any input works, it&apos;s mock data)
            </div>
          </div>
          <button type="submit" className="glow-button px-6 py-4 text-lg font-semibold tracking-wide">
            summon your bagfolk
          </button>
        </form>

        {/* Floating characters preview */}
        <div className="flex gap-6 mt-8 opacity-60">
          {["🤑", "😴", "🐸", "🧘", "😭", "🤡"].map((emoji, i) => (
            <div
              key={i}
              className="text-3xl"
              style={{
                animation: `float ${2 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <p className="text-white/20 text-sm mt-4">
          6 tokens &middot; 6 personalities &middot; infinite degeneracy
        </p>
      </div>
    </div>
  );
}
