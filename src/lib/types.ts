export interface ChainConfig {
  color: number;
  hex: string;
  scale: number;
  label: string;
}

export interface WalletData {
  id: string;
  chain: ChainType;
  name: string;
  address: string;
  value: number;
  change: number;
  startX: number;
  startZ: number;
  desc: string;
  mood: string;
  moodBg: string;
  moodColor: string;
}

export type ChainType = "btc" | "eth" | "sol" | "meme" | "stable";

export const CHAIN_CONFIGS: Record<ChainType, ChainConfig> = {
  btc:    { color: 0xF7931A, hex: "#F7931A", scale: 1.5,  label: "The Patriarch" },
  eth:    { color: 0x627EEA, hex: "#627EEA", scale: 1.15, label: "The Philosopher" },
  sol:    { color: 0x9945FF, hex: "#9945FF", scale: 1.0,  label: "The Sprinter" },
  meme:   { color: 0xFFD700, hex: "#FFD700", scale: 0.82, label: "The Village Fool" },
  stable: { color: 0x26A17A, hex: "#26A17A", scale: 1.05, label: "The Boring One" },
};
