export type ShopCategory = "background" | "hat" | "trail" | "aura" | "skin";

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  description: string;
  preview: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // Backgrounds
  { id: "bg-default", name: "Neon City", category: "background", price: 0, description: "The OG cyberpunk cityscape", preview: "🌃" },
  { id: "bg-ocean", name: "Deep Ocean", category: "background", price: 150, description: "Underwater vibes with bubbles and coral", preview: "🌊" },
  { id: "bg-volcano", name: "Lava Fields", category: "background", price: 200, description: "Volcanic hellscape. Very bullish.", preview: "🌋" },
  { id: "bg-space", name: "Deep Space", category: "background", price: 250, description: "Nebulas, asteroids, pure cosmic degen", preview: "🚀" },
  { id: "bg-matrix", name: "The Matrix", category: "background", price: 300, description: "Follow the green code, anon", preview: "🟢" },
  { id: "bg-vaporwave", name: "Vaporwave", category: "background", price: 350, description: "A E S T H E T I C sunset paradise", preview: "🌅" },

  // Hats
  { id: "hat-crown", name: "Crown", category: "hat", price: 100, description: "For the king of your portfolio", preview: "👑" },
  { id: "hat-halo", name: "Halo", category: "hat", price: 120, description: "Angelic energy only", preview: "😇" },
  { id: "hat-horns", name: "Devil Horns", category: "hat", price: 80, description: "Someone's been shorting", preview: "😈" },
  { id: "hat-antenna", name: "Antenna", category: "hat", price: 60, description: "Receiving signals from the whales", preview: "📡" },
  { id: "hat-tophat", name: "Top Hat", category: "hat", price: 150, description: "Classy degen", preview: "🎩" },
  { id: "hat-wizard", name: "Wizard Hat", category: "hat", price: 180, description: "TA wizard confirmed", preview: "🧙" },

  // Trails
  { id: "trail-sparkle", name: "Sparkle", category: "trail", price: 80, description: "Leave glitter everywhere", preview: "✨" },
  { id: "trail-fire", name: "Fire", category: "trail", price: 120, description: "This bag is on FIRE", preview: "🔥" },
  { id: "trail-rainbow", name: "Rainbow", category: "trail", price: 200, description: "Taste the rainbow, ser", preview: "🌈" },
  { id: "trail-ghost", name: "Ghost", category: "trail", price: 100, description: "Spooky after-images", preview: "👻" },
  { id: "trail-money", name: "Money", category: "trail", price: 250, description: "Making it rain", preview: "💸" },

  // Auras
  { id: "aura-none", name: "None", category: "aura", price: 0, description: "Just the default glow", preview: "⭕" },
  { id: "aura-flame", name: "Flame", category: "aura", price: 100, description: "Engulfed in bullish fire", preview: "🔥" },
  { id: "aura-ice", name: "Ice", category: "aura", price: 100, description: "Cool as a crypto winter", preview: "❄️" },
  { id: "aura-electric", name: "Electric", category: "aura", price: 150, description: "Shocking gains", preview: "⚡" },
  { id: "aura-shadow", name: "Shadow", category: "aura", price: 120, description: "Dark pool energy", preview: "🌑" },
  { id: "aura-holy", name: "Holy", category: "aura", price: 200, description: "Blessed by satoshi himself", preview: "✝️" },

  // Skins
  { id: "skin-default", name: "Default", category: "skin", price: 0, description: "Token's native color", preview: "🎨" },
  { id: "skin-gold", name: "Gold", category: "skin", price: 200, description: "Drip harder than your portfolio", preview: "🥇" },
  { id: "skin-holographic", name: "Holographic", category: "skin", price: 300, description: "Shifts colors like a rare card", preview: "🪞" },
  { id: "skin-glitch", name: "Glitch", category: "skin", price: 250, description: "Error 404: losses not found", preview: "📟" },
  { id: "skin-diamond", name: "Diamond", category: "skin", price: 400, description: "Diamond hands, diamond body", preview: "💎" },
];

export function getItemsByCategory(category: ShopCategory): ShopItem[] {
  return SHOP_ITEMS.filter((item) => item.category === category);
}

export function getItemById(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((item) => item.id === id);
}
