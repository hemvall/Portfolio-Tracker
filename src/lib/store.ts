import { create } from "zustand";
import { WalletData, ChainType, CHAIN_CONFIGS } from "./types";

const DEFAULT_WALLETS: WalletData[] = [
  {
    id: "btc", chain: "btc", name: "Satoshi", address: "1A1zP1...ivf6y",
    value: 52038, change: +2.1, startX: -9, startZ: -4,
    desc: "Slow, majestic, imposing. Strolls with his golden cane. The whole village bows.",
    mood: "\u{1F451} Confident \u2014 strolling majestically",
    moodBg: "rgba(247,147,26,0.12)", moodColor: "#F7931A",
  },
  {
    id: "eth", chain: "eth", name: "Vitalik", address: "0xd8dA...9604",
    value: 15694, change: +1.4, startX: 0, startZ: -9,
    desc: "Paces back and forth, book under his arm. Stops to take notes. Deeply thoughtful.",
    mood: "\u{1F9D0} Pensive \u2014 reading a whitepaper",
    moodBg: "rgba(98,126,234,0.12)", moodColor: "#627EEA",
  },
  {
    id: "sol", chain: "sol", name: "Anatoly", address: "9WzDX...AWWM",
    value: 18530, change: +5.4, startX: 9, startZ: -4,
    desc: "Runs laps around the village. Jumps high. Never stops. Ever.",
    mood: "\u26A1 Euphoric \u2014 lapping the village",
    moodBg: "rgba(153,69,255,0.12)", moodColor: "#9945FF",
  },
  {
    id: "bonk", chain: "meme", name: "BONK", address: "7xKXt...BONK",
    value: 36, change: +18.4, startX: 5, startZ: 8,
    desc: "Changes direction every second. Unpredictable but contained. +1000% one day, -90% the next.",
    mood: "\u{1F92A} MOON SOON \u2014 zigzagging everywhere",
    moodBg: "rgba(255,200,50,0.12)", moodColor: "#FFD700",
  },
  {
    id: "usdc", chain: "stable", name: "USDC", address: "0x...USDC",
    value: 3200, change: 0.0, startX: -5, startZ: 5,
    desc: "Sitting at a desk staring at a perfectly flat chart. Has been here since 2021. Nothing happens.",
    mood: "\u{1F634} Flat \u2014 watching paint dry on a chart",
    moodBg: "rgba(38,161,122,0.12)", moodColor: "#26A17A",
  },
];

interface CharacterPosition {
  x: number;
  z: number;
}

interface VillageStore {
  wallets: WalletData[];
  hoveredWallet: WalletData | null;
  selectedWallet: WalletData | null;
  characterPositions: Record<string, CharacterPosition>;
  setHoveredWallet: (w: WalletData | null) => void;
  setSelectedWallet: (w: WalletData | null) => void;
  updateCharacterPosition: (id: string, x: number, z: number) => void;
  addWallet: (chain: ChainType, address: string, value: number, change: number) => void;
  totalValue: () => number;
}

const NAMES: Record<ChainType, string> = {
  btc: "Nakamoto", eth: "Gavin", sol: "Speedster", meme: "WEN MOON", stable: "Jerome",
};
const DESCS: Record<ChainType, string> = {
  btc: "A new hodler arrives. Cautious and confident.",
  eth: "New philosopher, already reading something.",
  sol: "Another sprinter joins the circuit.",
  meme: "More chaos. The village trembles.",
  stable: "A second bench may be needed.",
};
const MOODS: Record<ChainType, string> = {
  btc: "\u{1F451} Just arrived at the village",
  eth: "\u{1F9D0} Already reading something",
  sol: "\u26A1 Already running laps",
  meme: "\u{1F92A} Already panicking",
  stable: "\u{1F634} Looking for a desk",
};

export const useVillageStore = create<VillageStore>((set, get) => ({
  wallets: DEFAULT_WALLETS,
  hoveredWallet: null,
  selectedWallet: null,
  characterPositions: {},
  setHoveredWallet: (w) => set({ hoveredWallet: w }),
  setSelectedWallet: (w) => {
    const current = get().selectedWallet;
    // Toggle: click same character again to deselect
    if (current && w && current.id === w.id) {
      set({ selectedWallet: null });
    } else {
      set({ selectedWallet: w });
    }
  },
  updateCharacterPosition: (id, x, z) => {
    const positions = get().characterPositions;
    const prev = positions[id];
    // Only update if position actually changed (avoid unnecessary rerenders)
    if (!prev || Math.abs(prev.x - x) > 0.05 || Math.abs(prev.z - z) > 0.05) {
      set({ characterPositions: { ...positions, [id]: { x, z } } });
    }
  },
  addWallet: (chain, address, value, change) => {
    const cfg = CHAIN_CONFIGS[chain];
    const angle = Math.random() * Math.PI * 2;
    const r = 10 + Math.random() * 7;
    const w: WalletData = {
      id: "w" + Date.now(),
      chain,
      name: NAMES[chain] || "Unknown",
      address: address.slice(0, 16) + "...",
      value,
      change,
      startX: Math.cos(angle) * r,
      startZ: Math.sin(angle) * r,
      desc: DESCS[chain] || "A new inhabitant.",
      mood: change >= 0 ? (MOODS[chain] || "") : "\u{1F630} Stressed on arrival",
      moodBg: change >= 0 ? "rgba(0,255,136,0.1)" : "rgba(255,59,92,0.1)",
      moodColor: change >= 0 ? cfg.hex : "#FF3B5C",
    };
    set((state) => ({ wallets: [...state.wallets, w] }));
  },
  totalValue: () => get().wallets.reduce((s, w) => s + w.value, 0),
}));
