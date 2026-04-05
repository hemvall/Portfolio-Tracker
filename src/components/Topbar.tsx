"use client";

import { useState } from "react";
import { useVillageStore } from "@/lib/store";
import { CHAIN_CONFIGS, ChainType } from "@/lib/types";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  EyeOff,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Plus,
} from "lucide-react";
import { AddWalletModal } from "@/components/AddWalletModal";

const ACCENT = "#A882FF";
const ACCENT_DIM = "rgba(168,130,255,0.";

/* ─── Chain allocation bar (top) ───────────────── */
function AllocationBar() {
  const wallets = useVillageStore((s) => s.wallets);
  const totalValue = useVillageStore((s) => s.totalValue);
  const total = totalValue();
  if (total === 0) return null;

  const chains: ChainType[] = ["btc", "eth", "sol", "meme", "stable"];
  const chainTotals = chains
    .map((c) => ({
      chain: c,
      value: wallets.filter((w) => w.chain === c).reduce((s, w) => s + w.value, 0),
    }))
    .filter((c) => c.value > 0);

  return (
    <div style={{ display: "flex", gap: 2, height: 3, borderRadius: 999, overflow: "hidden", width: "100%" }}>
      {chainTotals.map((ct) => (
        <div
          key={ct.chain}
          style={{
            flex: ct.value / total,
            background: CHAIN_CONFIGS[ct.chain].hex,
            opacity: 0.7,
            minWidth: 4,
            borderRadius: 999,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Bottom wallet dock ───────────────────────── */
function WalletDock() {
  const wallets = useVillageStore((s) => s.wallets);
  const selectedWallet = useVillageStore((s) => s.selectedWallet);
  const setSelected = useVillageStore((s) => s.setSelectedWallet);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
    <div
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto fade-up fade-up-3"
      style={{
        padding: "0 20px 20px",
        background: "linear-gradient(to top, rgba(6,8,15,0.95) 0%, rgba(6,8,15,0.6) 60%, transparent 100%)",
      }}
    >
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", alignItems: "stretch" }}>
        {wallets.map((w, i) => {
          const cfg = CHAIN_CONFIGS[w.chain];
          const isUp = w.change >= 0;
          const isActive = selectedWallet?.id === w.id;
          return (
            <button
              key={w.id}
              className={`glass-card-sm fade-up fade-up-${Math.min(i + 4, 8)}`}
              onClick={() => setSelected(w)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 20px",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                minWidth: 195,
                borderColor: isActive ? `${ACCENT}40` : undefined,
                background: isActive ? `${ACCENT_DIM}08)` : undefined,
                boxShadow: isActive ? `0 0 24px ${ACCENT_DIM}1), inset 0 1px 0 rgba(255,255,255,0.05)` : undefined,
              }}
            >
              {/* Chain indicator */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: cfg.hex,
                    transition: "box-shadow 0.3s",
                    boxShadow: isActive ? `0 0 12px ${cfg.hex}80` : "none",
                  }}
                />
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      inset: -4,
                      borderRadius: "50%",
                      border: `1.5px solid ${cfg.hex}60`,
                    }}
                  />
                )}
              </div>

              {/* Name + label */}
              <div style={{ textAlign: "left", minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    whiteSpace: "nowrap",
                    letterSpacing: 0.2,
                  }}
                >
                  {w.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.25)",
                    fontWeight: 400,
                  }}
                >
                  {cfg.label}
                </div>
              </div>

              {/* Value + change */}
              <div style={{ textAlign: "right", marginLeft: "auto" }}>
                <div className="hud-value" style={{ fontSize: 15, color: "#fff" }}>
                  ${w.value.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: isUp ? "#34D399" : "#F87171",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 3,
                  }}
                >
                  {isUp ? (
                    <ArrowUpRight size={12} strokeWidth={2.5} />
                  ) : (
                    <ArrowDownRight size={12} strokeWidth={2.5} />
                  )}
                  {Math.abs(w.change)}%
                </div>
              </div>
            </button>
          );
        })}

        {/* Add wallet button — inline in the dock */}
        <button
          className="glass-card-sm fade-up fade-up-8"
          onClick={() => setShowAddModal(true)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "14px 24px",
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            minWidth: 120,
            borderColor: `${ACCENT}30`,
            background: `linear-gradient(135deg, ${ACCENT}12, ${ACCENT}06)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${ACCENT}50`;
            e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT}22, ${ACCENT}10)`;
            e.currentTarget.style.boxShadow = `0 0 28px ${ACCENT}18`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${ACCENT}30`;
            e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT}12, ${ACCENT}06)`;
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: `${ACCENT}20`,
              border: `1.5px dashed ${ACCENT}50`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={15} style={{ color: ACCENT }} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT, letterSpacing: 0.3 }}>
            Add Wallet
          </span>
        </button>
      </div>
    </div>

    {showAddModal && <AddWalletModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}

/* ─── Stats sidebar ────────────────────────────── */
function StatsPanel() {
  const wallets = useVillageStore((s) => s.wallets);
  const totalValue = useVillageStore((s) => s.totalValue);
  const total = totalValue();

  const gainers = wallets.filter((w) => w.change > 0).length;
  const losers = wallets.filter((w) => w.change < 0).length;
  const flat = wallets.filter((w) => w.change === 0).length;
  const bestPerformer = [...wallets].sort((a, b) => b.change - a.change)[0];
  const worstPerformer = [...wallets].sort((a, b) => a.change - b.change)[0];

  const chains: ChainType[] = ["btc", "eth", "sol", "meme", "stable"];
  const chainBreakdown = chains
    .map((c) => ({
      chain: c,
      value: wallets.filter((w) => w.chain === c).reduce((s, w) => s + w.value, 0),
      count: wallets.filter((w) => w.chain === c).length,
    }))
    .filter((c) => c.count > 0);

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ top: 88, right: 20, width: 220 }}
    >
      {/* Chain allocation */}
      <div className="glass-card fade-up fade-up-2" style={{ padding: "16px 18px", marginBottom: 10 }}>
        <div className="hud-label" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <PieChart size={12} style={{ color: ACCENT, opacity: 0.7 }} />
          ALLOCATION
        </div>
        {chainBreakdown.map((cb, i) => {
          const pct = total > 0 ? (cb.value / total) * 100 : 0;
          const cfg = CHAIN_CONFIGS[cb.chain];
          return (
            <div key={cb.chain} className={`fade-up fade-up-${Math.min(i + 3, 8)}`} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.hex }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                    {cb.chain.toUpperCase()}
                  </span>
                </div>
                <span className="hud-value" style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                  {pct.toFixed(1)}%
                </span>
              </div>
              <div
                style={{
                  height: 3,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.04)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${cfg.hex}CC, ${cfg.hex}66)`,
                    borderRadius: 999,
                    transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Village stats */}
      <div className="glass-card fade-up fade-up-4" style={{ padding: "16px 18px" }}>
        <div className="hud-label" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <Activity size={12} style={{ color: ACCENT, opacity: 0.7 }} />
          VILLAGE STATS
        </div>

        {[
          { label: "Inhabitants", value: String(wallets.length), icon: <Users size={12} />, color: "rgba(255,255,255,0.8)" },
          { label: "Gainers", value: String(gainers), icon: <TrendingUp size={12} />, color: "#34D399" },
          { label: "Losers", value: String(losers), icon: <TrendingDown size={12} />, color: "#F87171" },
          ...(flat > 0 ? [{ label: "Flat", value: String(flat), icon: <Layers size={12} />, color: "rgba(255,255,255,0.35)" }] : []),
        ].map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px 0",
              borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,0.35)" }}>
              {row.icon}
              <span style={{ fontSize: 11, fontWeight: 400 }}>{row.label}</span>
            </div>
            <span className="hud-value" style={{ fontSize: 12, color: row.color }}>
              {row.value}
            </span>
          </div>
        ))}

        {/* Best performer */}
        {bestPerformer && (
          <div
            className="fade-up fade-up-6"
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(52,211,153,0.06)",
              border: "1px solid rgba(52,211,153,0.08)",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.5, color: "rgba(52,211,153,0.5)", marginBottom: 4 }}>
              BEST 24H
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: CHAIN_CONFIGS[bestPerformer.chain].hex, fontWeight: 600 }}>
                {bestPerformer.name}
              </span>
              <span className="hud-value" style={{ fontSize: 12, color: "#34D399", display: "flex", alignItems: "center", gap: 3 }}>
                <ArrowUpRight size={11} strokeWidth={2.5} />+{bestPerformer.change}%
              </span>
            </div>
          </div>
        )}

        {/* Worst performer */}
        {worstPerformer && worstPerformer.id !== bestPerformer?.id && (
          <div
            className="fade-up fade-up-7"
            style={{
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(248,113,113,0.05)",
              border: "1px solid rgba(248,113,113,0.08)",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.5, color: "rgba(248,113,113,0.5)", marginBottom: 4 }}>
              WORST 24H
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: CHAIN_CONFIGS[worstPerformer.chain].hex, fontWeight: 600 }}>
                {worstPerformer.name}
              </span>
              <span className="hud-value" style={{ fontSize: 12, color: "#F87171", display: "flex", alignItems: "center", gap: 3 }}>
                <ArrowDownRight size={11} strokeWidth={2.5} />{worstPerformer.change}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main HUD ─────────────────────────────────── */
export function Topbar() {
  const totalValue = useVillageStore((s) => s.totalValue);
  const wallets = useVillageStore((s) => s.wallets);
  const walletCount = wallets.length;
  const [showStats, setShowStats] = useState(true);

  const totalChange =
    wallets.length > 0
      ? wallets.reduce((sum, w) => sum + w.change * w.value, 0) / wallets.reduce((sum, w) => sum + w.value, 0)
      : 0;
  const isUp = totalChange >= 0;

  return (
    <>
      {/* Top bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
        style={{
          padding: "14px 24px 20px",
          background: "linear-gradient(to bottom, rgba(6,8,15,0.97) 0%, rgba(6,8,15,0.75) 55%, transparent 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Left: Logo */}
          <div className="fade-up fade-up-1">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${ACCENT}30, ${ACCENT}08)`,
                  border: `1px solid ${ACCENT}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Wallet size={16} style={{ color: ACCENT }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                  }}
                >
                  BAG<span style={{ color: ACCENT }}>TOWN</span>
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: 2.5,
                    fontWeight: 500,
                    marginTop: 1,
                  }}
                >
                  YOUR WALLETS, ALIVE
                </div>
              </div>
            </div>
          </div>

          {/* Center: Total portfolio */}
          <div className="fade-up fade-up-2" style={{ textAlign: "center" }}>
            <div className="hud-label" style={{ marginBottom: 4 }}>
              TOTAL PORTFOLIO
            </div>
            <div
              className="hud-value"
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -0.5,
              }}
            >
              ${totalValue().toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 5,
              }}
            >
              {/* Change badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  background: isUp ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                  color: isUp ? "#34D399" : "#F87171",
                  border: `1px solid ${isUp ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)"}`,
                }}
              >
                {isUp ? (
                  <TrendingUp size={12} strokeWidth={2.5} />
                ) : (
                  <TrendingDown size={12} strokeWidth={2.5} />
                )}
                {isUp ? "+" : ""}
                {totalChange.toFixed(2)}%
              </div>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>{"\u2022"}</span>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Users size={11} style={{ opacity: 0.5 }} />
                {walletCount} wallet{walletCount !== 1 ? "s" : ""}
              </span>
            </div>
            {/* Allocation bar */}
            <div style={{ maxWidth: 240, margin: "8px auto 0" }}>
              <AllocationBar />
            </div>
          </div>

          {/* Right: Toggle */}
          <div className="pointer-events-auto fade-up fade-up-1">
            <button
              className={`pill-btn ${showStats ? "active" : ""}`}
              onClick={() => setShowStats(!showStats)}
            >
              {showStats ? <EyeOff size={13} /> : <Eye size={13} />}
              {showStats ? "Hide" : "Stats"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats panel */}
      {showStats && <StatsPanel />}

      {/* Bottom wallet dock */}
      <WalletDock />
    </>
  );
}
