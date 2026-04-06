import { create } from "zustand";
import {
  WalletData,
  ChainType,
  CHAIN_CONFIGS,
  Blockchain,
  TokenHolding,
  PersonalityArchetype,
  blockchainToChainType,
} from "./types";

const STORAGE_KEY = "bagtown_wallets";

function saveWallets(wallets: WalletData[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  } catch {
    // localStorage unavailable (SSR, quota exceeded)
  }
}

function loadWallets(): WalletData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WalletData[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // localStorage unavailable or corrupted
  }
  return [];
}

interface CharacterPosition {
  x: number;
  z: number;
}

interface VillageStore {
  wallets: WalletData[];
  hoveredWallet: WalletData | null;
  selectedWallet: WalletData | null;
  characterPositions: Record<string, CharacterPosition>;
  hydrated: boolean;
  hydrateFromStorage: () => void;
  setHoveredWallet: (w: WalletData | null) => void;
  setSelectedWallet: (w: WalletData | null) => void;
  updateCharacterPosition: (id: string, x: number, z: number) => void;
  addWallet: (chain: ChainType, address: string, value: number, change: number) => void;
  addAnalyzedWallet: (opts: {
    address: string;
    nickname: string;
    blockchain: Blockchain;
    totalValue: number;
    change24h: number;
    holdings: TokenHolding[];
    personality: PersonalityArchetype;
  }) => void;
  removeWallet: (id: string) => void;
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
  btc: "👑 Just arrived at the village",
  eth: "🧐 Already reading something",
  sol: "⚡ Already running laps",
  meme: "🤪 Already panicking",
  stable: "😴 Looking for a desk",
};

export const useVillageStore = create<VillageStore>((set, get) => ({
  wallets: [],
  hoveredWallet: null,
  selectedWallet: null,
  characterPositions: {},
  hydrated: false,

  hydrateFromStorage: () => {
    if (get().hydrated) return;
    const wallets = loadWallets();
    set({ wallets, hydrated: true });
  },

  setHoveredWallet: (w) => set({ hoveredWallet: w }),
  setSelectedWallet: (w) => {
    const current = get().selectedWallet;
    if (current && w && current.id === w.id) {
      set({ selectedWallet: null });
    } else {
      set({ selectedWallet: w });
    }
  },
  updateCharacterPosition: (id, x, z) => {
    const positions = get().characterPositions;
    const prev = positions[id];
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
      mood: change >= 0 ? (MOODS[chain] || "") : "😰 Stressed on arrival",
      moodBg: change >= 0 ? "rgba(0,255,136,0.1)" : "rgba(255,59,92,0.1)",
      moodColor: change >= 0 ? cfg.hex : "#FF3B5C",
    };
    set((state) => {
      const wallets = [...state.wallets, w];
      saveWallets(wallets);
      return { wallets };
    });
  },
  addAnalyzedWallet: (opts) => {
    const chain = blockchainToChainType(opts.blockchain);
    const cfg = CHAIN_CONFIGS[chain];
    const angle = Math.random() * Math.PI * 2;
    const r = 10 + Math.random() * 7;
    const isUp = opts.change24h >= 0;

    const w: WalletData = {
      id: "w" + Date.now(),
      chain,
      name: opts.nickname || NAMES[chain] || "Unknown",
      address: opts.address.length > 16 ? opts.address.slice(0, 8) + "..." + opts.address.slice(-6) : opts.address,
      value: Math.round(opts.totalValue),
      change: opts.change24h,
      startX: Math.cos(angle) * r,
      startZ: Math.sin(angle) * r,
      desc: opts.personality.description,
      mood: `${opts.personality.emoji} ${opts.personality.title}`,
      moodBg: isUp ? "rgba(0,255,136,0.1)" : "rgba(255,59,92,0.1)",
      moodColor: isUp ? cfg.hex : "#FF3B5C",
      personality: opts.personality,
      holdings: opts.holdings,
      blockchain: opts.blockchain,
    };
    set((state) => {
      const wallets = [...state.wallets, w];
      saveWallets(wallets);
      return { wallets };
    });
  },
  removeWallet: (id) => {
    set((state) => {
      const wallets = state.wallets.filter((w) => w.id !== id);
      saveWallets(wallets);
      const selectedWallet = state.selectedWallet?.id === id ? null : state.selectedWallet;
      return { wallets, selectedWallet };
    });
  },
  totalValue: () => get().wallets.reduce((s, w) => s + w.value, 0),
}));
