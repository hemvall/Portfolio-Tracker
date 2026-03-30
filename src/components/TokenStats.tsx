"use client";

import { useStore } from "@/lib/store";
import { Mood } from "@/lib/types";

const MOOD_LABELS: Record<Mood, { label: string; emoji: string; color: string }> = {
  moon: { label: "MOONING", emoji: "🚀", color: "#39ff14" },
  pump: { label: "PUMPING", emoji: "📈", color: "#00f0ff" },
  dump: { label: "DUMPING", emoji: "📉", color: "#ff4444" },
  crab: { label: "CRABBING", emoji: "🦀", color: "#ff6600" },
};

export function TokenStats() {
  const selectedId = useStore((s) => s.selectedCharacter);
  const characters = useStore((s) => s.characters);

  if (!selectedId) return null;

  const char = characters.find((c) => c.id === selectedId);
  if (!char) return null;

  const { token } = char;
  const mood = MOOD_LABELS[token.mood];
  const changeColor = token.change24h >= 0 ? "#39ff14" : "#ff4444";

  return (
    <div className="glass p-5 w-72 animate-[float-up_0.3s_ease-out]">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black"
          style={{
            background: `${token.color}22`,
            color: token.color,
            boxShadow: `0 0 15px ${token.color}44`,
          }}
        >
          {token.symbol.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-lg" style={{ color: token.color }}>
            {token.symbol}
          </h3>
          <p className="text-white/40 text-xs">{token.name}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-white/40 text-sm">Price</span>
          <span className="text-white font-mono text-sm">
            ${token.price < 0.01 ? token.price.toFixed(8) : token.price.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40 text-sm">24h</span>
          <span className="font-mono text-sm" style={{ color: changeColor }}>
            {token.change24h > 0 ? "+" : ""}
            {token.change24h}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40 text-sm">Holdings</span>
          <span className="text-white font-mono text-sm">
            {token.holdings.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40 text-sm">Value</span>
          <span className="text-white font-bold font-mono text-sm">
            ${token.value.toLocaleString()}
          </span>
        </div>

        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-white/40 text-sm">Mood</span>
            <span className="font-bold text-sm" style={{ color: mood.color }}>
              {mood.emoji} {mood.label}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-white/40 text-sm">Personality</span>
            <span className="text-white/80 text-sm capitalize">
              {token.personality}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-white/40 text-sm">Currently</span>
            <span className="text-white/80 text-sm capitalize">
              {char.currentAction}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
