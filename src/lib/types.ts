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
  personality?: PersonalityArchetype;
  holdings?: TokenHolding[];
  blockchain?: Blockchain;
}

export type ChainType = "btc" | "eth" | "sol" | "meme" | "stable";

export const CHAIN_CONFIGS: Record<ChainType, ChainConfig> = {
  btc:    { color: 0xF7931A, hex: "#F7931A", scale: 1.5,  label: "The Patriarch" },
  eth:    { color: 0x627EEA, hex: "#627EEA", scale: 1.15, label: "The Philosopher" },
  sol:    { color: 0x9945FF, hex: "#9945FF", scale: 1.0,  label: "The Sprinter" },
  meme:   { color: 0xFFD700, hex: "#FFD700", scale: 0.82, label: "The Village Fool" },
  stable: { color: 0x26A17A, hex: "#26A17A", scale: 1.05, label: "The Boring One" },
};

/* ─── Blockchain selection (10 popular chains) ──── */

export type Blockchain =
  | "ethereum"
  | "solana"
  | "bitcoin"
  | "bnb"
  | "polygon"
  | "avalanche"
  | "base"
  | "arbitrum"
  | "tron"
  | "sui";

/**
 * Real blockchain logos served from the Trust Wallet assets CDN via jsdelivr.
 * Source: https://github.com/trustwallet/assets — tiny PNGs (~5 KB), CDN-cached.
 * The `icon` field is kept as a unicode fallback for places that can't render <img>.
 */
const TW_ASSETS = "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains";

export const BLOCKCHAIN_OPTIONS: {
  value: Blockchain;
  label: string;
  icon: string;
  logoUrl: string;
}[] = [
  { value: "ethereum",  label: "Ethereum",   icon: "Ξ",  logoUrl: `${TW_ASSETS}/ethereum/info/logo.png` },
  { value: "solana",    label: "Solana",     icon: "◎",  logoUrl: `${TW_ASSETS}/solana/info/logo.png` },
  { value: "bitcoin",   label: "Bitcoin",    icon: "₿",  logoUrl: `${TW_ASSETS}/bitcoin/info/logo.png` },
  { value: "bnb",       label: "BNB Chain",  icon: "⬡",  logoUrl: `${TW_ASSETS}/smartchain/info/logo.png` },
  { value: "polygon",   label: "Polygon",    icon: "⬡",  logoUrl: `${TW_ASSETS}/polygon/info/logo.png` },
  { value: "avalanche", label: "Avalanche",  icon: "▲",  logoUrl: `${TW_ASSETS}/avalanchec/info/logo.png` },
  { value: "base",      label: "Base",       icon: "🔵", logoUrl: `${TW_ASSETS}/base/info/logo.png` },
  { value: "arbitrum",  label: "Arbitrum",   icon: "🔷", logoUrl: `${TW_ASSETS}/arbitrum/info/logo.png` },
  { value: "tron",      label: "Tron",       icon: "◆",  logoUrl: `${TW_ASSETS}/tron/info/logo.png` },
  { value: "sui",       label: "Sui",        icon: "💧", logoUrl: `${TW_ASSETS}/sui/info/logo.png` },
];

/** Map a blockchain to the character behavior type */
export function blockchainToChainType(bc: Blockchain): ChainType {
  switch (bc) {
    case "bitcoin":   return "btc";
    case "ethereum":  return "eth";
    case "solana":    return "sol";
    case "sui":       return "sol";
    case "tron":      return "stable";
    case "bnb":       return "eth";
    case "polygon":   return "eth";
    case "avalanche": return "eth";
    case "base":      return "eth";
    case "arbitrum":  return "eth";
  }
}

/* ─── Token holdings & categories ────────────────── */

export type AssetCategory =
  | "blue-chip"
  | "stablecoin"
  | "memecoin"
  | "defi"
  | "nft"
  | "l2-infra"
  | "other";

export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  "blue-chip":  "#627EEA",
  "stablecoin": "#26A17A",
  "memecoin":   "#FFD700",
  "defi":       "#FF6EC7",
  "nft":        "#BF00FF",
  "l2-infra":   "#00F0FF",
  "other":      "#888888",
};

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  "blue-chip":  "Blue Chips",
  "stablecoin": "Stablecoins",
  "memecoin":   "Memecoins",
  "defi":       "DeFi",
  "nft":        "NFTs",
  "l2-infra":   "L2 / Infra",
  "other":      "Other",
};

export interface TokenHolding {
  symbol: string;
  name: string;
  category: AssetCategory;
  balance: number;
  valueUsd: number;
  change24h: number;
}

/* ─── Personality archetypes ─────────────────────── */

export interface PersonalityArchetype {
  title: string;
  emoji: string;
  description: string;
  color: string;
}
