"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Blockchain } from "@/lib/types";
import { useVillageStore } from "@/lib/store";
import { ChainDropdown } from "@/components/ChainDropdown";

export default function LandingPage() {
  const [wallet, setWallet] = useState("");
  const [nickname, setNickname] = useState("");
  const [blockchain, setBlockchain] = useState<Blockchain>("ethereum");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const cursorRef = useRef<HTMLDivElement>(null);
  const addAnalyzedWallet = useVillageStore((s) => s.addAnalyzedWallet);
  const hydrate = useVillageStore((s) => s.hydrateFromStorage);
  const wallets = useVillageStore((s) => s.wallets);
  const hydrated = useVillageStore((s) => s.hydrated);

  // Hydrate from localStorage and redirect if wallets already exist
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && wallets.length > 0) {
      router.replace("/portfolio");
    }
  }, [hydrated, wallets.length, router]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.trim()) {
      setError("Enter a wallet address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/wallet/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: wallet.trim(), blockchain }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();

      addAnalyzedWallet({
        address: wallet.trim(),
        nickname: nickname.trim() || "",
        blockchain,
        totalValue: data.totalValue,
        change24h: data.change24h,
        holdings: data.holdings,
        personality: data.personality,
      });

      router.push("/portfolio");
    } catch {
      setError("Failed to analyze wallet. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="fixed w-[14px] h-[14px] pointer-events-none z-[9999]"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1.5px solid rgba(255,255,255,0.5)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[3px] h-[3px] bg-white rounded-full"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.035) 3px, rgba(0,0,0,0.035) 6px)",
        }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #627EEA, transparent)",
            top: "10%",
            left: "25%",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #9945FF, transparent)",
            bottom: "15%",
            right: "20%",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
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
            style={{
              fontFamily: "'Orbitron', monospace, sans-serif",
              fontSize: "clamp(36px, 8vw, 72px)",
              fontWeight: 900,
              letterSpacing: 4,
            }}
          >
            BAG<span style={{ color: "#627EEA" }}>TOWN</span>
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Your Wallets, Alive
          </p>
        </div>

        {/* Wallet input form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
          {/* Blockchain dropdown */}
          <div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 6,
                fontFamily: "'Orbitron', monospace, sans-serif",
              }}
            >
              BLOCKCHAIN
            </div>
            <ChainDropdown value={blockchain} onChange={setBlockchain} />
          </div>

          {/* Wallet address */}
          <div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 6,
                fontFamily: "'Orbitron', monospace, sans-serif",
              }}
            >
              WALLET ADDRESS
            </div>
            <input
              type="text"
              value={wallet}
              onChange={(e) => { setWallet(e.target.value); setError(""); }}
              placeholder="0x... or paste any address"
              className="glow-input w-full"
              style={{ padding: "12px 14px", fontSize: 13 }}
            />
          </div>

          {/* Nickname */}
          <div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 6,
                fontFamily: "'Orbitron', monospace, sans-serif",
              }}
            >
              NICKNAME <span style={{ opacity: 0.5 }}>(OPTIONAL)</span>
            </div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="My Main Wallet"
              className="glow-input w-full"
              style={{ padding: "12px 14px", fontSize: 13 }}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize: 11, color: "#F87171", textAlign: "center" }}>{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="glow-button w-full"
            style={{ padding: "14px", fontSize: 11, position: "relative" }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.6s linear infinite",
                  }}
                />
                ANALYZING WALLET...
              </span>
            ) : (
              <>ENTER THE VILLAGE &rarr;</>
            )}
          </button>

          <p
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.2)",
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            Wallet is analyzed &amp; a personality is assigned upon entry
          </p>
        </form>

        {/* Character previews */}
        <div className="flex gap-8 mt-6 opacity-50">
          {[
            { emoji: "👑", label: "BTC", color: "#F7931A" },
            { emoji: "🧐", label: "ETH", color: "#627EEA" },
            { emoji: "⚡", label: "SOL", color: "#9945FF" },
            { emoji: "🤪", label: "MEME", color: "#FFD700" },
            { emoji: "😴", label: "USDC", color: "#26A17A" },
          ].map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1"
              style={{ animation: `float ${2 + i * 0.4}s ease-in-out infinite ${i * 0.2}s` }}
            >
              <span style={{ fontSize: 24 }}>{c.emoji}</span>
              <span
                style={{
                  fontSize: 8,
                  fontFamily: "'Orbitron', monospace, sans-serif",
                  letterSpacing: 2,
                  color: c.color,
                  opacity: 0.7,
                }}
              >
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
