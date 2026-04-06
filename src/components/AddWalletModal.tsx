"use client";

import { useState } from "react";
import { useVillageStore } from "@/lib/store";
import { Blockchain, BLOCKCHAIN_OPTIONS } from "@/lib/types";
import { X, Loader2 } from "lucide-react";

const ACCENT = "#A882FF";

export function AddWalletModal({ onClose }: { onClose: () => void }) {
  const addAnalyzedWallet = useVillageStore((s) => s.addAnalyzedWallet);
  const [blockchain, setBlockchain] = useState<Blockchain>("ethereum");
  const [address, setAddress] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!address.trim()) {
      setError("Enter a wallet address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/wallet/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim(), blockchain }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();

      addAnalyzedWallet({
        address: address.trim(),
        nickname: nickname.trim() || "",
        blockchain,
        totalValue: data.totalValue,
        change24h: data.change24h,
        holdings: data.holdings,
        personality: data.personality,
      });

      onClose();
    } catch {
      setError("Failed to analyze wallet. Try again.");
      setLoading(false);
    }
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

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = `${ACCENT}40`;
      e.currentTarget.style.boxShadow = `0 0 16px ${ACCENT}10`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      e.currentTarget.style.boxShadow = "none";
    },
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
          <div className="hud-label" style={{ marginBottom: 6 }}>BLOCKCHAIN</div>
          <select
            style={{
              ...inputStyle,
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='rgba(255,255,255,0.3)' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
            }}
            value={blockchain}
            onChange={(e) => setBlockchain(e.target.value as Blockchain)}
            {...focusHandlers}
          >
            {BLOCKCHAIN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="hud-label" style={{ marginBottom: 6 }}>WALLET ADDRESS</div>
          <input
            style={inputStyle}
            placeholder="0x... or paste any address"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setError(""); }}
            {...focusHandlers}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="hud-label" style={{ marginBottom: 6 }}>
            NICKNAME <span style={{ opacity: 0.5 }}>(OPTIONAL)</span>
          </div>
          <input
            style={inputStyle}
            placeholder="My DeFi Wallet"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            {...focusHandlers}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: 11, color: "#F87171", textAlign: "center", marginBottom: 8 }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 14,
            padding: 13,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0.5,
            border: "none",
            borderRadius: 12,
            cursor: loading ? "wait" : "pointer",
            background: `linear-gradient(135deg, #8B5CF6, ${ACCENT})`,
            color: "#fff",
            transition: "all 0.25s",
            boxShadow: `0 4px 20px ${ACCENT}30`,
            opacity: loading ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = `0 4px 28px ${ACCENT}50`;
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 4px 20px ${ACCENT}30`;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {loading ? (
            <>
              <Loader2 size={15} style={{ animation: "spin 0.6s linear infinite" }} />
              Analyzing...
            </>
          ) : (
            "Spawn Inhabitant"
          )}
        </button>
      </div>
    </div>
  );
}
