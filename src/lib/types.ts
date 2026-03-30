export type Personality = "chad" | "introvert" | "gremlin" | "zen" | "drama" | "goofball";
export type Mood = "moon" | "pump" | "dump" | "crab";
export type Action =
  | "dancing"
  | "sleeping"
  | "farting"
  | "fighting"
  | "meditating"
  | "crying"
  | "flexing"
  | "panicking"
  | "vibing"
  | "scheming"
  | "shitposting"
  | "staring";

export interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  holdings: number;
  value: number;
  color: string;
  personality: Personality;
  mood: Mood;
}

export interface CharacterState {
  id: string;
  token: TokenData;
  position: [number, number, number];
  targetPosition: [number, number, number];
  currentAction: Action;
  speechBubble: string | null;
  speechTimer: number;
  actionTimer: number;
  scale: number;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: number;
  character: string;
  color: string;
  message: string;
}

export interface CharacterEquipment {
  hat: string | null;
  trail: string | null;
  aura: string | null;
  skin: string | null;
}
