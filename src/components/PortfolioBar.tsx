"use client";

import { useVillageStore } from "@/lib/store";
import { CHAIN_CONFIGS, WalletData } from "@/lib/types";

function WalletCard({ wallet, isSelected }: { wallet: WalletData; isSelected: boolean }) {
  const setSelected = useVillageStore((s) => s.setSelectedWallet);
  const totalValue = useVillageStore((s) => s.totalValue);
  const cfg = CHAIN_CONFIGS[wallet.chain];
  const isUp = wallet.change >= 0;
  const pct = totalValue() > 0 ? ((wallet.value / totalValue()) * 100) : 0;

  return (
    <button
      onClick={() => setSelected(wallet)}
      style={{
        flex: "0 0 auto",
        minWidth: 155,
        background: isSelected
          ? `linear-gradient(135deg, ${cfg.hex}18, ${cfg.hex}08)`
          : "rgba(255,255,255,0.03)",
        border: isSelected
          ? `1.5px solid ${cfg.hex}55`
          : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: "12px 16px",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        }
      }}
    >
      {/* Portfolio % bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${Math.max(pct, 2)}%`,
          height: 2,
          background: cfg.hex,
          opacity: 0.5,
          borderRadius: "0 2px 0 0",
        }}
      />

      {/* Top row: name + chain */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: cfg.hex,
            boxShadow: `0 0 6px ${cfg.hex}66`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'Orbitron', monospace, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: 1,
          }}
        >
          {wallet.name}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.25)",
            marginLeft: "auto",
            fontFamily: "'Orbitron', monospace, sans-serif",
            letterSpacing: 1,
          }}
        >
          {wallet.chain.toUpperCase()}
        </span>
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: "'Orbitron', monospace, sans-serif",
          fontSize: 17,
          fontWeight: 900,
          color: "#fff",
          marginBottom: 3,
        }}
      >
        ${wallet.value.toLocaleString()}
      </div>

      {/* Change + portfolio % */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: "'Orbitron', monospace, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: isUp ? "#00FF88" : "#FF3B5C",
          }}
        >
          {isUp ? "\u25B2+" : "\u25BC"}{Math.abs(wallet.change)}%
        </span>
        <span
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'Orbitron', monospace, sans-serif",
          }}
        >
          {pct.toFixed(1)}%
        </span>
      </div>
    </button>
  );
}

export function PortfolioBar() {
  const wallets = useVillageStore((s) => s.wallets);
  const selectedWallet = useVillageStore((s) => s.selectedWallet);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto"
      style={{
        background: "linear-gradient(to top, rgba(4,6,16,0.92) 0%, rgba(4,6,16,0.75) 80%, transparent 100%)",
        padding: "16px 24px 18px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "thin",
        }}
      >
        {wallets.map((w) => (
          <WalletCard
            key={w.id}
            wallet={w}
            isSelected={selectedWallet?.id === w.id}
          />
        ))}
      </div>
    </div>
  );
}
