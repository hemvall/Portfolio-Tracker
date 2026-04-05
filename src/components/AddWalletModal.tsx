"use client";

import { useState } from "react";
import { useVillageStore } from "@/lib/store";
import { ChainType } from "@/lib/types";
import { X } from "lucide-react";

const ACCENT = "#A882FF";

export function AddWalletModal({ onClose }: { onClose: () => void }) {
  const addWallet = useVillageStore((s) => s.addWallet);
  const [chain, setChain] = useState<ChainType>("btc");
  const [address, setAddress] = useState("");
  const [value, setValue] = useState("");
  const [change, setChange] = useState("");

  const handleSubmit = () => {
    addWallet(chain, address || "0x...", parseFloat(value) || 1000, parseFloat(change) || 0);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    color: "#fff",
    fontSize: 13,
    padding: "11px 14px",
    borderRadius: 10,
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(6,8,15,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div
        className="relative z-10 glass-card fade-up fade-up-1"
        style={{ padding: "28px 26px", width: 380 }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="pill-btn"
          style={{ position: "absolute", top: 16, right: 16, padding: "5px 5px", borderRadius: 8 }}
        >
          <X size={14} />
        </button>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, letterSpacing: -0.3 }}>
          Add Wallet
        </h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 24, fontWeight: 400 }}>
          A new inhabitant joins the village
        </p>

        <div style={{ marginBottom: 14 }}>
          <div className="hud-label" style={{ marginBottom: 6 }}>CHAIN</div>
          <select
            style={inputStyle}
            value={chain}
            onChange={(e) => setChain(e.target.value as ChainType)}
          >
            <option value="btc">Bitcoin (BTC)</option>
            <option value="eth">Ethereum (ETH)</option>
            <option value="sol">Solana (SOL)</option>
            <option value="meme">Memecoin</option>
            <option value="stable">Stablecoin</option>
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="hud-label" style={{ marginBottom: 6 }}>ADDRESS</div>
          <input
            style={inputStyle}
            placeholder="0x... or 1A..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${ACCENT}40`;
              e.currentTarget.style.boxShadow = `0 0 16px ${ACCENT}10`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="hud-label" style={{ marginBottom: 6 }}>VALUE (USD)</div>
          <input
            style={inputStyle}
            type="number"
            placeholder="5000"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${ACCENT}40`;
              e.currentTarget.style.boxShadow = `0 0 16px ${ACCENT}10`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="hud-label" style={{ marginBottom: 6 }}>24H CHANGE %</div>
          <input
            style={inputStyle}
            type="number"
            placeholder="3.5"
            value={change}
            onChange={(e) => setChange(e.target.value)}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${ACCENT}40`;
              e.currentTarget.style.boxShadow = `0 0 16px ${ACCENT}10`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            marginTop: 14,
            padding: 13,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0.5,
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            background: `linear-gradient(135deg, #8B5CF6, ${ACCENT})`,
            color: "#fff",
            transition: "all 0.25s",
            boxShadow: `0 4px 20px ${ACCENT}30`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 4px 28px ${ACCENT}50`;
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 4px 20px ${ACCENT}30`;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Spawn Inhabitant
        </button>
      </div>
    </div>
  );
}
