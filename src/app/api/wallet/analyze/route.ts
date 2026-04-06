import { NextRequest, NextResponse } from "next/server";
import { Blockchain } from "@/lib/types";
import { analyzePersonality } from "@/lib/personality";
import { fetchWalletData } from "@/lib/wallet-fetcher";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, blockchain } = body as { address: string; blockchain: Blockchain };

    if (!address || !blockchain) {
      return NextResponse.json({ error: "Missing address or blockchain" }, { status: 400 });
    }

    console.log(`[Analyze] ${blockchain} wallet: ${address.slice(0, 12)}...`);

    // Fetch real on-chain balances + live prices
    const { holdings, totalValue, change24h } = await fetchWalletData(address, blockchain);

    console.log(`[Analyze] Result: ${holdings.length} tokens, $${totalValue}`);

    // Analyze personality from real holdings
    const personality = analyzePersonality(holdings, totalValue);

    return NextResponse.json({
      holdings,
      totalValue,
      change24h,
      personality,
    });
  } catch (err) {
    console.error("Wallet analyze error:", err);
    return NextResponse.json(
      { error: `Failed to analyze wallet: ${(err as Error).message}` },
      { status: 500 },
    );
  }
}
