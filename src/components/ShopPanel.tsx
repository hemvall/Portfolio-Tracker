"use client";

import { useShopStore } from "@/lib/shopStore";
import { ShopCategory, getItemsByCategory, ShopItem } from "@/lib/shopData";
import { MOCK_TOKENS } from "@/lib/mockData";

const TABS: { key: ShopCategory; label: string; icon: string }[] = [
  { key: "background", label: "BGs", icon: "🌃" },
  { key: "hat", label: "Hats", icon: "👑" },
  { key: "trail", label: "Trails", icon: "✨" },
  { key: "aura", label: "Auras", icon: "🔥" },
  { key: "skin", label: "Skins", icon: "🎨" },
];

const SLOT_MAP: Record<string, "hat" | "trail" | "aura" | "skin"> = {
  hat: "hat",
  trail: "trail",
  aura: "aura",
  skin: "skin",
};

function ItemCard({ item }: { item: ShopItem }) {
  const coins = useShopStore((s) => s.coins);
  const owned = useShopStore((s) => s.ownedItems);
  const equippedBg = useShopStore((s) => s.equippedBackground);
  const equippedItems = useShopStore((s) => s.equippedItems);
  const selectedChar = useShopStore((s) => s.selectedCharForEquip);
  const purchase = useShopStore((s) => s.purchaseItem);
  const equipBg = useShopStore((s) => s.equipBackground);
  const equipItem = useShopStore((s) => s.equipItem);

  const isOwned = owned.includes(item.id);
  const canAfford = coins >= item.price;
  const isFree = item.price === 0;

  // Check if equipped
  let isEquipped = false;
  if (item.category === "background") {
    isEquipped = equippedBg === item.id;
  } else if (selectedChar) {
    const charEquip = equippedItems[selectedChar];
    const slot = SLOT_MAP[item.category];
    if (slot) {
      isEquipped = charEquip?.[slot] === item.id;
    }
  }

  const handleBuy = () => {
    purchase(item.id);
  };

  const handleEquip = () => {
    if (item.category === "background") {
      equipBg(item.id);
    } else if (selectedChar) {
      const slot = SLOT_MAP[item.category];
      if (slot) {
        equipItem(selectedChar, slot, isEquipped ? null : item.id);
      }
    }
  };

  return (
    <div
      className="glass-sm p-3 flex flex-col gap-2 transition-all hover:border-white/20"
      style={{
        borderColor: isEquipped ? "#00f0ff44" : undefined,
        boxShadow: isEquipped ? "0 0 15px rgba(0, 240, 255, 0.15)" : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg">{item.preview}</span>
        {!isFree && (
          <span className="text-xs font-mono" style={{ color: "#ffcc00" }}>
            {item.price} <span className="text-[10px]">coins</span>
          </span>
        )}
        {isFree && (
          <span className="text-[10px] text-white/30 uppercase">free</span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-white/90">{item.name}</p>
        <p className="text-[10px] text-white/40 leading-relaxed">{item.description}</p>
      </div>
      <div>
        {isOwned ? (
          <button
            onClick={handleEquip}
            className="w-full text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-md transition-all"
            style={{
              background: isEquipped
                ? "rgba(0, 240, 255, 0.15)"
                : "rgba(255, 255, 255, 0.05)",
              color: isEquipped ? "#00f0ff" : "rgba(255, 255, 255, 0.5)",
              border: `1px solid ${isEquipped ? "#00f0ff44" : "rgba(255, 255, 255, 0.08)"}`,
            }}
          >
            {isEquipped ? "equipped" : item.category === "background" || selectedChar ? "equip" : "select a bag first"}
          </button>
        ) : (
          <button
            onClick={handleBuy}
            disabled={!canAfford}
            className="w-full text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-md transition-all"
            style={{
              background: canAfford
                ? "linear-gradient(135deg, rgba(191, 0, 255, 0.2), rgba(255, 110, 199, 0.2))"
                : "rgba(255, 255, 255, 0.03)",
              color: canAfford ? "#ff6ec7" : "rgba(255, 255, 255, 0.2)",
              border: `1px solid ${canAfford ? "#ff6ec744" : "rgba(255, 255, 255, 0.05)"}`,
              cursor: canAfford ? "pointer" : "not-allowed",
            }}
          >
            {canAfford ? "buy" : "can't afford"}
          </button>
        )}
      </div>
    </div>
  );
}

function CharacterSelector() {
  const selectedChar = useShopStore((s) => s.selectedCharForEquip);
  const setChar = useShopStore((s) => s.setSelectedCharForEquip);
  const equippedItems = useShopStore((s) => s.equippedItems);

  return (
    <div className="flex gap-1.5 mb-3">
      {MOCK_TOKENS.map((token) => {
        const isActive = selectedChar === token.symbol;
        const hasEquip = equippedItems[token.symbol] &&
          Object.values(equippedItems[token.symbol]).some(Boolean);
        return (
          <button
            key={token.symbol}
            onClick={() => setChar(isActive ? null : token.symbol)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all"
            style={{
              background: isActive ? `${token.color}22` : "rgba(255,255,255,0.03)",
              border: `1px solid ${isActive ? token.color + "66" : "transparent"}`,
              boxShadow: isActive ? `0 0 10px ${token.color}33` : "none",
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: token.color,
                boxShadow: `0 0 6px ${token.color}`,
              }}
            />
            <span
              className="text-[9px] font-bold"
              style={{ color: isActive ? token.color : "rgba(255,255,255,0.4)" }}
            >
              {token.symbol}
            </span>
            {hasEquip && (
              <div className="w-1 h-1 rounded-full bg-neon-blue" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function ShopPanel() {
  const isOpen = useShopStore((s) => s.shopOpen);
  const close = useShopStore((s) => s.closeShop);
  const coins = useShopStore((s) => s.coins);
  const tab = useShopStore((s) => s.shopTab);
  const setTab = useShopStore((s) => s.setShopTab);

  const items = getItemsByCategory(tab);
  const isCharCategory = tab !== "background";

  if (!isOpen) return null;

  return (
    <div
      className="absolute left-4 top-4 bottom-20 z-20 w-80 flex flex-col glass overflow-hidden"
      style={{ animation: "slideInLeft 0.3s ease-out" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h2
            className="text-sm font-black uppercase tracking-widest"
            style={{
              background: "linear-gradient(135deg, #ff6ec7, #bf00ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            shop
          </h2>
          <div className="flex items-center gap-1 glass-sm px-2 py-0.5">
            <span className="text-xs">🪙</span>
            <span className="text-xs font-mono font-bold" style={{ color: "#ffcc00" }}>
              {coins}
            </span>
          </div>
        </div>
        <button
          onClick={close}
          className="text-white/30 hover:text-white/60 transition-colors text-lg leading-none"
        >
          &times;
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 py-2 border-b border-white/5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all"
            style={{
              background: tab === t.key ? "rgba(0, 240, 255, 0.1)" : "transparent",
              color: tab === t.key ? "#00f0ff" : "rgba(255,255,255,0.35)",
              border: `1px solid ${tab === t.key ? "#00f0ff33" : "transparent"}`,
            }}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Character selector (for non-background tabs) */}
      {isCharCategory && (
        <div className="px-3 pt-2">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5">
            equip to:
          </p>
          <CharacterSelector />
        </div>
      )}

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
