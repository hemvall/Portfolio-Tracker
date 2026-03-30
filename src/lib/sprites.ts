// Pixel art sprite definitions - each is a grid of hex colors (or "" for transparent)
// Sprites are 14x14 pixels for characters, each personality has a unique shape

import { Action, Personality } from "./types";

type Sprite = string[][];

type EyeStyle = "normal" | "closed" | "wide" | "sad" | "angry";

// ============================================================
// PERSONALITY SPRITES — each has a unique body shape and face
// ============================================================

// CHAD: Big square-ish, strong jaw, smirk
function makeChadSprite(b: string, eye: EyeStyle): Sprite {
  const _ = "";
  const w = "#ffffff";
  const k = "#111111";
  const d = darken(b); // darker shade for shading

  if (eye === "closed") {
    return [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, d, d, d, d, _, _, _, _, _],
      [_, _, _, _, d, b, b, b, b, d, _, _, _, _],
      [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
      [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
      [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
      [_, _, b, b, k, k, b, b, k, k, b, b, _, _],
      [_, _, b, b, b, b, b, b, b, b, b, b, _, _],
      [_, _, b, b, b, b, k, k, b, b, b, b, _, _],
      [_, _, b, b, b, k, b, b, k, b, b, b, _, _],
      [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
      [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
      [_, _, _, _, b, b, _, _, b, b, _, _, _, _],
      [_, _, _, _, b, b, _, _, b, b, _, _, _, _],
    ];
  }
  const e = eye === "angry" ? "#ff4444" : eye === "sad" ? "#aaddff" : w;
  const es = eye === "wide" ? 1 : 0; // extra pupil shift

  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, d, d, d, d, _, _, _, _, _],
    [_, _, _, _, d, b, b, b, b, d, _, _, _, _],
    [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
    [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
    [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
    [_, _, b, b, e, e, b, b, e, e, b, b, _, _],
    [_, _, b, b, k, e, b, b, k, e, b, b, _, _],
    [_, _, b, b, b, b, b, b, b, b, b, b, _, _],
    [_, _, b, b, b, k, k, k, k, b, b, b, _, _],
    [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
    [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
    [_, _, _, _, b, b, _, _, b, b, _, _, _, _],
    [_, _, _, _, b, b, _, _, b, b, _, _, _, _],
  ];
}

// INTROVERT: Small, round, hood-like top, tiny eyes
function makeIntrovertSprite(b: string, eye: EyeStyle): Sprite {
  const _ = "";
  const k = "#111111";
  const d = darken(b);
  const h = darken(darken(b)); // hood color

  if (eye === "closed") {
    return [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, h, h, h, h, _, _, _, _, _],
      [_, _, _, _, h, h, h, h, h, h, _, _, _, _],
      [_, _, _, h, h, h, h, h, h, h, h, _, _, _],
      [_, _, _, h, d, b, b, b, b, d, h, _, _, _],
      [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
      [_, _, _, _, b, k, b, b, k, b, _, _, _, _],
      [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
      [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
      [_, _, _, _, d, b, b, b, b, d, _, _, _, _],
      [_, _, _, _, _, d, b, b, d, _, _, _, _, _],
      [_, _, _, _, _, b, _, _, b, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];
  }
  const e = eye === "angry" ? "#ff4444" : eye === "sad" ? "#aaddff" : "#cccccc";

  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, h, h, h, h, _, _, _, _, _],
    [_, _, _, _, h, h, h, h, h, h, _, _, _, _],
    [_, _, _, h, h, h, h, h, h, h, h, _, _, _],
    [_, _, _, h, d, b, b, b, b, d, h, _, _, _],
    [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
    [_, _, _, _, b, e, k, b, e, k, _, _, _, _],
    [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
    [_, _, _, _, b, b, k, b, b, b, _, _, _, _],
    [_, _, _, _, d, b, b, b, b, d, _, _, _, _],
    [_, _, _, _, _, d, b, b, d, _, _, _, _, _],
    [_, _, _, _, _, b, _, _, b, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
}

// GREMLIN: Wide, short, big mouth, chaotic
function makeGremlinSprite(b: string, eye: EyeStyle): Sprite {
  const _ = "";
  const w = "#ffffff";
  const k = "#111111";
  const d = darken(b);
  const t = "#ffcc00"; // teeth

  if (eye === "closed") {
    return [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, d, d, d, d, d, d, d, d, _, _, _],
      [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
      [_, d, b, b, b, b, b, b, b, b, b, b, d, _],
      [_, d, b, b, k, k, b, b, k, k, b, b, d, _],
      [_, d, b, b, b, b, b, b, b, b, b, b, d, _],
      [_, d, b, t, k, k, k, k, k, k, t, b, d, _],
      [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
      [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
      [_, _, _, _, d, d, d, d, d, d, _, _, _, _],
      [_, _, _, b, b, _, _, _, _, b, b, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];
  }
  const e = eye === "angry" ? "#ff4444" : eye === "sad" ? "#aaddff" : eye === "wide" ? w : "#ffcc00";

  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, d, d, d, d, d, d, d, d, _, _, _],
    [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
    [_, d, b, b, b, b, b, b, b, b, b, b, d, _],
    [_, d, b, e, e, k, b, b, e, e, k, b, d, _],
    [_, d, b, e, k, k, b, b, e, k, k, b, d, _],
    [_, d, b, t, k, k, k, k, k, k, t, b, d, _],
    [_, _, d, b, _, t, _, _, t, _, b, d, _, _],
    [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
    [_, _, _, _, d, d, d, d, d, d, _, _, _, _],
    [_, _, _, b, b, _, _, _, _, b, b, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
}

// ZEN: Tall, slender, peaceful oval, serene
function makeZenSprite(b: string, eye: EyeStyle): Sprite {
  const _ = "";
  const k = "#111111";
  const d = darken(b);
  const l = lighten(b); // light highlight

  if (eye === "closed") {
    return [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, l, l, _, _, _, _, _, _],
      [_, _, _, _, _, l, b, b, l, _, _, _, _, _],
      [_, _, _, _, l, b, b, b, b, l, _, _, _, _],
      [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
      [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
      [_, _, _, _, b, k, b, b, k, b, _, _, _, _],
      [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
      [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
      [_, _, _, _, d, b, b, b, b, d, _, _, _, _],
      [_, _, _, _, d, b, b, b, b, d, _, _, _, _],
      [_, _, _, _, _, d, b, b, d, _, _, _, _, _],
      [_, _, _, _, _, _, b, b, _, _, _, _, _, _],
      [_, _, _, _, _, b, _, _, b, _, _, _, _, _],
    ];
  }
  const e = eye === "angry" ? "#ff4444" : eye === "sad" ? "#aaddff" : "#ffffff";

  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, l, l, _, _, _, _, _, _],
    [_, _, _, _, _, l, b, b, l, _, _, _, _, _],
    [_, _, _, _, l, b, b, b, b, l, _, _, _, _],
    [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
    [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
    [_, _, _, _, b, e, k, b, e, k, _, _, _, _],
    [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
    [_, _, _, _, b, b, k, k, b, b, _, _, _, _],
    [_, _, _, _, d, b, b, b, b, d, _, _, _, _],
    [_, _, _, _, d, b, b, b, b, d, _, _, _, _],
    [_, _, _, _, _, d, b, b, d, _, _, _, _, _],
    [_, _, _, _, _, _, b, b, _, _, _, _, _, _],
    [_, _, _, _, _, b, _, _, b, _, _, _, _, _],
  ];
}

// DRAMA: Expressive, teardrop shape, big expressive features
function makeDramaSprite(b: string, eye: EyeStyle): Sprite {
  const _ = "";
  const w = "#ffffff";
  const k = "#111111";
  const d = darken(b);
  const a = "#ff6ec7"; // blush

  if (eye === "closed") {
    return [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, d, d, d, d, _, _, _, _, _],
      [_, _, _, _, d, b, b, b, b, d, _, _, _, _],
      [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
      [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
      [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
      [_, _, b, b, k, k, b, b, k, k, b, b, _, _],
      [_, _, b, b, b, b, b, b, b, b, b, b, _, _],
      [_, _, b, a, b, b, b, b, b, b, a, b, _, _],
      [_, _, _, b, b, b, k, k, b, b, b, _, _, _],
      [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
      [_, _, _, _, _, b, b, b, b, _, _, _, _, _],
      [_, _, _, _, _, _, b, b, _, _, _, _, _, _],
      [_, _, _, _, _, b, _, _, b, _, _, _, _, _],
    ];
  }
  const e = eye === "angry" ? "#ff4444" : eye === "sad" ? "#aaddff" : w;
  // Drama gets BIG eyes
  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, d, d, d, d, _, _, _, _, _],
    [_, _, _, _, d, b, b, b, b, d, _, _, _, _],
    [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
    [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
    [_, _, d, b, e, e, e, b, e, e, e, d, _, _],
    [_, _, b, b, e, k, e, b, e, k, e, b, _, _],
    [_, _, b, b, e, e, e, b, e, e, e, b, _, _],
    [_, _, b, a, b, b, b, b, b, b, a, b, _, _],
    [_, _, _, b, b, b, k, k, b, b, b, _, _, _],
    [_, _, _, _, b, b, b, b, b, b, _, _, _, _],
    [_, _, _, _, _, b, b, b, b, _, _, _, _, _],
    [_, _, _, _, _, _, b, b, _, _, _, _, _, _],
    [_, _, _, _, _, b, _, _, b, _, _, _, _, _],
  ];
}

// GOOFBALL: Blobby, bouncy, derp face, big smile
function makeGoofballSprite(b: string, eye: EyeStyle): Sprite {
  const _ = "";
  const w = "#ffffff";
  const k = "#111111";
  const d = darken(b);
  const t = "#ff4466"; // tongue

  if (eye === "closed") {
    return [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, d, d, d, d, d, d, _, _, _, _],
      [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
      [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
      [_, _, b, b, b, b, b, b, b, b, b, b, _, _],
      [_, _, b, b, k, k, b, b, k, k, b, b, _, _],
      [_, _, b, b, b, b, b, b, b, b, b, b, _, _],
      [_, _, b, b, k, k, k, k, k, k, b, b, _, _],
      [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
      [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
      [_, _, _, _, d, d, d, d, d, d, _, _, _, _],
      [_, _, _, _, b, _, _, _, _, b, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];
  }
  const e = eye === "angry" ? "#ff4444" : eye === "sad" ? "#aaddff" : w;
  // One eye bigger than the other for derp
  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, d, d, d, d, d, d, _, _, _, _],
    [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
    [_, _, d, b, b, b, b, b, b, b, b, d, _, _],
    [_, _, b, b, e, e, b, b, b, e, b, b, _, _],
    [_, _, b, b, k, e, b, b, b, k, b, b, _, _],
    [_, _, b, b, e, e, b, b, b, e, b, b, _, _],
    [_, _, b, b, k, k, k, k, k, k, b, b, _, _],
    [_, _, d, b, b, b, b, t, t, b, b, d, _, _],
    [_, _, _, d, b, b, b, b, b, b, d, _, _, _],
    [_, _, _, _, d, d, d, d, d, d, _, _, _, _],
    [_, _, _, _, b, _, _, _, _, b, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
}

// Color helpers
function darken(hex: string): string {
  if (hex.startsWith("hsl") || hex.startsWith("rgb")) return hex; // skip computed colors
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 40);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 40);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 40);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function lighten(hex: string): string {
  if (hex.startsWith("hsl") || hex.startsWith("rgb")) return hex;
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 50);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 50);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 50);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Action-specific eye styles
const ACTION_EYES: Record<Action, EyeStyle> = {
  dancing: "normal",
  sleeping: "closed",
  farting: "wide",
  fighting: "angry",
  meditating: "closed",
  crying: "sad",
  flexing: "normal",
  panicking: "wide",
  vibing: "normal",
  scheming: "normal",
  shitposting: "normal",
  staring: "wide",
};

const SPRITE_MAKERS: Record<Personality, (body: string, eye: EyeStyle) => Sprite> = {
  chad: makeChadSprite,
  introvert: makeIntrovertSprite,
  gremlin: makeGremlinSprite,
  zen: makeZenSprite,
  drama: makeDramaSprite,
  goofball: makeGoofballSprite,
};

export function getCharacterSprite(color: string, action: Action, personality: Personality = "goofball"): Sprite {
  const maker = SPRITE_MAKERS[personality] || makeGoofballSprite;
  return maker(color, ACTION_EYES[action]);
}

// Particle sprites for actions
export function getActionParticles(action: Action): { emoji: string; count: number } | null {
  switch (action) {
    case "sleeping": return { emoji: "💤", count: 1 };
    case "crying": return { emoji: "💧", count: 2 };
    case "farting": return { emoji: "💨", count: 2 };
    case "dancing": return { emoji: "✨", count: 2 };
    case "fighting": return { emoji: "💥", count: 1 };
    case "meditating": return { emoji: "🕊️", count: 1 };
    case "flexing": return { emoji: "💪", count: 1 };
    case "panicking": return { emoji: "❗", count: 2 };
    case "vibing": return { emoji: "🎵", count: 2 };
    case "scheming": return { emoji: "💡", count: 1 };
    case "shitposting": return { emoji: "📱", count: 1 };
    default: return null;
  }
}

// Background tile sprites
export function getStarField(width: number, height: number, seed: number): Array<{ x: number; y: number; size: number; brightness: number }> {
  const stars: Array<{ x: number; y: number; size: number; brightness: number }> = [];
  let s = seed;
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
  const count = Math.floor((width * height) / 3000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * width,
      y: rand() * height * 0.65,
      size: rand() < 0.9 ? 1 : 2,
      brightness: 0.3 + rand() * 0.7,
    });
  }
  return stars;
}
