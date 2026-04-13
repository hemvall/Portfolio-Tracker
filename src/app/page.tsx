"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Blockchain } from "@/lib/types";
import { useVillageStore } from "@/lib/store";
import { ChainDropdown } from "@/components/ChainDropdown";
import { Village } from "@/components/Village";
import logo from "@/assets/logo.png";

const ACCENT = "#627EEA";

export default function LandingPage() {
  const [wallet, setWallet] = useState("");
  const [nickname, setNickname] = useState("");
  const [blockchain, setBlockchain] = useState<Blockchain>("ethereum");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const addAnalyzedWallet = useVillageStore((s) => s.addAnalyzedWallet);
  const hydrate = useVillageStore((s) => s.hydrateFromStorage);
  const wallets = useVillageStore((s) => s.wallets);
  const hydrated = useVillageStore((s) => s.hydrated);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (hydrated && wallets.length > 0) router.replace("/portfolio");
  }, [hydrated, wallets.length, router]);

  useEffect(() => {
    let trailX = 0, trailY = 0;
    const move = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    const trail = () => {
      trailX += (mouseRef.current.x - trailX) * 0.09;
      trailY += (mouseRef.current.y - trailY) * 0.09;
      if (cursorTrailRef.current) {
        cursorTrailRef.current.style.left = trailX + "px";
        cursorTrailRef.current.style.top = trailY + "px";
      }
      requestAnimationFrame(trail);
    };
    window.addEventListener("mousemove", move);
    trail();
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.trim()) { setError("Enter a wallet address"); return; }
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

  const characters = [
    { emoji: "👑", label: "BTC", color: "#F7931A" },
    { emoji: "🧐", label: "ETH", color: ACCENT },
    { emoji: "⚡", label: "SOL", color: "#9945FF" },
    { emoji: "🤪", label: "MEME", color: "#FFD700" },
    { emoji: "😴", label: "USDC", color: "#34D399" },
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; cursor: none !important; }

        .lp-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #06080f;
          font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
          color: #fff;
        }

        /* ── Village ── */
        .lp-village {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
        }
        .lp-village > * { width: 100% !important; height: 100% !important; }

        /* ── Atmosphere ── */
        .lp-fog-top {
          position: fixed; top: 0; left: 0; right: 0; z-index: 2;
          height: 45%; pointer-events: none;
          background: linear-gradient(to bottom, rgba(6,8,15,0.96) 0%, rgba(6,8,15,0.6) 60%, transparent 100%);
        }
        .lp-fog-bottom {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 2;
          height: 44%; pointer-events: none;
          background: linear-gradient(to top, rgba(6,8,15,0.96) 0%, rgba(6,8,15,0.55) 55%, transparent 100%);
        }
        .lp-vignette {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: radial-gradient(ellipse 72% 68% at 50% 50%, transparent 20%, rgba(6,8,15,0.42) 62%, rgba(6,8,15,0.84) 100%);
        }
        /* Soft accent bloom */
        .lp-bloom {
          position: fixed; z-index: 3; pointer-events: none;
          width: 700px; height: 500px;
          left: 50%; top: 50%; transform: translate(-50%, -52%);
          background: radial-gradient(ellipse at center, ${ACCENT}0e 0%, ${ACCENT}04 50%, transparent 72%);
          animation: lp-breathe 7s ease-in-out infinite;
        }
        @keyframes lp-breathe {
          0%,100% { transform: translate(-50%,-52%) scale(1);   opacity: 1;   }
          50%      { transform: translate(-50%,-52%) scale(1.1); opacity: 0.75; }
        }

        /* ── Cursor ── */
        .lp-cursor {
          position: fixed; width: 8px; height: 8px;
          background: ${ACCENT}; border-radius: 50%;
          pointer-events: none; z-index: 10000;
          transform: translate(-50%,-50%);
          box-shadow: 0 0 10px ${ACCENT}, 0 0 22px ${ACCENT}55;
        }
        .lp-trail {
          position: fixed; width: 28px; height: 28px;
          border: 1.5px solid ${ACCENT}35; border-radius: 50%;
          pointer-events: none; z-index: 9999;
          transform: translate(-50%,-50%);
        }

        /* ── Content ── */
        .lp-content {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; align-items: center;
          padding: 0 20px; width: 100%; max-width: 420px;
        }

        /* ── Logo ── */
        .lp-logo {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          margin-bottom: 28px;
          animation: lp-rise 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        .lp-logo-icon {
          width: 56px; height: 56px; border-radius: 18px;
          background: linear-gradient(145deg, ${ACCENT}28, ${ACCENT}0a);
          border: 1px solid ${ACCENT}22;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 6px ${ACCENT}08, 0 8px 24px rgba(0,0,0,0.4);
        }
        .lp-logo-name {
          font-size: 38px; font-weight: 800; letter-spacing: 2px; line-height: 1;
        }
        .lp-logo-name span { color: ${ACCENT}; }
        .lp-logo-tag {
          font-size: 10px; font-weight: 500;
          color: rgba(255,255,255,0.22); letter-spacing: 3px;
          text-transform: uppercase;
        }

        /* ── Card ── */
        .lp-card {
          width: 100%;
          background: rgba(12,16,28,0.75);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          padding: 28px 24px 24px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 24px 64px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(255,255,255,0.06);
          animation: lp-rise 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }

        .lp-form { display: flex; flex-direction: column; gap: 14px; }

        /* Field */
        .lp-field { display: flex; flex-direction: column; gap: 6px; }
        .lp-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.3px;
          color: rgba(255,255,255,0.4);
          padding-left: 2px;
        }

        /* Input */
        .lp-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.08);
          color: #fff;
          padding: 12px 14px;
          font-size: 14px; font-weight: 400;
          font-family: inherit;
          border-radius: 12px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .lp-input::placeholder { color: rgba(255,255,255,0.2); }
        .lp-input:focus {
          border-color: ${ACCENT}60;
          background: ${ACCENT}09;
          box-shadow: 0 0 0 3px ${ACCENT}18;
        }

        /* Separator */
        .lp-sep {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 2px 0;
        }

        /* ── Button ── */
        .lp-btn {
          position: relative; width: 100%; padding: 14px 20px;
          background: ${ACCENT};
          border: none;
          color: #fff;
          font-family: inherit;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.3px;
          border-radius: 12px; overflow: hidden;
          transition: box-shadow 0.2s, transform 0.15s, filter 0.2s;
          margin-top: 2px;
          box-shadow: 0 4px 20px ${ACCENT}40, 0 1px 0 rgba(255,255,255,0.15) inset;
        }
        .lp-btn::before {
          content: ''; position: absolute;
          inset: 0; border-radius: 12px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 100%);
        }
        .lp-btn:hover { filter: brightness(1.1); box-shadow: 0 6px 28px ${ACCENT}55, 0 1px 0 rgba(255,255,255,0.15) inset; transform: translateY(-1px); }
        .lp-btn:active { transform: translateY(0); filter: brightness(0.97); }
        .lp-btn:disabled { opacity: 0.55; transform: none; }
        .lp-btn-inner {
          position: relative;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }

        /* ── Spinner ── */
        .lp-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: lp-spin 0.7s linear infinite;
        }
        @keyframes lp-spin { to { transform: rotate(360deg); } }

        /* ── Error ── */
        .lp-error {
          font-size: 12px; font-weight: 500;
          color: #F87171; text-align: center;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.15);
          border-radius: 8px; padding: 8px 12px;
          animation: lp-shake 0.3s ease;
        }
        @keyframes lp-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }

        /* ── Hint ── */
        .lp-hint {
          font-size: 11px; font-weight: 400;
          color: rgba(255,255,255,0.2); text-align: center;
          line-height: 1.5;
        }

        /* ── Characters ── */
        .lp-chars {
          display: flex; gap: 6px; margin-top: 20px; width: 100%;
          animation: lp-rise 0.7s 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .lp-char {
          flex: 1;
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          padding: 10px 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          opacity: 0.5;
          transition: opacity 0.25s, transform 0.25s, background 0.25s, border-color 0.25s;
        }
        .lp-char:hover {
          opacity: 1; transform: translateY(-3px);
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }
        .lp-char-emoji {
          font-size: 20px;
          animation: lp-float 3s ease-in-out infinite;
        }
        .lp-char-lbl {
          font-size: 9px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
        }
        @keyframes lp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }

        /* ── Status ── */
        .lp-status {
          position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 7px;
          background: rgba(12,16,28,0.7);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 10px; font-weight: 600;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.3); z-index: 20;
          backdrop-filter: blur(12px);
          animation: lp-fadein 1s 0.8s both;
        }
        .lp-status-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #34D399; box-shadow: 0 0 6px #34D399, 0 0 12px #34D39940;
          animation: lp-pulse 2.5s ease-in-out infinite;
        }
        @keyframes lp-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        /* ── Keyframes ── */
        @keyframes lp-fadein { from{opacity:0} to{opacity:1} }
        @keyframes lp-rise   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="lp-root">

        {/* 3D Village */}
        <div className="lp-village" aria-hidden="true">
          <Village />
        </div>

        {/* Atmosphere */}
        <div className="lp-vignette" />
        <div className="lp-fog-top" />
        <div className="lp-fog-bottom" />
        <div className="lp-bloom" />

        {/* Cursor */}
        <div ref={cursorRef} className="lp-cursor" />
        <div ref={cursorTrailRef} className="lp-trail" />

        {/* Content */}
        <div className="lp-content">

          {/* Logo */}
              <img src={logo.src} alt="Logo" style={{ width: 74, height: 74 }} />
            <div className="lp-logo-name">BAG<span>TOWN</span></div>
            <div className="lp-logo-tag">Your Wallets, Alive</div>

          {/* Card */}
          <div className="lp-card">
            <form className="lp-form" onSubmit={handleSubmit}>

              <div className="lp-field">
                <div className="lp-label">Blockchain</div>
                <ChainDropdown value={blockchain} onChange={setBlockchain} />
              </div>

              <div className="lp-sep" />

              <div className="lp-field">
                <div className="lp-label">Wallet address</div>
                <input
                  type="text" value={wallet}
                  autoComplete="off" spellCheck={false}
                  onChange={(e) => { setWallet(e.target.value); setError(""); }}
                  placeholder="0x… or paste any address"
                  className="lp-input"
                />
              </div>

              <div className="lp-field">
                <div className="lp-label">Nickname <span style={{ fontWeight: 400, opacity: 0.5 }}>(optional)</span></div>
                <input
                  type="text" value={nickname}
                  autoComplete="off"
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="My Main Wallet"
                  className="lp-input"
                />
              </div>

              {error && <p className="lp-error">{error}</p>}

              <button type="submit" className="lp-btn" disabled={loading}>
                <div className="lp-btn-inner">
                  {loading
                    ? <><span className="lp-spinner" /> Analyzing wallet…</>
                    : <>Enter the Village →</>
                  }
                </div>
              </button>

              <p className="lp-hint">A personality is assigned to your wallet upon entry</p>
            </form>
          </div>

          {/* Characters */}
          <div className="lp-chars">
            {characters.map((c, i) => (
              <div key={i} className="lp-char">
                <span className="lp-char-emoji" style={{ animationDelay: `${i * 0.18}s`, animationDuration: `${3 + i * 0.2}s` }}>
                  {c.emoji}
                </span>
                <span className="lp-char-lbl" style={{ color: c.color }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status pill */}
        <div className="lp-status">
          <div className="lp-status-dot" />
          Village is open
        </div>

      </div>
    </>
  );
}
