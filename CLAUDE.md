# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Next.js dev server (http://localhost:3000)
npm run build   # Production build
npm run start   # Run built app
npm run lint    # ESLint via eslint-config-next
```

There is no test runner configured in this project.

## Architecture

BagTown (package name `bagfolk`) is a Next.js 14 App Router app that visualizes crypto wallets as characters wandering a 3D village. It has two routes and a single API endpoint; almost all complexity lives in the 3D scene and the wallet-fetching layer.

### Request flow: wallet address → character in the village

1. **Landing page** (`src/app/page.tsx`) — user picks a chain, pastes an address, submits.
2. **API route** (`src/app/api/wallet/analyze/route.ts`) — POSTs `{ address, blockchain }`, calls `fetchWalletData` then `analyzePersonality`, returns `{ holdings, totalValue, change24h, personality }`.
3. **Store** (`src/lib/store.ts`) — `addAnalyzedWallet` builds a `WalletData` (assigns `startX/startZ` on a ring of radius 10–17, picks name/mood based on `ChainType`) and persists the whole array to `localStorage` under the key `bagtown_wallets`.
4. **Redirect** to `/portfolio` (`src/app/portfolio/page.tsx`), which hydrates the store from `localStorage` and renders the 3D scene plus 2D HUD overlays.

The landing page also redirects to `/portfolio` on mount if the store already has wallets after hydration, so returning users skip the form.

### State: `useVillageStore` (Zustand)

Single global store in `src/lib/store.ts`. Key pieces other code depends on:

- `wallets: WalletData[]` — source of truth, mirrored to `localStorage` through `saveWallets`/`loadWallets`. Never mutate directly; use `addAnalyzedWallet` / `removeWallet`.
- `hydrated` + `hydrateFromStorage()` — must be called once on the client (both `page.tsx` and `portfolio/page.tsx` do this in an effect). Everything SSR-unsafe is gated on `hydrated`.
- `selectedWallet` — click-to-lock state. `setSelectedWallet` toggles off if the same wallet is clicked again. Drives both `InfoPanel` visibility and `CameraRig` focus.
- `hoveredWallet` — drives the `Tooltip` that follows the cursor.
- `characterPositions: Record<id, {x,z}>` — characters report their live positions each frame via `updateCharacterPosition` (with a small epsilon to avoid thrashing the store); the camera rig reads this to track the selected character.

### 3D scene (`src/components/`)

- **`Village.tsx`** — the single `<Canvas>`. Sets fog, lights, and mounts `World`, `Characters`, and `CameraRig`. Loaded via `next/dynamic` with `ssr: false` from `portfolio/page.tsx` because R3F touches `window`.
- **`World.tsx`** — static geometry (ground, plaza, paths, buildings, trees). Uses a village radius constant `VRAD = 21`.
- **`Characters.tsx`** — one character per wallet, wandering inside `VRAD` with collision against building `CBOXES` (must stay in sync with the buildings in `World.tsx`). Each character uses `CHAIN_CONFIGS[wallet.chain].scale` for size and exposes a canvas-drawn `NameTag` sprite. On click it calls `setSelectedWallet`; it also writes its position to `characterPositions` every frame.
- **`CameraRig.tsx`** — custom orbit camera (spherical coords: `theta`, `phi`, `radius`) with mouse drag/wheel input bound directly to the canvas. When a `selectedWallet` exists it smoothly lerps `target` toward `characterPositions[id]` and clamps radius to `FOCUS_RADIUS = 18`; otherwise it eases back to `DEFAULT_RADIUS = 44`. User scroll during focus is respected.

### 2D HUD (rendered above the canvas in `portfolio/page.tsx`)

`CustomCursor`, `Scanlines`, `AmbientParticles` (all in `Overlays.tsx`), `Topbar`, `InfoPanel` (shown when `selectedWallet` is set), `Tooltip` (shown when `hoveredWallet` is set). `Topbar` also embeds `AddWalletModal` and `PortfolioBar`.

### Chain model: two parallel type systems

This is the single most important thing to understand before editing types or the wallet pipeline:

- **`Blockchain`** (`src/lib/types.ts`) — the 10 real networks the fetcher supports: `ethereum | solana | bitcoin | bnb | polygon | avalanche | base | arbitrum | tron | sui`. Used by the UI, the API route, and `wallet-fetcher.ts`.
- **`ChainType`** — only 5 archetype buckets (`btc | eth | sol | meme | stable`) that drive the character's visual style and default name/mood in the store. Every `Blockchain` collapses to a `ChainType` through `blockchainToChainType()`.

`CHAIN_CONFIGS` is keyed by `ChainType`, not by `Blockchain`. When adding a new real chain, register it in `Blockchain`, `BLOCKCHAIN_OPTIONS`, add a case in `blockchainToChainType`, and add a fetcher branch — do **not** add a new `ChainType` unless you're introducing a new visual archetype.

### `src/lib/wallet-fetcher.ts` — on-chain balance + price aggregation

One file, ~790 lines, orchestrated by `fetchWalletData(address, blockchain)`:

1. Dispatch to a chain-specific balance fetcher that returns `RawBalance[]`:
   - EVM chains (ethereum, polygon, bnb, avalanche, base, arbitrum) → `fetchEvmBalances` — single batched `eth_call` JSON-RPC request against a hardcoded token registry (`EVM_CHAINS`) using the `balanceOf(address)` signature `0x70a08231`.
   - Solana → `fetchSolanaBalances` — uses Jupiter for prices via `fetchJupiterPrices`/`fetchJupiterTokenMeta`, so SPL tokens arrive with `resolvedPriceUsd` already set and skip CoinGecko.
   - Bitcoin → `fetchBitcoinBalance` (blockchain.info or similar public endpoint).
   - Tron → `fetchTronBalances`; Sui → `fetchSuiBalances`.
2. For anything without a pre-resolved price, call `fetchPrices` → CoinGecko `/simple/price` (keyed by `coingeckoId`, returns USD + `usd_24h_change`).
3. Build `TokenHolding[]`, sort by USD value, compute portfolio `totalValue` and a value-weighted `change24h`.

RPC helpers: `jsonRpc`, `jsonRpcBatch` (batched requests, resorted by id), `jsonRpcWithFallback` (tries multiple endpoints). Adding a new EVM token is just another row in the relevant `EVM_CHAINS[chain].tokens` array — the batch call and price lookup pick it up automatically.

### `src/lib/personality.ts` — archetype assignment

`analyzePersonality(holdings, totalValue)` buckets holdings by `AssetCategory`, computes percentages, and walks the `ARCHETYPES` array in order (Whale → Degen → Yield Farmer → NFT Collector → Diamond Hand → Stablecoin Maxi → Infrastructure Nerd → Balanced Sage). **Order matters** — the first matching `test` wins, and `Balanced Sage` is the `() => true` fallback and must remain last. The Whale test is purely on `totalValue`, so it short-circuits before any category test.

## Conventions

- TypeScript strict mode, path alias `@/*` → `src/*`.
- Any component that touches `window`, `document`, or three.js must be a client component (`"use client"`) and, if mounted from a server component, loaded via `next/dynamic` with `ssr: false` (see how `Village` is imported in `portfolio/page.tsx`).
- Heavy visual styling is inline `style={{...}}` rather than Tailwind classes; Tailwind is configured but used sparingly for layout. The Orbitron font and the `glow-input`/`glow-button` classes are defined in `src/app/globals.css`.
