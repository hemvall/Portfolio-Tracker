import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CharacterEquipment } from "./types";
import { ShopCategory, getItemById } from "./shopData";

interface ShopState {
  coins: number;
  ownedItems: string[];
  equippedBackground: string;
  equippedItems: Record<string, CharacterEquipment>;

  shopOpen: boolean;
  shopTab: ShopCategory;
  selectedCharForEquip: string | null;

  openShop: () => void;
  closeShop: () => void;
  setShopTab: (tab: ShopCategory) => void;
  setSelectedCharForEquip: (id: string | null) => void;
  purchaseItem: (itemId: string) => boolean;
  equipBackground: (itemId: string) => void;
  equipItem: (characterId: string, slot: "hat" | "trail" | "aura" | "skin", itemId: string | null) => void;
}

const DEFAULT_EQUIPMENT: CharacterEquipment = {
  hat: null,
  trail: null,
  aura: null,
  skin: null,
};

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      coins: 5000,
      ownedItems: ["bg-default", "aura-none", "skin-default"],
      equippedBackground: "bg-default",
      equippedItems: {},

      shopOpen: false,
      shopTab: "background",
      selectedCharForEquip: null,

      openShop: () => set({ shopOpen: true }),
      closeShop: () => set({ shopOpen: false }),
      setShopTab: (tab) => set({ shopTab: tab }),
      setSelectedCharForEquip: (id) => set({ selectedCharForEquip: id }),

      purchaseItem: (itemId: string) => {
        const item = getItemById(itemId);
        if (!item) return false;
        const { coins, ownedItems } = get();
        if (ownedItems.includes(itemId)) return false;
        if (coins < item.price) return false;
        set({
          coins: coins - item.price,
          ownedItems: [...ownedItems, itemId],
        });
        return true;
      },

      equipBackground: (itemId: string) => {
        const { ownedItems } = get();
        if (!ownedItems.includes(itemId)) return;
        set({ equippedBackground: itemId });
      },

      equipItem: (characterId, slot, itemId) => {
        const { ownedItems, equippedItems } = get();
        if (itemId && !ownedItems.includes(itemId)) return;
        const current = equippedItems[characterId] || { ...DEFAULT_EQUIPMENT };
        set({
          equippedItems: {
            ...equippedItems,
            [characterId]: { ...current, [slot]: itemId },
          },
        });
      },
    }),
    {
      name: "bagfolk-shop",
      partialize: (state) => ({
        coins: state.coins,
        ownedItems: state.ownedItems,
        equippedBackground: state.equippedBackground,
        equippedItems: state.equippedItems,
      }),
    }
  )
);
