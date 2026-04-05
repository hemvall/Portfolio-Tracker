"use client";

import { useVillageStore } from "@/lib/store";
import { CHAIN_CONFIGS } from "@/lib/types";
import { X, ArrowUpRight, ArrowDownRight, Link, Layers } from "lucide-react";

const ACCENT = "#A882FF";

export function InfoPanel() {
  const wallet = useVillageStore((s) => s.selectedWallet);
  const deselect = useVillageStore((s) => s.setSelectedWallet);

  if (!wallet) return null;

  const cfg = CHAIN_CONFIGS[wallet.chain];
  const isUp = wallet.change >= 0;
  const changeColor = isUp ? "#34D399" : "#F87171";

  return (
    <div
      className="fixed z-[300] pointer-events-auto glass-card fade-up fade-up-1"
      style={{
        top: 96,
        left: 24,
        width: 320,
        padding: "24px 24px 20px",
        borderColor: `${ACCENT}18`,
      }}
    >
      {/* Close button */}
      <button
        onClick={() => deselect(null)}
        className="pill-btn"
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          padding: "5px 5px",
          borderRadius: 8,
        }}
      >
        <X size={14} />
      </button>

      {/* Chain color accent bar */}
      <div
        style={{
          width: 32,
          height: 3,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${cfg.hex}, ${cfg.hex}66)`,
          marginBottom: 16,
        }}
      />

      {/* Name + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: cfg.hex,
            boxShadow: `0 0 10px ${cfg.hex}60`,
          }}
        />
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: -0.3,
          }}
        >
          {wallet.name}
        </div>
      </div>
      <div
        className="hud-label"
        style={{
          color: cfg.hex,
          marginBottom: 18,
          paddingLeft: 20,
        }}
      >
        {cfg.label.toUpperCase()}
      </div>

      {/* Value */}
      <div
        className="hud-value"
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "#fff",
          marginBottom: 6,
          letterSpacing: -0.5,
        }}
      >
        ${wallet.value.toLocaleString()}
      </div>

      {/* 24h change badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 12px",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 600,
          background: isUp ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
          color: changeColor,
          border: `1px solid ${isUp ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)"}`,
          marginBottom: 20,
        }}
      >
        {isUp ? <ArrowUpRight size={13} strokeWidth={2.5} /> : <ArrowDownRight size={13} strokeWidth={2.5} />}
        {isUp ? "+" : ""}{Math.abs(wallet.change)}%
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginLeft: 4, fontWeight: 400 }}>24H</span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 16 }} />

      {/* Detail rows */}
      {[
        { label: "Chain", value: wallet.chain.toUpperCase(), color: cfg.hex, icon: <Layers size={12} /> },
        { label: "Wallet", value: wallet.address, color: "rgba(255,255,255,0.45)", icon: <Link size={12} /> },
      ].map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,0.3)" }}>
            {row.icon}
            <span className="hud-label" style={{ fontSize: 10 }}>{row.label}</span>
          </div>
          <span className="hud-value" style={{ fontSize: 13, color: row.color }}>
            {row.value}
          </span>
        </div>
      ))}

      {/* Description */}
      <div
        className="glass-card-sm"
        style={{
          marginTop: 16,
          padding: "12px 14px",
          fontSize: 12,
          color: "rgba(255,255,255,0.45)",
          fontStyle: "italic",
          lineHeight: 1.7,
          fontWeight: 400,
        }}
      >
        {wallet.desc}
      </div>

      {/* Mood */}
      <div
        style={{
          marginTop: 10,
          padding: "10px 14px",
          borderRadius: 10,
          fontSize: 13,
          textAlign: "center",
          fontWeight: 600,
          background: `${ACCENT}0A`,
          border: `1px solid ${ACCENT}12`,
          color: wallet.moodColor,
        }}
      >
        {wallet.mood}
      </div>
    </div>
  );
}
