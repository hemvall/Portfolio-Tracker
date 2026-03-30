"use client";

import { useRef, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";
import { useShopStore } from "@/lib/shopStore";
import { getCharacterSprite, getStarField } from "@/lib/sprites";
import { Action } from "@/lib/types";
import {
  drawThemedBackground,
  getSkinnedColor,
  drawHat,
  drawTrail,
  drawAura,
} from "@/lib/shopRenderers";

const PIXEL_SIZE = 4;
const GROUND_Y_RATIO = 0.78;

function getAnimOffset(action: Action, time: number): { dx: number; dy: number; rot: number } {
  const t = time / 1000;
  switch (action) {
    case "dancing":
      return { dx: Math.sin(t * 8) * 6, dy: -Math.abs(Math.sin(t * 6)) * 14, rot: Math.sin(t * 6) * 0.15 };
    case "sleeping":
      return { dx: 0, dy: Math.sin(t * 1.5) * 2, rot: 0.2 };
    case "farting":
      return { dx: Math.sin(t * 12) * 3, dy: 0, rot: Math.sin(t * 5) * 0.1 };
    case "fighting":
      return { dx: Math.sin(t * 14) * 8, dy: -Math.abs(Math.sin(t * 8)) * 6, rot: Math.sin(t * 10) * 0.2 };
    case "meditating":
      return { dx: 0, dy: -6 + Math.sin(t * 2) * 4, rot: 0 };
    case "crying":
      return { dx: Math.sin(t * 8) * 2, dy: Math.sin(t * 3) * 2, rot: Math.sin(t * 4) * 0.05 };
    case "flexing":
      return { dx: 0, dy: Math.sin(t * 4) * 3, rot: Math.sin(t * 3) * 0.1 };
    case "panicking":
      return { dx: Math.sin(t * 16) * 10, dy: -Math.abs(Math.sin(t * 10)) * 10, rot: Math.sin(t * 12) * 0.25 };
    case "vibing":
      return { dx: Math.sin(t * 3) * 5, dy: Math.sin(t * 2) * 4, rot: Math.sin(t * 2) * 0.1 };
    case "scheming":
      return { dx: Math.sin(t * 1.5) * 3, dy: 0, rot: Math.sin(t * 1) * 0.05 };
    case "shitposting":
      return { dx: 0, dy: Math.sin(t * 4) * 2, rot: 0 };
    case "staring":
      return { dx: 0, dy: Math.sin(t * 0.8) * 1, rot: 0 };
    default:
      return { dx: 0, dy: 0, rot: 0 };
  }
}

const ACTION_PARTICLES: Partial<Record<Action, string>> = {
  sleeping: "z",
  crying: "~",
  farting: "~",
  dancing: "*",
  fighting: "!",
  meditating: "o",
  panicking: "!",
  vibing: "~",
};

function drawPixelSprite(
  ctx: CanvasRenderingContext2D,
  sprite: string[][],
  x: number,
  y: number,
  scale: number,
  rot: number
) {
  const ps = PIXEL_SIZE * scale;
  const w = sprite[0].length * ps;
  const h = sprite.length * ps;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.translate(-w / 2, -h / 2);
  for (let row = 0; row < sprite.length; row++) {
    for (let col = 0; col < sprite[row].length; col++) {
      const color = sprite[row][col];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(col * ps, row * ps, ps, ps);
      }
    }
  }
  ctx.restore();
}

function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string
) {
  ctx.save();
  ctx.font = "bold 11px monospace";
  const metrics = ctx.measureText(text);
  const tw = Math.min(metrics.width, 180);
  const padding = 8;
  const bw = tw + padding * 2;
  const bh = 22;
  const bx = x - bw / 2;
  const by = y - bh;
  ctx.fillStyle = "rgba(10, 10, 20, 0.85)";
  ctx.strokeStyle = color + "66";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(10, 10, 20, 0.85)";
  ctx.beginPath();
  ctx.moveTo(x - 4, by + bh);
  ctx.lineTo(x, by + bh + 6);
  ctx.lineTo(x + 4, by + bh);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, by + bh / 2, 180);
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string
) {
  ctx.save();
  ctx.font = "bold 10px monospace";
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawActionParticles(
  ctx: CanvasRenderingContext2D,
  action: Action,
  x: number,
  y: number,
  color: string,
  time: number
) {
  const sym = ACTION_PARTICLES[action];
  if (!sym) return;
  ctx.save();
  ctx.font = "10px monospace";
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.6 + Math.sin(time * 0.005) * 0.3;
  for (let i = 0; i < 2; i++) {
    const px = x + Math.sin(time * 0.003 + i * 3) * 20 + (i - 0.5) * 16;
    const py = y - 30 - Math.sin(time * 0.004 + i * 2) * 10 - i * 8;
    ctx.fillText(sym, px, py);
  }
  ctx.restore();
}

function drawSelectionRing(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, time: number) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.globalAlpha = 0.6 + Math.sin(time * 0.005) * 0.3;
  ctx.beginPath();
  ctx.ellipse(x, y + 4, radius, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Trail position history - stored outside component for persistence across renders
const trailHistory: Record<string, Array<{ x: number; y: number }>> = {};
const MAX_TRAIL_LENGTH = 15;

export function PixelScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<ReturnType<typeof getStarField>>([]);
  const animRef = useRef<number>(0);
  const lastThemeRef = useRef<string>("");
  const characters = useStore((s) => s.characters);
  const tick = useStore((s) => s.tick);
  const setSelected = useStore((s) => s.setSelectedCharacter);
  const selected = useStore((s) => s.selectedCharacter);

  useEffect(() => {
    const interval = setInterval(tick, 50);
    return () => clearInterval(interval);
  }, [tick]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const themeId = useShopStore.getState().equippedBackground;
    const needsResize = canvas.width !== w * dpr || canvas.height !== h * dpr;
    const themeChanged = themeId !== lastThemeRef.current;

    if (needsResize) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    if (needsResize || themeChanged) {
      starsRef.current = getStarField(w, h, 12345);
      lastThemeRef.current = themeId;
    }

    const time = performance.now();
    const groundY = h * GROUND_Y_RATIO;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw themed background (sky, particles, silhouettes, terrain, floor)
    drawThemedBackground(ctx, w, h, groundY, time, themeId, starsRef.current);

    // Get shop equipment state
    const equippedItems = useShopStore.getState().equippedItems;

    // Characters
    const chars = useStore.getState().characters;
    const sorted = [...chars].sort((a, b) => a.position[0] - b.position[0]);

    for (const char of sorted) {
      const anim = getAnimOffset(char.currentAction, time);
      const cx = char.position[0] + anim.dx;
      const cy = groundY - (char.scale * 12 * PIXEL_SIZE) / 2 + anim.dy;

      // Get equipment for this character
      const equip = equippedItems[char.id];
      const skinColor = getSkinnedColor(equip?.skin || null, char.token.color, time);

      // Update trail history
      if (!trailHistory[char.id]) trailHistory[char.id] = [];
      const trail = trailHistory[char.id];
      if (trail.length === 0 || Math.abs(trail[0].x - cx) > 1 || Math.abs(trail[0].y - cy) > 1) {
        trail.unshift({ x: cx, y: cy });
        if (trail.length > MAX_TRAIL_LENGTH) trail.pop();
      }

      // Draw trail (behind everything)
      drawTrail(ctx, equip?.trail || null, trail, skinColor, time);

      // Draw aura (behind sprite)
      drawAura(ctx, equip?.aura || null, cx, cy, char.scale, skinColor, time);

      // Character glow under
      const glowGrd = ctx.createRadialGradient(cx, groundY, 0, cx, groundY, char.scale * 30);
      glowGrd.addColorStop(0, skinColor + "22");
      glowGrd.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrd;
      ctx.fillRect(cx - 40, groundY - 10, 80, 20);

      // Selection ring
      if (selected === char.id) {
        drawSelectionRing(ctx, cx, groundY, char.scale * 28, skinColor, time);
      }

      // Draw sprite with skin color
      const sprite = getCharacterSprite(skinColor, char.currentAction);
      drawPixelSprite(ctx, sprite, cx, cy, char.scale, anim.rot);

      // Draw hat (above sprite)
      const spriteTopY = cy - (char.scale * 12 * PIXEL_SIZE) / 2;
      drawHat(ctx, equip?.hat || null, cx, spriteTopY + 2, char.scale, time);

      // Action particles
      drawActionParticles(ctx, char.currentAction, cx, cy, skinColor, time);

      // Label
      drawLabel(ctx, char.token.symbol, cx, groundY + 14, skinColor);

      // Speech bubble
      if (char.speechBubble) {
        const bubbleY = cy - char.scale * 20 - 10;
        drawSpeechBubble(ctx, char.speechBubble, cx, bubbleY, skinColor);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [selected]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const groundY = rect.height * GROUND_Y_RATIO;
    const chars = useStore.getState().characters;

    let clicked: string | null = null;
    for (const char of chars) {
      const spriteH = char.scale * 12 * PIXEL_SIZE;
      const spriteW = char.scale * 12 * PIXEL_SIZE;
      const cx = char.position[0];
      const cy = groundY - spriteH / 2;
      if (
        mx > cx - spriteW / 2 - 10 &&
        mx < cx + spriteW / 2 + 10 &&
        my > cy - spriteH / 2 - 10 &&
        my < cy + spriteH / 2 + 10
      ) {
        clicked = char.id;
        break;
      }
    }
    setSelected(clicked);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      onClick={handleClick}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
