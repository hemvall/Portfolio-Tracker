"use client";

import { useEffect, useRef } from "react";
import { useVillageStore } from "@/lib/store";
import { CHAIN_CONFIGS } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function Tooltip() {
  const wallet = useVillageStore((s) => s.hoveredWallet);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 16 + "px";
        ref.current.style.top = Math.min(e.clientY - 20, window.innerHeight - 260) + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!wallet) return null;

  const cfg = CHAIN_CONFIGS[wallet.chain];
  const isUp = wallet.change >= 0;

  return (
    <div
      ref={ref}
      className="fixed z-[200] pointer-events-none glass-card"
      style={{ padding: "16px 20px", width: 240 }}
    >
      {/* Name row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.hex }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
          {wallet.name}
        </span>
      </div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.35)",
          marginBottom: 14,
          fontStyle: "italic",
          lineHeight: 1.5,
          paddingLeft: 16,
        }}
      >
        {wallet.desc}
      </div>

      {/* Rows */}
      {[
        {
          label: "Balance",
          value: "$" + wallet.value.toLocaleString(),
          color: "#fff",
        },
        {
          label: "24h",
          value: (
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              {isUp ? <ArrowUpRight size={11} strokeWidth={2.5} /> : <ArrowDownRight size={11} strokeWidth={2.5} />}
              {isUp ? "+" : ""}{wallet.change}%
            </span>
          ),
          color: isUp ? "#34D399" : "#F87171",
        },
        { label: "Chain", value: wallet.chain.toUpperCase(), color: cfg.hex },
        { label: "Wallet", value: wallet.address, color: "rgba(255,255,255,0.3)" },
      ].map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 0",
            borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
            fontSize: 11,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>{row.label}</span>
          <span
            className="hud-value"
            style={{
              fontSize: row.label === "Wallet" ? 9 : 12,
              color: row.color as string,
            }}
          >
            {row.value}
          </span>
        </div>
      ))}

      {/* Mood */}
      <div
        style={{
          marginTop: 10,
          padding: "8px 12px",
          borderRadius: 8,
          fontSize: 11,
          textAlign: "center",
          fontWeight: 500,
          background: "rgba(168,130,255,0.06)",
          border: "1px solid rgba(168,130,255,0.08)",
          color: wallet.moodColor,
        }}
      >
        {wallet.mood}
      </div>
    </div>
  );
}
