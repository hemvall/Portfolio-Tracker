import { TokenHolding, AssetCategory, PersonalityArchetype } from "./types";

const ARCHETYPES: (PersonalityArchetype & { test: (pcts: Record<AssetCategory, number>, total: number) => boolean })[] = [
  {
    title: "The Whale",
    emoji: "🐋",
    description: "Moves markets by sneezing. When this wallet transacts, the whole chain feels it. Unshakeable conviction backed by serious capital.",
    color: "#00F0FF",
    test: (_, total) => total >= 500_000,
  },
  {
    title: "The Degen",
    emoji: "🎰",
    description: "Lives for the 100x. Portfolio is 90% memecoins and hopium. Sleeps with TradingView open and wakes up to liquidation notifications.",
    color: "#FFD700",
    test: (p) => p.memecoin >= 40,
  },
  {
    title: "The Yield Farmer",
    emoji: "🌾",
    description: "Chases APYs across 15 protocols. Has a spreadsheet for their spreadsheets. Knows the exact impermanent loss on every LP position.",
    color: "#FF6EC7",
    test: (p) => p.defi >= 35,
  },
  {
    title: "The NFT Collector",
    emoji: "🖼️",
    description: "Says 'it's about the art' but checks floor prices every 5 minutes. Has more PFPs than friends. Their wallet is basically a gallery.",
    color: "#BF00FF",
    test: (p) => p.nft >= 30,
  },
  {
    title: "The Diamond Hand",
    emoji: "💎",
    description: "Bought blue-chips and threw away the sell button. Has survived 3 bear markets without flinching. Their portfolio is boring and outrageously profitable.",
    color: "#627EEA",
    test: (p) => p["blue-chip"] >= 50,
  },
  {
    title: "The Stablecoin Maxi",
    emoji: "🏦",
    description: "Risk? Never heard of it. Sitting on stables waiting for 'the perfect entry' since 2021. Their portfolio chart is a flatline — and they're proud of it.",
    color: "#26A17A",
    test: (p) => p.stablecoin >= 50,
  },
  {
    title: "The Infrastructure Nerd",
    emoji: "🔧",
    description: "Only invests in 'real technology.' Can explain rollups, data availability, and sequencer decentralization at parties nobody invites them to.",
    color: "#00F0FF",
    test: (p) => p["l2-infra"] >= 30,
  },
  {
    title: "The Balanced Sage",
    emoji: "⚖️",
    description: "A little bit of everything, perfectly hedged. Not too degen, not too safe. The portfolio equivalent of a well-balanced meal. Boring? Maybe. Surviving? Always.",
    color: "#A882FF",
    test: () => true, // fallback
  },
];

export function analyzePersonality(
  holdings: TokenHolding[],
  totalValue: number,
): PersonalityArchetype {
  const categoryTotals: Record<AssetCategory, number> = {
    "blue-chip": 0,
    stablecoin: 0,
    memecoin: 0,
    defi: 0,
    nft: 0,
    "l2-infra": 0,
    other: 0,
  };

  for (const h of holdings) {
    categoryTotals[h.category] += h.valueUsd;
  }

  const pcts: Record<AssetCategory, number> = {} as any;
  for (const cat of Object.keys(categoryTotals) as AssetCategory[]) {
    pcts[cat] = totalValue > 0 ? (categoryTotals[cat] / totalValue) * 100 : 0;
  }

  for (const archetype of ARCHETYPES) {
    if (archetype.test(pcts, totalValue)) {
      const { test: _, ...result } = archetype;
      return result;
    }
  }

  // Should never reach here because of fallback
  return ARCHETYPES[ARCHETYPES.length - 1];
}
