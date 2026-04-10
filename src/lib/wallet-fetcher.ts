import { Blockchain, TokenHolding, AssetCategory } from "./types";

/* ═══════════════════════════════════════════════════
   Token registry — known tokens per chain
   ═══════════════════════════════════════════════════ */

interface TokenDef {
  address: string; // contract address (or "native")
  symbol: string;
  name: string;
  decimals: number;
  coingeckoId: string;
  category: AssetCategory;
}

interface ChainDef {
  rpcUrl: string;
  native: TokenDef;
  tokens: TokenDef[];
}

const EVM_CHAINS: Partial<Record<Blockchain, ChainDef>> = {
  ethereum: {
    rpcUrl: "https://eth.llamarpc.com",
    native: { address: "native", symbol: "ETH", name: "Ethereum", decimals: 18, coingeckoId: "ethereum", category: "blue-chip" },
    tokens: [
      { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", name: "USD Coin", decimals: 6, coingeckoId: "usd-coin", category: "stablecoin" },
      { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", name: "Tether", decimals: 6, coingeckoId: "tether", category: "stablecoin" },
      { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", symbol: "DAI", name: "Dai", decimals: 18, coingeckoId: "dai", category: "stablecoin" },
      { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", symbol: "LINK", name: "Chainlink", decimals: 18, coingeckoId: "chainlink", category: "defi" },
      { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", symbol: "UNI", name: "Uniswap", decimals: 18, coingeckoId: "uniswap", category: "defi" },
      { address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", symbol: "AAVE", name: "Aave", decimals: 18, coingeckoId: "aave", category: "defi" },
      { address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32", symbol: "LDO", name: "Lido DAO", decimals: 18, coingeckoId: "lido-dao", category: "defi" },
      { address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", symbol: "PEPE", name: "Pepe", decimals: 18, coingeckoId: "pepe", category: "memecoin" },
      { address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", symbol: "SHIB", name: "Shiba Inu", decimals: 18, coingeckoId: "shiba-inu", category: "memecoin" },
      { address: "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1", symbol: "ARB", name: "Arbitrum", decimals: 18, coingeckoId: "arbitrum", category: "l2-infra" },
      { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", symbol: "WETH", name: "Wrapped Ether", decimals: 18, coingeckoId: "weth", category: "blue-chip" },
      { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, coingeckoId: "wrapped-bitcoin", category: "blue-chip" },
    ],
  },
  polygon: {
    rpcUrl: "https://polygon-rpc.com",
    native: { address: "native", symbol: "POL", name: "Polygon", decimals: 18, coingeckoId: "matic-network", category: "l2-infra" },
    tokens: [
      { address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", symbol: "USDC", name: "USD Coin", decimals: 6, coingeckoId: "usd-coin", category: "stablecoin" },
      { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", symbol: "USDT", name: "Tether", decimals: 6, coingeckoId: "tether", category: "stablecoin" },
      { address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", symbol: "WETH", name: "Wrapped Ether", decimals: 18, coingeckoId: "weth", category: "blue-chip" },
      { address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", symbol: "LINK", name: "Chainlink", decimals: 18, coingeckoId: "chainlink", category: "defi" },
      { address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", symbol: "AAVE", name: "Aave", decimals: 18, coingeckoId: "aave", category: "defi" },
      { address: "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683", symbol: "SAND", name: "The Sandbox", decimals: 18, coingeckoId: "the-sandbox", category: "nft" },
    ],
  },
  bnb: {
    rpcUrl: "https://bsc-dataseed.binance.org",
    native: { address: "native", symbol: "BNB", name: "BNB", decimals: 18, coingeckoId: "binancecoin", category: "blue-chip" },
    tokens: [
      { address: "0x55d398326f99059fF775485246999027B3197955", symbol: "USDT", name: "Tether", decimals: 18, coingeckoId: "tether", category: "stablecoin" },
      { address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", symbol: "USDC", name: "USD Coin", decimals: 18, coingeckoId: "usd-coin", category: "stablecoin" },
      { address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", symbol: "CAKE", name: "PancakeSwap", decimals: 18, coingeckoId: "pancakeswap-token", category: "defi" },
      { address: "0xfb6115445Bff7b52FeB98650C87f44907E58f802", symbol: "FLOKI", name: "Floki Inu", decimals: 9, coingeckoId: "floki", category: "memecoin" },
      { address: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63", symbol: "XVS", name: "Venus", decimals: 18, coingeckoId: "venus", category: "defi" },
      { address: "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94", symbol: "LTC", name: "Litecoin", decimals: 18, coingeckoId: "litecoin", category: "blue-chip" },
    ],
  },
  avalanche: {
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    native: { address: "native", symbol: "AVAX", name: "Avalanche", decimals: 18, coingeckoId: "avalanche-2", category: "blue-chip" },
    tokens: [
      { address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", symbol: "USDC", name: "USD Coin", decimals: 6, coingeckoId: "usd-coin", category: "stablecoin" },
      { address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", symbol: "USDT", name: "Tether", decimals: 6, coingeckoId: "tether", category: "stablecoin" },
      { address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", symbol: "WETH", name: "Wrapped Ether", decimals: 18, coingeckoId: "weth", category: "blue-chip" },
      { address: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd", symbol: "JOE", name: "Trader Joe", decimals: 18, coingeckoId: "joe", category: "defi" },
      { address: "0x62edc0692BD897D2295872a9FFCac5425011c661", symbol: "GMX", name: "GMX", decimals: 18, coingeckoId: "gmx", category: "defi" },
    ],
  },
  base: {
    rpcUrl: "https://mainnet.base.org",
    native: { address: "native", symbol: "ETH", name: "Ethereum", decimals: 18, coingeckoId: "ethereum", category: "blue-chip" },
    tokens: [
      { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", symbol: "USDC", name: "USD Coin", decimals: 6, coingeckoId: "usd-coin", category: "stablecoin" },
      { address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631", symbol: "AERO", name: "Aerodrome", decimals: 18, coingeckoId: "aerodrome-finance", category: "defi" },
      { address: "0x532f27101965dd16442E59d40670FaF5eBB142E4", symbol: "BRETT", name: "Brett", decimals: 18, coingeckoId: "brett", category: "memecoin" },
      { address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", symbol: "DEGEN", name: "Degen", decimals: 18, coingeckoId: "degen-base", category: "memecoin" },
      { address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22", symbol: "cbETH", name: "Coinbase Wrapped ETH", decimals: 18, coingeckoId: "coinbase-wrapped-staked-eth", category: "defi" },
    ],
  },
  arbitrum: {
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    native: { address: "native", symbol: "ETH", name: "Ethereum", decimals: 18, coingeckoId: "ethereum", category: "blue-chip" },
    tokens: [
      { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", symbol: "USDC", name: "USD Coin", decimals: 6, coingeckoId: "usd-coin", category: "stablecoin" },
      { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", symbol: "USDT", name: "Tether", decimals: 6, coingeckoId: "tether", category: "stablecoin" },
      { address: "0x912CE59144191C1204E64559FE8253a0e49E6548", symbol: "ARB", name: "Arbitrum", decimals: 18, coingeckoId: "arbitrum", category: "l2-infra" },
      { address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a", symbol: "GMX", name: "GMX", decimals: 18, coingeckoId: "gmx", category: "defi" },
      { address: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8", symbol: "PENDLE", name: "Pendle", decimals: 18, coingeckoId: "pendle", category: "defi" },
      { address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", symbol: "LINK", name: "Chainlink", decimals: 18, coingeckoId: "chainlink", category: "defi" },
    ],
  },
};

/* ─── Solana known SPL token mints ───────────────── */

interface SolTokenDef {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  coingeckoId: string;
  category: AssetCategory;
}

// Public Solana RPCs — use multiple for fallback
const SOLANA_RPCS = [
  "https://rpc.ankr.com/solana",
  "https://api.mainnet-beta.solana.com",
];
const SOLANA_NATIVE: TokenDef = {
  address: "native", symbol: "SOL", name: "Solana", decimals: 9,
  coingeckoId: "solana", category: "blue-chip",
};

const SOLANA_TOKENS: SolTokenDef[] = [
  { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", name: "USD Coin", decimals: 6, coingeckoId: "usd-coin", category: "stablecoin" },
  { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", symbol: "USDT", name: "Tether", decimals: 6, coingeckoId: "tether", category: "stablecoin" },
  { mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", symbol: "BONK", name: "Bonk", decimals: 5, coingeckoId: "bonk", category: "memecoin" },
  { mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", symbol: "JUP", name: "Jupiter", decimals: 6, coingeckoId: "jupiter-exchange-solana", category: "defi" },
  { mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", symbol: "RAY", name: "Raydium", decimals: 6, coingeckoId: "raydium", category: "defi" },
  { mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", symbol: "WIF", name: "dogwifhat", decimals: 6, coingeckoId: "dogwifcoin", category: "memecoin" },
  { mint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", symbol: "PYTH", name: "Pyth Network", decimals: 6, coingeckoId: "pyth-network", category: "l2-infra" },
  { mint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL", symbol: "JTO", name: "Jito", decimals: 9, coingeckoId: "jito-governance-token", category: "defi" },
  { mint: "So11111111111111111111111111111111111111112", symbol: "wSOL", name: "Wrapped SOL", decimals: 9, coingeckoId: "solana", category: "blue-chip" },
  { mint: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", symbol: "WETH", name: "Wrapped Ether", decimals: 8, coingeckoId: "weth", category: "blue-chip" },
  { mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", symbol: "mSOL", name: "Marinade SOL", decimals: 9, coingeckoId: "msol", category: "defi" },
  { mint: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj", symbol: "stSOL", name: "Lido Staked SOL", decimals: 9, coingeckoId: "lido-staked-sol", category: "defi" },
  { mint: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux", symbol: "HNT", name: "Helium", decimals: 8, coingeckoId: "helium", category: "l2-infra" },
  { mint: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof", symbol: "RNDR", name: "Render", decimals: 8, coingeckoId: "render-token", category: "l2-infra" },
  { mint: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ", symbol: "W", name: "Wormhole", decimals: 6, coingeckoId: "wormhole", category: "l2-infra" },
  { mint: "TNSRxcUxoT9xBG3de7PiJyTDYqBbTLYLQp5RXgMwSQk", symbol: "TNSR", name: "Tensor", decimals: 9, coingeckoId: "tensor", category: "nft" },
  { mint: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5", symbol: "MEW", name: "cat in a dogs world", decimals: 5, coingeckoId: "cat-in-a-dogs-world", category: "memecoin" },
  { mint: "CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu", symbol: "CLOUD", name: "Cloud", decimals: 9, coingeckoId: "cloud", category: "l2-infra" },
];

/* ─── Sui known coin types ───────────────────────── */

interface SuiTokenDef {
  coinType: string;
  symbol: string;
  name: string;
  decimals: number;
  coingeckoId: string;
  category: AssetCategory;
}

const SUI_RPC = "https://fullnode.mainnet.sui.io";
const SUI_NATIVE_TYPE = "0x2::sui::SUI";

const SUI_TOKENS: SuiTokenDef[] = [
  { coinType: "0x2::sui::SUI", symbol: "SUI", name: "Sui", decimals: 9, coingeckoId: "sui", category: "blue-chip" },
  { coinType: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC", symbol: "USDC", name: "USD Coin", decimals: 6, coingeckoId: "usd-coin", category: "stablecoin" },
  { coinType: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN", symbol: "USDT", name: "Tether", decimals: 6, coingeckoId: "tether", category: "stablecoin" },
  { coinType: "0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX", symbol: "NAVX", name: "NAVI Protocol", decimals: 9, coingeckoId: "navi-protocol", category: "defi" },
  { coinType: "0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS", symbol: "CETUS", name: "Cetus", decimals: 9, coingeckoId: "cetus-protocol", category: "defi" },
  { coinType: "0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA", symbol: "SCA", name: "Scallop", decimals: 9, coingeckoId: "scallop-2", category: "defi" },
];

/* ─── Tron known tokens ──────────────────────────── */

const TRON_API = "https://api.trongrid.io";

interface TronTokenDef {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  coingeckoId: string;
  category: AssetCategory;
}

const TRON_NATIVE: TokenDef = {
  address: "native", symbol: "TRX", name: "TRON", decimals: 6,
  coingeckoId: "tron", category: "blue-chip",
};

const TRON_TOKENS: TronTokenDef[] = [
  { address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", symbol: "USDT", name: "Tether", decimals: 6, coingeckoId: "tether", category: "stablecoin" },
  { address: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8", symbol: "USDC", name: "USD Coin", decimals: 6, coingeckoId: "usd-coin", category: "stablecoin" },
  { address: "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9", symbol: "JST", name: "JUST", decimals: 18, coingeckoId: "just", category: "defi" },
  { address: "TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S", symbol: "SUN", name: "Sun Token", decimals: 18, coingeckoId: "sun-token", category: "defi" },
  { address: "TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4", symbol: "BTT", name: "BitTorrent", decimals: 18, coingeckoId: "bittorrent", category: "other" },
];

/* ═══════════════════════════════════════════════════
   CoinGecko price fetcher (free, no key needed)
   ═══════════════════════════════════════════════════ */

interface PriceData {
  usd: number;
  usd_24h_change: number | null;
}

async function fetchPrices(coingeckoIds: string[]): Promise<Record<string, PriceData>> {
  if (coingeckoIds.length === 0) return {};

  const unique = Array.from(new Set(coingeckoIds));
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${unique.join(",")}&vs_currencies=usd&include_24hr_change=true`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) return {};

  const data = await res.json();
  const result: Record<string, PriceData> = {};

  for (const id of unique) {
    if (data[id]) {
      result[id] = {
        usd: data[id].usd ?? 0,
        usd_24h_change: data[id].usd_24h_change ?? 0,
      };
    }
  }

  return result;
}

/* ═══════════════════════════════════════════════════
   RPC helpers
   ═══════════════════════════════════════════════════ */

async function jsonRpc(url: string, method: string, params: unknown[]): Promise<unknown> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || "RPC error");
  return json.result;
}

/** Try multiple RPC endpoints, return first success */
async function jsonRpcWithFallback(urls: string[], method: string, params: unknown[]): Promise<unknown> {
  let lastErr: Error | null = null;
  for (const url of urls) {
    try {
      return await jsonRpc(url, method, params);
    } catch (err) {
      lastErr = err as Error;
      console.warn(`RPC failed (${url}): ${(err as Error).message}, trying next...`);
    }
  }
  throw lastErr ?? new Error("All RPCs failed");
}

async function jsonRpcBatch(url: string, calls: { method: string; params: unknown[] }[]): Promise<unknown[]> {
  const body = calls.map((c, i) => ({
    jsonrpc: "2.0",
    id: i + 1,
    method: c.method,
    params: c.params,
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`RPC batch HTTP ${res.status}`);
  const json = await res.json();
  // Sort by id to maintain order
  const sorted = (json as { id: number; result: unknown; error?: unknown }[]).sort(
    (a, b) => a.id - b.id,
  );
  return sorted.map((r) => r.result);
}

/* ═══════════════════════════════════════════════════
   Chain-specific balance fetchers
   ═══════════════════════════════════════════════════ */

interface RawBalance {
  symbol: string;
  name: string;
  balance: number; // human-readable amount
  coingeckoId: string;
  category: AssetCategory;
  /** Pre-resolved USD price (e.g. from Jupiter). Skips CoinGecko when set. */
  resolvedPriceUsd?: number;
  /** Pre-resolved 24h change %. */
  resolved24hChange?: number;
}

/* ─── EVM chains ─────────────────────────────────── */

async function fetchEvmBalances(address: string, blockchain: Blockchain): Promise<RawBalance[]> {
  const chain = EVM_CHAINS[blockchain];
  if (!chain) return [];

  const balances: RawBalance[] = [];

  // Build batch: native balance + all token balanceOf calls
  const balanceOfSig = "0x70a08231" + address.slice(2).toLowerCase().padStart(64, "0");
  const calls: { method: string; params: unknown[] }[] = [
    { method: "eth_getBalance", params: [address, "latest"] },
    ...chain.tokens.map((t) => ({
      method: "eth_call",
      params: [{ to: t.address, data: balanceOfSig }, "latest"],
    })),
  ];

  try {
    const results = await jsonRpcBatch(chain.rpcUrl, calls);

    // Native balance
    const nativeHex = results[0] as string;
    if (nativeHex) {
      const nativeWei = BigInt(nativeHex);
      const nativeBalance = Number(nativeWei) / 10 ** chain.native.decimals;
      if (nativeBalance > 0) {
        balances.push({
          symbol: chain.native.symbol,
          name: chain.native.name,
          balance: nativeBalance,
          coingeckoId: chain.native.coingeckoId,
          category: chain.native.category,
        });
      }
    }

    // Token balances
    for (let i = 0; i < chain.tokens.length; i++) {
      const hex = results[i + 1] as string;
      if (!hex || hex === "0x" || hex === "0x0") continue;
      try {
        const raw = BigInt(hex);
        if (raw === BigInt(0)) continue;
        const balance = Number(raw) / 10 ** chain.tokens[i].decimals;
        if (balance > 0) {
          balances.push({
            symbol: chain.tokens[i].symbol,
            name: chain.tokens[i].name,
            balance,
            coingeckoId: chain.tokens[i].coingeckoId,
            category: chain.tokens[i].category,
          });
        }
      } catch {
        // Skip malformed responses
      }
    }
  } catch (err) {
    console.error(`EVM fetch error (${blockchain}):`, err);
  }

  return balances;
}

/* ─── Jupiter APIs (prices + token metadata for all Solana tokens incl. Pump.fun) ── */

const JUPITER_PRICE_API = "https://api.jup.ag/price/v2";
const JUPITER_TOKEN_API = "https://tokens.jup.ag/token";
const SOL_NATIVE_MINT = "So11111111111111111111111111111111111111112";

interface JupiterPriceEntry {
  id: string;
  price: string;
}

/** Batch-fetch USD prices for Solana mints via Jupiter */
async function fetchJupiterPrices(mints: string[]): Promise<Record<string, number>> {
  if (mints.length === 0) return {};

  const prices: Record<string, number> = {};

  // Jupiter accepts up to ~100 ids per request — batch if needed
  const BATCH = 100;
  for (let i = 0; i < mints.length; i += BATCH) {
    const batch = mints.slice(i, i + BATCH);
    try {
      const url = `${JUPITER_PRICE_API}?ids=${batch.join(",")}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const json = await res.json();
      const data = json.data as Record<string, JupiterPriceEntry | null>;
      for (const [mint, entry] of Object.entries(data)) {
        if (entry && entry.price) {
          prices[mint] = parseFloat(entry.price);
        }
      }
    } catch {
      // continue with partial results
    }
  }

  return prices;
}

interface JupiterTokenMeta {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  tags?: string[];
}

/** Fetch metadata for a single token from Jupiter */
async function fetchJupiterTokenMeta(mint: string): Promise<JupiterTokenMeta | null> {
  try {
    const res = await fetch(`${JUPITER_TOKEN_API}/${mint}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Determine category based on Jupiter tags and known patterns */
function categorizeFromMeta(meta: JupiterTokenMeta | null): AssetCategory {
  if (!meta) return "memecoin"; // most unknown Solana tokens are memecoins
  const tags = meta.tags ?? [];
  if (tags.includes("pump")) return "memecoin";
  if (tags.includes("community")) return "memecoin";
  if (tags.includes("token-2022")) return "other";
  // Could be anything — default to memecoin for Pump.fun-era tokens
  return "memecoin";
}

/* ─── DexScreener fallback (covers Pump.fun bonding-curve tokens) ── */

interface DexScreenerInfo {
  priceUsd: number;
  change24h: number;
  symbol?: string;
  name?: string;
}

/**
 * Batch-fetch USD price, 24h change, and metadata from DexScreener for Solana mints.
 *
 * Used as a fallback for tokens Jupiter doesn't price — notably Pump.fun tokens
 * still on the bonding curve (pre-graduation to Raydium). DexScreener indexes the
 * Pump.fun AMM pools directly so those show up here even when Jupiter returns nothing.
 *
 * API: https://api.dexscreener.com/latest/dex/tokens/{mints} — up to 30 addresses per request.
 */
async function fetchDexScreenerSolana(
  mints: string[],
): Promise<Record<string, DexScreenerInfo>> {
  if (mints.length === 0) return {};

  const out: Record<string, DexScreenerInfo> = {};
  const BATCH = 30; // DexScreener allows up to 30 token addresses per request

  for (let i = 0; i < mints.length; i += BATCH) {
    const batch = mints.slice(i, i + BATCH);
    try {
      const url = `https://api.dexscreener.com/latest/dex/tokens/${batch.join(",")}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const json = (await res.json()) as { pairs?: unknown[] };
      const pairs = (json?.pairs ?? []) as Array<{
        chainId?: string;
        baseToken?: { address?: string; symbol?: string; name?: string };
        priceUsd?: string;
        priceChange?: { h24?: number | string };
        liquidity?: { usd?: number };
      }>;

      // For each requested mint, pick the highest-liquidity Solana pair where this
      // mint is the baseToken. Pump.fun pools show up on chainId "solana".
      for (const mint of batch) {
        const candidates = pairs.filter(
          (p) => p?.chainId === "solana" && p?.baseToken?.address === mint,
        );
        if (candidates.length === 0) continue;
        candidates.sort(
          (a, b) => (b?.liquidity?.usd ?? 0) - (a?.liquidity?.usd ?? 0),
        );
        const best = candidates[0];
        const priceUsd = parseFloat(best.priceUsd ?? "0");
        if (!priceUsd || !Number.isFinite(priceUsd)) continue;
        const rawChange = best?.priceChange?.h24;
        const change24h =
          typeof rawChange === "number"
            ? rawChange
            : parseFloat(String(rawChange ?? "0")) || 0;

        out[mint] = {
          priceUsd,
          change24h,
          symbol: best?.baseToken?.symbol,
          name: best?.baseToken?.name,
        };
      }
    } catch {
      // continue with partial results
    }
  }

  return out;
}

/* ─── Solana ─────────────────────────────────────── */

const SPL_TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const TOKEN_2022_PROGRAM = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";

interface MintBalance {
  mint: string;
  uiAmount: number;
}

function parseTokenAccounts(result: unknown): MintBalance[] {
  const accounts = (result as { value: unknown[] })?.value ?? [];
  const out: MintBalance[] = [];
  for (const acct of accounts as any[]) {
    const info = acct?.account?.data?.parsed?.info;
    if (!info) continue;
    const mint: string = info.mint;
    const uiAmount: number = info.tokenAmount?.uiAmount ?? 0;
    if (uiAmount <= 0) continue;
    out.push({ mint, uiAmount });
  }
  return out;
}

async function fetchSolanaBalances(address: string): Promise<RawBalance[]> {
  const balances: RawBalance[] = [];

  try {
    // 1. Fetch native SOL + SPL tokens + Token-2022 tokens.
    //    Pump.fun mints live on the classic SPL Token Program, so the SPL fetch
    //    already picks them up; Token-2022 is fetched to cover other tokens that
    //    use the newer program. Pricing for Pump.fun tokens is handled below via
    //    Jupiter (post-graduation) + DexScreener (bonding-curve phase).
    const [solResult, splResult, t22Result] = await Promise.all([
      jsonRpcWithFallback(SOLANA_RPCS, "getBalance", [address, { commitment: "confirmed" }]),
      jsonRpcWithFallback(SOLANA_RPCS, "getTokenAccountsByOwner", [
        address,
        { programId: SPL_TOKEN_PROGRAM },
        { encoding: "jsonParsed", commitment: "confirmed" },
      ]),
      jsonRpcWithFallback(SOLANA_RPCS, "getTokenAccountsByOwner", [
        address,
        { programId: TOKEN_2022_PROGRAM },
        { encoding: "jsonParsed", commitment: "confirmed" },
      ]).catch(() => ({ value: [] })), // Token-2022 might fail on some RPCs — that's ok
    ]);

    // Parse native SOL
    const solRaw = solResult as { value: number } | number;
    const solLamports = typeof solRaw === "number" ? solRaw : (solRaw?.value ?? 0);
    const solAmount = solLamports / 1e9;

    // Parse all token accounts (SPL + Token-2022)
    const mintBalances = [
      ...parseTokenAccounts(splResult),
      ...parseTokenAccounts(t22Result),
    ];

    console.log(`[Solana] ${address.slice(0, 8)}... → SOL: ${solAmount}, tokens: ${mintBalances.length}`);

    // 2. Collect ALL mints and fetch Jupiter prices
    const mintLookup = new Map(SOLANA_TOKENS.map((t) => [t.mint, t]));
    const allMints = mintBalances.map((m) => m.mint);
    if (solAmount > 0) allMints.push(SOL_NATIVE_MINT);

    const jupiterPrices = await fetchJupiterPrices(allMints);
    console.log(`[Jupiter] Prices returned for ${Object.keys(jupiterPrices).length}/${allMints.length} mints`);

    // 2b. Fallback — for mints Jupiter didn't price (typically Pump.fun tokens
    //     still on the bonding curve, pre-graduation), query DexScreener which
    //     indexes the Pump.fun AMM pools directly and also returns symbol/name.
    const missingMints = allMints.filter(
      (m) => jupiterPrices[m] === undefined && m !== SOL_NATIVE_MINT,
    );
    const dexInfo = await fetchDexScreenerSolana(missingMints);
    console.log(
      `[DexScreener] Prices returned for ${Object.keys(dexInfo).length}/${missingMints.length} mints`,
    );

    // 3. For unknown mints that have a Jupiter price but no DexScreener metadata,
    //    fall back to Jupiter's token metadata endpoint for symbol/name.
    const unknownNeedingMeta = mintBalances
      .filter(
        (m) =>
          !mintLookup.has(m.mint) &&
          jupiterPrices[m.mint] !== undefined &&
          !dexInfo[m.mint],
      )
      .map((m) => m.mint);

    const metaResults = await Promise.allSettled(
      unknownNeedingMeta.slice(0, 30).map((mint) => fetchJupiterTokenMeta(mint)),
    );
    const metaMap = new Map<string, JupiterTokenMeta>();
    unknownNeedingMeta.slice(0, 30).forEach((mint, i) => {
      const result = metaResults[i];
      if (result.status === "fulfilled" && result.value) {
        metaMap.set(mint, result.value);
      }
    });

    // 4. Build balances — native SOL
    if (solAmount > 0) {
      const solPrice = jupiterPrices[SOL_NATIVE_MINT] ?? 0;
      balances.push({
        symbol: "SOL",
        name: "Solana",
        balance: solAmount,
        coingeckoId: "solana",
        category: "blue-chip",
        resolvedPriceUsd: solPrice,
      });
    }

    // 5. Build balances — all SPL / Token-2022 tokens
    for (const { mint, uiAmount } of mintBalances) {
      const known = mintLookup.get(mint);
      const jupPrice = jupiterPrices[mint];
      const dex = dexInfo[mint];
      // Prefer Jupiter when available (tighter prices for liquid tokens);
      // fall back to DexScreener (covers Pump.fun bonding-curve tokens).
      const resolvedPrice = jupPrice ?? dex?.priceUsd;

      if (known) {
        balances.push({
          symbol: known.symbol,
          name: known.name,
          balance: uiAmount,
          coingeckoId: known.coingeckoId,
          category: known.category,
          ...(resolvedPrice !== undefined ? { resolvedPriceUsd: resolvedPrice } : {}),
          ...(dex?.change24h !== undefined ? { resolved24hChange: dex.change24h } : {}),
        });
      } else if (resolvedPrice !== undefined && resolvedPrice > 0) {
        // Unknown token with a price source — Pump.fun, memecoins, etc.
        const meta = metaMap.get(mint);
        const symbol =
          dex?.symbol ?? meta?.symbol ?? mint.slice(0, 4) + "..." + mint.slice(-4);
        const name = dex?.name ?? meta?.name ?? "Unknown Token";
        // Pump.fun mints conventionally end with "pump" — force memecoin bucket
        // when we recognise that suffix, otherwise use Jupiter tags.
        const isPumpFun = mint.toLowerCase().endsWith("pump");
        const category: AssetCategory = isPumpFun
          ? "memecoin"
          : categorizeFromMeta(meta ?? null);

        balances.push({
          symbol,
          name,
          balance: uiAmount,
          coingeckoId: "",
          category,
          resolvedPriceUsd: resolvedPrice,
          resolved24hChange: dex?.change24h ?? 0,
        });
      }
      // Skip tokens with no price from Jupiter or DexScreener (dust, dead, untradeable)
    }

    console.log(`[Solana] Final holdings: ${balances.length} tokens`);
  } catch (err) {
    console.error("Solana fetch error:", err);
  }

  return balances;
}

/* ─── Bitcoin ────────────────────────────────────── */

const WHITENODE_API = "https://www.whitenode.co/api";

interface Brc20Balance {
  ticker: string;
  overall_balance: string;
}

interface Brc20TickerStats {
  current_floor_price_satoshis_active_listings: string;
}

/**
 * Fetch BRC-20 holdings for a Bitcoin address from WhiteNode, then resolve each
 * ticker's floor price (in sats per token) and convert to USD using the current
 * BTC/USD price.
 *
 * - Balances:  /api/brc20/addresses/{addr}/tickers-balance
 * - Prices:    /api/market/v1/brc20/ticker/{TICKER}  → current_floor_price_satoshis_active_listings
 *
 * We only fetch ticker stats for tickers the address actually holds, and fail
 * soft — any individual ticker that fails or lacks a floor price is skipped.
 */
async function fetchBrc20Holdings(
  address: string,
  btcPriceUsd: number,
): Promise<RawBalance[]> {
  if (btcPriceUsd <= 0) return [];

  let balances: Brc20Balance[] = [];
  try {
    const res = await fetch(
      `${WHITENODE_API}/brc20/addresses/${address}/tickers-balance`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as Brc20Balance[] | { data?: Brc20Balance[] };
    balances = Array.isArray(json) ? json : json?.data ?? [];
  } catch (err) {
    console.error("BRC-20 balance fetch error:", err);
    return [];
  }

  if (balances.length === 0) return [];

  // Fetch floor prices in parallel — fail soft per ticker.
  const priceResults = await Promise.allSettled(
    balances.map(async (b) => {
      const res = await fetch(
        `${WHITENODE_API}/market/v1/brc20/ticker/${encodeURIComponent(b.ticker)}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Ticker ${b.ticker}: HTTP ${res.status}`);
      const json = (await res.json()) as { data?: Brc20TickerStats };
      const floorSats = parseFloat(
        json?.data?.current_floor_price_satoshis_active_listings ?? "0",
      );
      return floorSats;
    }),
  );

  const out: RawBalance[] = [];
  for (let i = 0; i < balances.length; i++) {
    const b = balances[i];
    const amount = parseFloat(b.overall_balance ?? "0");
    if (!Number.isFinite(amount) || amount <= 0) continue;

    const result = priceResults[i];
    if (result.status !== "fulfilled") continue;
    const floorSats = result.value;
    if (!Number.isFinite(floorSats) || floorSats <= 0) continue;

    // floor price is sats per whole token → convert to USD per token
    const tokenPriceUsd = (floorSats / 1e8) * btcPriceUsd;
    if (tokenPriceUsd <= 0) continue;

    out.push({
      symbol: b.ticker.toUpperCase(),
      name: `${b.ticker.toUpperCase()} (BRC-20)`,
      balance: amount,
      coingeckoId: "",
      category: "memecoin",
      resolvedPriceUsd: tokenPriceUsd,
      resolved24hChange: 0,
    });
  }

  console.log(`[BRC-20] ${address.slice(0, 8)}... → ${out.length} priced tickers`);
  return out;
}

async function fetchBitcoinBalance(address: string): Promise<RawBalance[]> {
  const out: RawBalance[] = [];

  // 1. Native BTC balance from Blockstream
  let btcAmount = 0;
  try {
    const res = await fetch(`https://blockstream.info/api/address/${address}`);
    if (res.ok) {
      const data = await res.json();
      const funded =
        (data.chain_stats?.funded_txo_sum ?? 0) +
        (data.mempool_stats?.funded_txo_sum ?? 0);
      const spent =
        (data.chain_stats?.spent_txo_sum ?? 0) +
        (data.mempool_stats?.spent_txo_sum ?? 0);
      const satoshis = funded - spent;
      btcAmount = satoshis / 1e8;
    }
  } catch (err) {
    console.error("Bitcoin fetch error:", err);
  }

  // 2. Fetch BTC spot price once — needed both for native BTC (if present)
  //    and to convert BRC-20 floor prices from sats → USD. We pre-resolve it
  //    so the BRC-20 entries have `resolvedPriceUsd` set and skip CoinGecko.
  const btcPrices = await fetchPrices(["bitcoin"]);
  const btcPriceUsd = btcPrices["bitcoin"]?.usd ?? 0;

  if (btcAmount > 0) {
    out.push({
      symbol: "BTC",
      name: "Bitcoin",
      balance: btcAmount,
      coingeckoId: "bitcoin",
      category: "blue-chip",
      ...(btcPriceUsd > 0 ? { resolvedPriceUsd: btcPriceUsd } : {}),
      ...(btcPrices["bitcoin"]?.usd_24h_change != null
        ? { resolved24hChange: btcPrices["bitcoin"].usd_24h_change }
        : {}),
    });
  }

  // 3. BRC-20 holdings via WhiteNode (priced in sats, converted to USD here)
  const brc20 = await fetchBrc20Holdings(address, btcPriceUsd);
  out.push(...brc20);

  return out;
}

/* ─── Tron ───────────────────────────────────────── */

async function fetchTronBalances(address: string): Promise<RawBalance[]> {
  const balances: RawBalance[] = [];

  try {
    const res = await fetch(`${TRON_API}/v1/accounts/${address}`);
    if (!res.ok) return [];

    const json = await res.json();
    const account = json.data?.[0];
    if (!account) return [];

    // Native TRX (stored in SUN, 1 TRX = 1,000,000 SUN)
    const trxSun = account.balance ?? 0;
    const trxAmount = trxSun / 1e6;
    if (trxAmount > 0) {
      balances.push({
        symbol: TRON_NATIVE.symbol,
        name: TRON_NATIVE.name,
        balance: trxAmount,
        coingeckoId: TRON_NATIVE.coingeckoId,
        category: TRON_NATIVE.category,
      });
    }

    // TRC20 tokens
    const trc20 = account.trc20 ?? [];
    const tokenLookup = new Map(TRON_TOKENS.map((t) => [t.address, t]));

    for (const entry of trc20) {
      for (const [contractAddr, rawAmount] of Object.entries(entry)) {
        const known = tokenLookup.get(contractAddr);
        if (!known) continue;
        const amount = Number(rawAmount) / 10 ** known.decimals;
        if (amount > 0) {
          balances.push({
            symbol: known.symbol,
            name: known.name,
            balance: amount,
            coingeckoId: known.coingeckoId,
            category: known.category,
          });
        }
      }
    }
  } catch (err) {
    console.error("Tron fetch error:", err);
  }

  return balances;
}

/* ─── Sui ────────────────────────────────────────── */

async function fetchSuiBalances(address: string): Promise<RawBalance[]> {
  const balances: RawBalance[] = [];

  try {
    const result = await jsonRpc(SUI_RPC, "suix_getAllBalances", [address]);
    const coinBalances = result as { coinType: string; totalBalance: string }[];

    const typeLookup = new Map(SUI_TOKENS.map((t) => [t.coinType, t]));

    for (const coin of coinBalances) {
      const known = typeLookup.get(coin.coinType);
      if (!known) {
        // Check if it's SUI native by suffix
        if (coin.coinType.endsWith("::sui::SUI")) {
          const amount = Number(coin.totalBalance) / 1e9;
          if (amount > 0) {
            balances.push({
              symbol: "SUI", name: "Sui", balance: amount,
              coingeckoId: "sui", category: "blue-chip",
            });
          }
        }
        continue;
      }

      const amount = Number(coin.totalBalance) / 10 ** known.decimals;
      if (amount > 0) {
        balances.push({
          symbol: known.symbol,
          name: known.name,
          balance: amount,
          coingeckoId: known.coingeckoId,
          category: known.category,
        });
      }
    }
  } catch (err) {
    console.error("Sui fetch error:", err);
  }

  return balances;
}

/* ═══════════════════════════════════════════════════
   Main orchestrator
   ═══════════════════════════════════════════════════ */

export async function fetchWalletData(
  address: string,
  blockchain: Blockchain,
): Promise<{ holdings: TokenHolding[]; totalValue: number; change24h: number }> {
  // 1. Fetch raw balances from the chain
  let rawBalances: RawBalance[];

  switch (blockchain) {
    case "solana":
      rawBalances = await fetchSolanaBalances(address);
      break;
    case "bitcoin":
      rawBalances = await fetchBitcoinBalance(address);
      break;
    case "tron":
      rawBalances = await fetchTronBalances(address);
      break;
    case "sui":
      rawBalances = await fetchSuiBalances(address);
      break;
    default:
      // EVM chains
      rawBalances = await fetchEvmBalances(address, blockchain);
      break;
  }

  if (rawBalances.length === 0) {
    return { holdings: [], totalValue: 0, change24h: 0 };
  }

  // 2. Collect CoinGecko IDs only for tokens that don't have a resolved price
  const neededIds = rawBalances
    .filter((b) => b.resolvedPriceUsd === undefined && b.coingeckoId.length > 0)
    .map((b) => b.coingeckoId);

  // 3. Fetch CoinGecko prices for tokens that need it
  const prices = await fetchPrices(neededIds);

  // 4. Build holdings with USD values
  const holdings: TokenHolding[] = [];

  for (const raw of rawBalances) {
    let priceUsd: number;
    let change: number;

    if (raw.resolvedPriceUsd !== undefined) {
      // Use pre-resolved price (e.g. from Jupiter)
      priceUsd = raw.resolvedPriceUsd;
      change = raw.resolved24hChange ?? 0;
      // If we also have a CoinGecko entry, prefer its 24h change data
      const cgPrice = prices[raw.coingeckoId];
      if (cgPrice) {
        change = cgPrice.usd_24h_change ?? change;
      }
    } else {
      const cgPrice = prices[raw.coingeckoId];
      priceUsd = cgPrice?.usd ?? 0;
      change = cgPrice?.usd_24h_change ?? 0;
    }

    const valueUsd = raw.balance * priceUsd;

    // Skip tokens with no price at all
    if (priceUsd === 0 && raw.coingeckoId === "") continue;

    holdings.push({
      symbol: raw.symbol,
      name: raw.name,
      category: raw.category,
      balance: raw.balance,
      valueUsd: Math.round(valueUsd * 100) / 100,
      change24h: Math.round(change * 100) / 100,
    });
  }

  // Sort by USD value descending
  holdings.sort((a, b) => b.valueUsd - a.valueUsd);

  // 5. Calculate totals
  const totalValue = holdings.reduce((s, h) => s + h.valueUsd, 0);
  const change24h =
    totalValue > 0
      ? holdings.reduce((s, h) => s + h.change24h * (h.valueUsd / totalValue), 0)
      : 0;

  return {
    holdings,
    totalValue: Math.round(totalValue * 100) / 100,
    change24h: Math.round(change24h * 100) / 100,
  };
}
