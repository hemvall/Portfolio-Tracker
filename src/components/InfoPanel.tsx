"use client";

import { useEffect, useState } from "react";
import { useVillageStore } from "@/lib/store";
import {
  CHAIN_CONFIGS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  AssetCategory,
  BLOCKCHAIN_OPTIONS,
} from "@/lib/types";
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  Link,
  Layers,
  Sparkles,
  Trash2,
} from "lucide-react";

const ACCENT = "#A882FF";
const DANGER = "#F87171";

export function InfoPanel() {
  const wallet = useVillageStore((s) => s.selectedWallet);
  const deselect = useVillageStore((s) => s.setSelectedWallet);
  const removeWallet = useVillageStore((s) => s.removeWallet);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Reset the confirm state 3s after it's armed, so it doesn't stay hot forever.
  useEffect(() => {
    if (!confirmDelete) return;
    const t = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(t);
  }, [confirmDelete]);

  // Reset confirm state when the selected wallet changes.
  useEffect(() => {
    setConfirmDelete(false);
  }, [wallet?.id]);

  if (!wallet) return null;

  const cfg = CHAIN_CONFIGS[wallet.chain];
  const isUp = wallet.change >= 0;
  const changeColor = isUp ? "#34D399" : "#F87171";

  // Calculate category breakdown from holdings
  const categoryBreakdown: { category: AssetCategory; value: number; pct: number }[] = [];
  const totalHoldingsVal = wallet.holdings?.reduce((s, h) => s + h.valueUsd, 0) ?? 0;
  if (wallet.holdings && wallet.holdings.length > 0) {
    const totals: Partial<Record<AssetCategory, number>> = {};
    for (const h of wallet.holdings) {
      totals[h.category] = (totals[h.category] || 0) + h.valueUsd;
    }
    for (const [cat, val] of Object.entries(totals)) {
      categoryBreakdown.push({
        category: cat as AssetCategory,
        value: val as number,
        pct: totalHoldingsVal > 0 ? ((val as number) / totalHoldingsVal) * 100 : 0,
      });
    }
    categoryBreakdown.sort((a, b) => b.value - a.value);
  }

  const blockchainLabel = wallet.blockchain
    ? BLOCKCHAIN_OPTIONS.find((o) => o.value === wallet.blockchain)?.label
    : undefined;

  return (
    <div
      className="fixed z-[300] pointer-events-auto glass-card fade-up fade-up-1"
      style={{
        top: 96,
        left: 24,
        width: 340,
        padding: "24px 24px 20px",
        borderColor: `${ACCENT}18`,
        maxHeight: "calc(100vh - 220px)",
        overflowY: "auto",
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
        { label: "Chain", value: blockchainLabel || wallet.chain.toUpperCase(), color: cfg.hex, icon: <Layers size={12} /> },
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

      {/* Personality archetype */}
      {wallet.personality && (
        <div
          style={{
            marginTop: 16,
            padding: "14px 16px",
            borderRadius: 12,
            background: `${wallet.personality.color}0A`,
            border: `1px solid ${wallet.personality.color}20`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Sparkles size={13} style={{ color: wallet.personality.color, opacity: 0.7 }} />
            <span
              className="hud-label"
              style={{ color: wallet.personality.color, fontSize: 9 }}
            >
              CRYPTO PERSONALITY
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>{wallet.personality.emoji}</span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: wallet.personality.color,
                letterSpacing: -0.3,
              }}
            >
              {wallet.personality.title}
            </span>
          </div>
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            {wallet.personality.description}
          </p>
        </div>
      )}

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div
            className="hud-label"
            style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}
          >
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: ACCENT, opacity: 0.5 }} />
            ASSET BREAKDOWN
          </div>

          {/* Category bar */}
          <div
            style={{
              display: "flex",
              gap: 2,
              height: 4,
              borderRadius: 999,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            {categoryBreakdown.map((cb) => (
              <div
                key={cb.category}
                style={{
                  flex: cb.pct,
                  background: CATEGORY_COLORS[cb.category],
                  opacity: 0.7,
                  minWidth: 3,
                  borderRadius: 999,
                }}
              />
            ))}
          </div>

          {/* Category list */}
          {categoryBreakdown.map((cb, i) => (
            <div
              key={cb.category}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 0",
                borderBottom:
                  i < categoryBreakdown.length - 1
                    ? "1px solid rgba(255,255,255,0.03)"
                    : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: CATEGORY_COLORS[cb.category],
                  }}
                />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                  {CATEGORY_LABELS[cb.category]}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="hud-value" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  ${Math.round(cb.value).toLocaleString()}
                </span>
                <span className="hud-value" style={{ fontSize: 11, color: CATEGORY_COLORS[cb.category] }}>
                  {cb.pct.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full token repartition */}
      {wallet.holdings && wallet.holdings.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div
            className="hud-label"
            style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}
          >
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: ACCENT, opacity: 0.5 }} />
            TOKEN REPARTITION
          </div>

          {/* Token bar — shows every token as a proportional segment */}
          <div
            style={{
              display: "flex",
              gap: 1,
              height: 6,
              borderRadius: 999,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            {wallet.holdings.map((h, i) => {
              const pct = totalHoldingsVal > 0 ? (h.valueUsd / totalHoldingsVal) * 100 : 0;
              return (
                <div
                  key={h.symbol + i}
                  style={{
                    flex: pct,
                    background: CATEGORY_COLORS[h.category],
                    opacity: 0.55 + (i === 0 ? 0.35 : i < 3 ? 0.2 : 0),
                    minWidth: pct > 0.5 ? 2 : 0,
                    borderRadius: 999,
                  }}
                />
              );
            })}
          </div>

          {/* Every token with % */}
          {wallet.holdings.map((h, i) => {
            const hUp = h.change24h >= 0;
            const pct = totalHoldingsVal > 0 ? (h.valueUsd / totalHoldingsVal) * 100 : 0;
            return (
              <div
                key={h.symbol + i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "5px 0",
                  borderBottom:
                    i < wallet.holdings!.length - 1
                      ? "1px solid rgba(255,255,255,0.03)"
                      : "none",
                }}
              >
                {/* Token name + category dot */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: CATEGORY_COLORS[h.category],
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                    {h.symbol}
                  </span>
                  {/* Percentage bar inline */}
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.04)",
                      marginLeft: 4,
                      marginRight: 4,
                      overflow: "hidden",
                      minWidth: 20,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: `${CATEGORY_COLORS[h.category]}88`,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>

                {/* Value, %, change */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <span
                    className="hud-value"
                    style={{ fontSize: 11, color: CATEGORY_COLORS[h.category], minWidth: 34, textAlign: "right" }}
                  >
                    {pct.toFixed(1)}%
                  </span>
                  <span className="hud-value" style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", minWidth: 48, textAlign: "right" }}>
                    ${h.valueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: hUp ? "#34D399" : "#F87171",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 42,
                      justifyContent: "flex-end",
                    }}
                  >
                    {hUp ? <ArrowUpRight size={9} strokeWidth={2.5} /> : <ArrowDownRight size={9} strokeWidth={2.5} />}
                    {Math.abs(h.change24h)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Description (for wallets without personality/holdings — legacy) */}
      {!wallet.personality && (
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
      )}

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

      {/* Delete wallet — two-click confirm */}
      <button
        type="button"
        onClick={() => {
          if (!confirmDelete) {
            setConfirmDelete(true);
            return;
          }
          const id = wallet.id;
          setConfirmDelete(false);
          deselect(null);
          removeWallet(id);
        }}
        style={{
          marginTop: 14,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          padding: "10px 14px",
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.3,
          cursor: "pointer",
          background: confirmDelete ? `${DANGER}18` : "rgba(255,255,255,0.02)",
          border: `1px solid ${confirmDelete ? `${DANGER}55` : "rgba(255,255,255,0.06)"}`,
          color: confirmDelete ? DANGER : "rgba(255,255,255,0.4)",
          transition: "background 0.2s, border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!confirmDelete) {
            e.currentTarget.style.color = DANGER;
            e.currentTarget.style.borderColor = `${DANGER}30`;
          }
        }}
        onMouseLeave={(e) => {
          if (!confirmDelete) {
            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          }
        }}
      >
        <Trash2 size={13} />
        {confirmDelete ? "Click again to confirm" : "Delete wallet"}
      </button>
    </div>
  );
}
