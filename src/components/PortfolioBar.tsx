"use client";

import { MOCK_TOKENS, TOTAL_VALUE } from "@/lib/mockData";

export function PortfolioBar() {
  const totalChange = MOCK_TOKENS.reduce(
    (sum, t) => sum + t.change24h * (t.value / TOTAL_VALUE),
    0
  );
  const changeColor = totalChange >= 0 ? "#39ff14" : "#ff4444";

  return (
    <div className="glass px-6 py-3 flex items-center gap-6 overflow-x-auto">
      {/* Total */}
      <div className="flex items-center gap-3 pr-4 border-r border-white/10">
        <div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest">Portfolio</p>
          <p className="text-white font-bold text-lg font-mono">
            ${TOTAL_VALUE.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <span className="font-mono text-sm font-bold" style={{ color: changeColor }}>
          {totalChange > 0 ? "+" : ""}
          {totalChange.toFixed(1)}%
        </span>
      </div>

      {/* Individual tokens */}
      {MOCK_TOKENS.map((token) => (
        <div key={token.symbol} className="flex items-center gap-2 shrink-0">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: token.color,
              boxShadow: `0 0 6px ${token.color}`,
            }}
          />
          <span className="text-white/70 text-xs font-bold">{token.symbol}</span>
          <span
            className="text-xs font-mono"
            style={{ color: token.change24h >= 0 ? "#39ff14" : "#ff4444" }}
          >
            {token.change24h > 0 ? "+" : ""}
            {token.change24h}%
          </span>
        </div>
      ))}
    </div>
  );
}
