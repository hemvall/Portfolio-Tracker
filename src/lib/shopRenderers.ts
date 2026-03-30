// Canvas drawing functions for all shop customizations

import { getStarField } from "./sprites";

// ============================================================
// THEMED BACKGROUNDS
// ============================================================

interface ThemeConfig {
  skyGradient: [string, string, string];
  ambientOrbs: Array<{ x: number; y: number; r: number; color: string }>;
  drawParticles: (ctx: CanvasRenderingContext2D, w: number, h: number, time: number, stars: ReturnType<typeof getStarField>) => void;
  drawSilhouettes: (ctx: CanvasRenderingContext2D, w: number, groundY: number, time: number) => void;
  drawTerrain: (ctx: CanvasRenderingContext2D, w: number, groundY: number, time: number) => void;
  drawFloor: (ctx: CanvasRenderingContext2D, w: number, h: number, groundY: number, time: number) => void;
  horizonColor: string;
}

// --- DEFAULT (Neon City) ---
const defaultTheme: ThemeConfig = {
  skyGradient: ["#020210", "#060618", "#0a0a20"],
  ambientOrbs: [
    { x: 0.2, y: 0.3, r: 200, color: "0, 240, 255" },
    { x: 0.8, y: 0.25, r: 150, color: "191, 0, 255" },
    { x: 0.5, y: 0.5, r: 180, color: "255, 110, 199" },
  ],
  drawParticles: (ctx, _w, _h, time, stars) => {
    for (const star of stars) {
      const twinkle = star.brightness * (0.5 + 0.5 * Math.sin(time * 0.002 + star.x * 0.1 + star.y * 0.1));
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    }
  },
  drawSilhouettes: (ctx, w, groundY, time) => {
    const buildingColors = ["#0d0d1a", "#0f0f22", "#111128"];
    let seed = 42;
    const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; };
    for (let bx = 20; bx < w; bx += 40 + rand() * 30) {
      const bw = 16 + rand() * 28;
      const bh = 30 + rand() * 80;
      const by = groundY - bh;
      ctx.fillStyle = buildingColors[Math.floor(rand() * buildingColors.length)];
      ctx.fillRect(bx, by, bw, bh);
      for (let wy = by + 6; wy < groundY - 8; wy += 10) {
        for (let wx = bx + 4; wx < bx + bw - 4; wx += 8) {
          const lit = rand() > 0.4;
          if (lit) {
            const flicker = 0.6 + Math.sin(time * 0.001 + wx * 0.1 + wy * 0.1) * 0.3;
            const hue = rand() > 0.7 ? "#ff6ec7" : rand() > 0.5 ? "#00f0ff" : "#ffcc44";
            ctx.fillStyle = hue;
            ctx.globalAlpha = flicker * 0.6;
            ctx.fillRect(wx, wy, 3, 4);
            ctx.globalAlpha = 1;
          }
        }
      }
    }
  },
  drawTerrain: (ctx, w, groundY, time) => {
    drawMountainLayer(ctx, w, groundY, "#0a0a1a", 40, 1.2, time * 0.005);
    drawMountainLayer(ctx, w, groundY, "#08081a", 25, 2.0, time * 0.01 + 500);
  },
  drawFloor: drawDefaultFloor,
  horizonColor: "#00f0ff",
};

// --- OCEAN ---
const oceanTheme: ThemeConfig = {
  skyGradient: ["#010818", "#041428", "#082038"],
  ambientOrbs: [
    { x: 0.3, y: 0.4, r: 200, color: "0, 180, 200" },
    { x: 0.7, y: 0.3, r: 160, color: "0, 100, 180" },
    { x: 0.5, y: 0.6, r: 140, color: "0, 220, 180" },
  ],
  drawParticles: (ctx, w, h, time) => {
    // Bubbles floating up
    for (let i = 0; i < 40; i++) {
      const phase = i * 137.508;
      const x = (phase * 7.3) % w;
      const speed = 0.02 + (i % 5) * 0.008;
      const y = h - ((time * speed + phase * 20) % (h * 0.8));
      const size = 2 + (i % 3);
      const alpha = 0.15 + Math.sin(time * 0.003 + i) * 0.1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 220, 255, ${alpha})`;
      ctx.fill();
    }
  },
  drawSilhouettes: (ctx, w, groundY) => {
    // Coral silhouettes
    let seed = 88;
    const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; };
    ctx.fillStyle = "#0a1a2a";
    for (let cx = 30; cx < w; cx += 60 + rand() * 80) {
      const ch = 20 + rand() * 50;
      const cw = 8 + rand() * 15;
      // Coral branch
      ctx.beginPath();
      ctx.moveTo(cx, groundY);
      ctx.lineTo(cx - cw / 2, groundY - ch);
      ctx.lineTo(cx - cw / 4, groundY - ch * 0.6);
      ctx.lineTo(cx, groundY - ch * 0.9);
      ctx.lineTo(cx + cw / 4, groundY - ch * 0.6);
      ctx.lineTo(cx + cw / 2, groundY - ch);
      ctx.lineTo(cx + cw, groundY);
      ctx.closePath();
      ctx.fill();
    }
  },
  drawTerrain: (ctx, w, groundY, time) => {
    // Wavy seaweed terrain
    ctx.fillStyle = "#061825";
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    for (let x = 0; x <= w; x += 3) {
      const y = groundY - 15 - Math.sin(x * 0.02 + time * 0.001) * 10 - Math.sin(x * 0.05) * 5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, groundY);
    ctx.closePath();
    ctx.fill();
  },
  drawFloor: (ctx, w, h, groundY, time) => {
    // Sandy seabed
    const grd = ctx.createLinearGradient(0, groundY, 0, h);
    grd.addColorStop(0, "#0a1828");
    grd.addColorStop(1, "#061220");
    ctx.fillStyle = grd;
    ctx.fillRect(0, groundY, w, h - groundY);
    // Ripple lines
    ctx.strokeStyle = "#ffffff06";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const y = groundY + i * i * 3;
      if (y > h) break;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const ry = y + Math.sin(x * 0.03 + time * 0.002 + i) * 3;
        x === 0 ? ctx.moveTo(x, ry) : ctx.lineTo(x, ry);
      }
      ctx.stroke();
    }
    // Horizon glow
    const hlGrd = ctx.createLinearGradient(0, 0, w, 0);
    hlGrd.addColorStop(0, "transparent");
    hlGrd.addColorStop(0.5, "#00cccc33");
    hlGrd.addColorStop(1, "transparent");
    ctx.strokeStyle = hlGrd;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();
  },
  horizonColor: "#00cccc",
};

// --- VOLCANO ---
const volcanoTheme: ThemeConfig = {
  skyGradient: ["#100200", "#1a0800", "#2a0a00"],
  ambientOrbs: [
    { x: 0.3, y: 0.4, r: 200, color: "255, 80, 0" },
    { x: 0.7, y: 0.3, r: 180, color: "255, 40, 0" },
    { x: 0.5, y: 0.5, r: 150, color: "255, 120, 0" },
  ],
  drawParticles: (ctx, w, h, time) => {
    // Floating embers
    for (let i = 0; i < 50; i++) {
      const phase = i * 137.508;
      const x = (phase * 5.7 + Math.sin(time * 0.001 + i) * 30) % w;
      const speed = 0.015 + (i % 4) * 0.006;
      const y = h * 0.7 - ((time * speed + phase * 15) % (h * 0.7));
      const size = 1 + (i % 2);
      const alpha = 0.3 + Math.sin(time * 0.005 + i) * 0.2;
      ctx.fillStyle = i % 3 === 0 ? `rgba(255, 200, 50, ${alpha})` : `rgba(255, 100, 20, ${alpha})`;
      ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
    }
  },
  drawSilhouettes: (ctx, w, groundY) => {
    // Jagged volcanic rocks
    let seed = 55;
    const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; };
    ctx.fillStyle = "#1a0500";
    for (let rx = 10; rx < w; rx += 30 + rand() * 50) {
      const rh = 20 + rand() * 60;
      ctx.beginPath();
      ctx.moveTo(rx, groundY);
      ctx.lineTo(rx + 5, groundY - rh);
      ctx.lineTo(rx + 10 + rand() * 10, groundY - rh * 0.5);
      ctx.lineTo(rx + 20 + rand() * 10, groundY - rh * 0.8);
      ctx.lineTo(rx + 30, groundY);
      ctx.closePath();
      ctx.fill();
    }
  },
  drawTerrain: (ctx, w, groundY, time) => {
    drawMountainLayer(ctx, w, groundY, "#1a0800", 50, 0.8, time * 0.003);
    drawMountainLayer(ctx, w, groundY, "#140600", 30, 1.5, time * 0.005 + 300);
  },
  drawFloor: (ctx, w, h, groundY, time) => {
    const grd = ctx.createLinearGradient(0, groundY, 0, h);
    grd.addColorStop(0, "#1a0a00");
    grd.addColorStop(0.5, "#0d0500");
    grd.addColorStop(1, "#050200");
    ctx.fillStyle = grd;
    ctx.fillRect(0, groundY, w, h - groundY);
    // Lava crack grid
    ctx.strokeStyle = "#ff440012";
    ctx.lineWidth = 1;
    const vanishX = w / 2;
    for (let i = -15; i <= 15; i++) {
      ctx.beginPath();
      ctx.moveTo(vanishX + i * 40, groundY);
      ctx.lineTo(vanishX + i * 160, h);
      ctx.stroke();
    }
    for (let i = 0; i < 10; i++) {
      const y = groundY + i * i * 2.5;
      if (y > h) break;
      ctx.globalAlpha = 0.06;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // Lava glow horizon
    const hlGrd = ctx.createLinearGradient(0, groundY - 10, 0, groundY + 10);
    hlGrd.addColorStop(0, "transparent");
    hlGrd.addColorStop(0.5, `rgba(255, 80, 0, ${0.15 + Math.sin(time * 0.002) * 0.05})`);
    hlGrd.addColorStop(1, "transparent");
    ctx.fillStyle = hlGrd;
    ctx.fillRect(0, groundY - 10, w, 20);
  },
  horizonColor: "#ff4400",
};

// --- DEEP SPACE ---
const spaceTheme: ThemeConfig = {
  skyGradient: ["#000005", "#02001a", "#05002a"],
  ambientOrbs: [
    { x: 0.25, y: 0.35, r: 250, color: "80, 0, 200" },
    { x: 0.75, y: 0.25, r: 200, color: "0, 50, 200" },
    { x: 0.5, y: 0.55, r: 220, color: "150, 0, 180" },
    { x: 0.15, y: 0.6, r: 150, color: "0, 100, 255" },
  ],
  drawParticles: (ctx, w, h, time, stars) => {
    // Dense twinkling starfield
    for (const star of stars) {
      const twinkle = star.brightness * (0.4 + 0.6 * Math.sin(time * 0.003 + star.x * 0.05 + star.y * 0.05));
      const hue = (star.x * 0.5 + star.y * 0.3) % 360;
      ctx.fillStyle = `hsla(${hue}, 30%, 90%, ${twinkle})`;
      ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    }
    // Extra bright stars across whole canvas
    for (let i = 0; i < 20; i++) {
      const phase = i * 97.3;
      const x = (phase * 11.3) % w;
      const y = (phase * 7.7) % (h * 0.75);
      const pulse = 0.3 + Math.sin(time * 0.004 + i * 2) * 0.3;
      ctx.fillStyle = `rgba(200, 220, 255, ${pulse})`;
      ctx.fillRect(Math.floor(x), Math.floor(y), 2, 2);
    }
  },
  drawSilhouettes: (ctx, w, groundY, time) => {
    // Floating asteroids
    let seed = 77;
    const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 8; i++) {
      const ax = (rand() * w + time * 0.01 * (i % 2 === 0 ? 1 : -1)) % w;
      const ay = groundY - 40 - rand() * 120;
      const as = 6 + rand() * 14;
      ctx.fillStyle = "#0a0a20";
      ctx.beginPath();
      ctx.ellipse(ax, ay, as, as * 0.7, rand() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  drawTerrain: () => { /* no mountains in space */ },
  drawFloor: (ctx, w, h, groundY, time) => {
    const grd = ctx.createLinearGradient(0, groundY, 0, h);
    grd.addColorStop(0, "#08001a");
    grd.addColorStop(1, "#020008");
    ctx.fillStyle = grd;
    ctx.fillRect(0, groundY, w, h - groundY);
    // Faint grid
    ctx.strokeStyle = "#6600ff08";
    ctx.lineWidth = 1;
    const vanishX = w / 2;
    for (let i = -15; i <= 15; i++) {
      ctx.beginPath();
      ctx.moveTo(vanishX + i * 40, groundY);
      ctx.lineTo(vanishX + i * 160, h);
      ctx.stroke();
    }
    // Horizon
    const hlGrd = ctx.createLinearGradient(0, 0, w, 0);
    hlGrd.addColorStop(0, "transparent");
    hlGrd.addColorStop(0.5, "#6600ff33");
    hlGrd.addColorStop(1, "transparent");
    ctx.strokeStyle = hlGrd;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();
  },
  horizonColor: "#6600ff",
};

// --- MATRIX ---
const matrixTheme: ThemeConfig = {
  skyGradient: ["#000500", "#000a00", "#001000"],
  ambientOrbs: [
    { x: 0.3, y: 0.4, r: 200, color: "0, 255, 0" },
    { x: 0.7, y: 0.3, r: 160, color: "0, 180, 0" },
  ],
  drawParticles: (ctx, w, h, time) => {
    // Falling green code rain
    ctx.font = "10px monospace";
    const cols = Math.floor(w / 14);
    for (let i = 0; i < cols; i++) {
      const x = i * 14;
      const speed = 40 + (i * 17) % 60;
      const offset = (time * 0.05 * (0.5 + (i % 3) * 0.3) + i * 100) % (h + 200);
      for (let j = 0; j < 12; j++) {
        const y = offset - j * 16;
        if (y < 0 || y > h * 0.78) continue;
        const alpha = (1 - j / 12) * 0.5;
        const char = String.fromCharCode(0x30A0 + ((i * 7 + j * 13 + Math.floor(time * 0.01)) % 96));
        ctx.fillStyle = j === 0 ? `rgba(200, 255, 200, ${alpha + 0.3})` : `rgba(0, 255, 70, ${alpha})`;
        ctx.fillText(char, x, y);
      }
    }
  },
  drawSilhouettes: () => { /* no cityscape in matrix */ },
  drawTerrain: () => { /* no mountains */ },
  drawFloor: (ctx, w, h, groundY, time) => {
    const grd = ctx.createLinearGradient(0, groundY, 0, h);
    grd.addColorStop(0, "#001a00");
    grd.addColorStop(1, "#000800");
    ctx.fillStyle = grd;
    ctx.fillRect(0, groundY, w, h - groundY);
    // Bright green grid
    ctx.strokeStyle = "#00ff4418";
    ctx.lineWidth = 1;
    const vanishX = w / 2;
    for (let i = -15; i <= 15; i++) {
      ctx.beginPath();
      ctx.moveTo(vanishX + i * 40, groundY);
      ctx.lineTo(vanishX + i * 160, h);
      ctx.stroke();
    }
    for (let i = 0; i < 10; i++) {
      const y = groundY + i * i * 2.5;
      if (y > h) break;
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // Green horizon
    const hlGrd = ctx.createLinearGradient(0, 0, w, 0);
    hlGrd.addColorStop(0, "transparent");
    hlGrd.addColorStop(0.5, "#00ff4444");
    hlGrd.addColorStop(1, "transparent");
    ctx.strokeStyle = hlGrd;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();
  },
  horizonColor: "#00ff44",
};

// --- VAPORWAVE ---
const vaporwaveTheme: ThemeConfig = {
  skyGradient: ["#1a0030", "#3a0060", "#ff6090"],
  ambientOrbs: [
    { x: 0.3, y: 0.3, r: 250, color: "255, 100, 200" },
    { x: 0.7, y: 0.4, r: 200, color: "200, 50, 255" },
    { x: 0.5, y: 0.2, r: 180, color: "255, 150, 100" },
  ],
  drawParticles: (ctx, w, h, time, stars) => {
    // Soft pastel stars
    for (const star of stars) {
      const twinkle = star.brightness * (0.3 + 0.4 * Math.sin(time * 0.002 + star.x * 0.08));
      ctx.fillStyle = `rgba(255, 200, 255, ${twinkle})`;
      ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    }
    // Sun
    const sunX = w * 0.5;
    const sunY = h * 0.45;
    const sunR = 60;
    const sunGrd = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
    sunGrd.addColorStop(0, "rgba(255, 200, 100, 0.8)");
    sunGrd.addColorStop(0.5, "rgba(255, 100, 150, 0.4)");
    sunGrd.addColorStop(1, "transparent");
    ctx.fillStyle = sunGrd;
    ctx.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);
    // Horizontal lines through sun
    for (let i = 0; i < 8; i++) {
      const ly = sunY - sunR + i * (sunR * 2 / 8) + 10;
      ctx.fillStyle = "#1a003088";
      ctx.fillRect(sunX - sunR, ly, sunR * 2, 3 + i * 0.5);
    }
  },
  drawSilhouettes: (ctx, w, groundY) => {
    // Palm tree silhouettes
    const palmPositions = [80, 200, 500, 650, 780];
    ctx.fillStyle = "#1a002a";
    for (const px of palmPositions) {
      // Trunk
      ctx.fillRect(px - 2, groundY - 70, 4, 70);
      // Fronds
      ctx.beginPath();
      ctx.ellipse(px, groundY - 75, 25, 10, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(px, groundY - 75, 25, 10, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(px, groundY - 80, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  drawTerrain: (ctx, w, groundY) => {
    drawMountainLayer(ctx, w, groundY, "#2a0050", 35, 1.0, 100);
    drawMountainLayer(ctx, w, groundY, "#200040", 20, 1.8, 400);
  },
  drawFloor: (ctx, w, h, groundY, time) => {
    const grd = ctx.createLinearGradient(0, groundY, 0, h);
    grd.addColorStop(0, "#200040");
    grd.addColorStop(1, "#0a0018");
    ctx.fillStyle = grd;
    ctx.fillRect(0, groundY, w, h - groundY);
    // Pink/purple grid
    ctx.strokeStyle = "#ff44aa18";
    ctx.lineWidth = 1;
    const vanishX = w / 2;
    for (let i = -15; i <= 15; i++) {
      ctx.beginPath();
      ctx.moveTo(vanishX + i * 40, groundY);
      ctx.lineTo(vanishX + i * 160, h);
      ctx.stroke();
    }
    for (let i = 0; i < 10; i++) {
      const y = groundY + i * i * 2.5;
      if (y > h) break;
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // Hot pink horizon
    const hlGrd = ctx.createLinearGradient(0, 0, w, 0);
    hlGrd.addColorStop(0, "transparent");
    hlGrd.addColorStop(0.5, "#ff44aa55");
    hlGrd.addColorStop(1, "transparent");
    ctx.strokeStyle = hlGrd;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();
  },
  horizonColor: "#ff44aa",
};

const THEMES: Record<string, ThemeConfig> = {
  "bg-default": defaultTheme,
  "bg-ocean": oceanTheme,
  "bg-volcano": volcanoTheme,
  "bg-space": spaceTheme,
  "bg-matrix": matrixTheme,
  "bg-vaporwave": vaporwaveTheme,
};

// Shared mountain drawing helper
function drawMountainLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  groundY: number,
  color: string,
  amplitude: number,
  freq: number,
  offset: number
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = 0; x <= w; x += 3) {
    const y = groundY - amplitude * (
      Math.sin((x + offset) * freq * 0.003) * 0.5 +
      Math.sin((x + offset) * freq * 0.007 + 1) * 0.3 +
      Math.sin((x + offset) * freq * 0.013 + 2) * 0.2
    );
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, groundY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDefaultFloor(ctx: CanvasRenderingContext2D, w: number, h: number, groundY: number, _time: number) {
  const grd = ctx.createLinearGradient(0, groundY, 0, h);
  grd.addColorStop(0, "#0d0d1f");
  grd.addColorStop(0.3, "#0a0a18");
  grd.addColorStop(1, "#050510");
  ctx.fillStyle = grd;
  ctx.fillRect(0, groundY, w, h - groundY);

  ctx.strokeStyle = "#ffffff08";
  ctx.lineWidth = 1;
  const vanishX = w / 2;
  for (let i = -15; i <= 15; i++) {
    ctx.beginPath();
    ctx.moveTo(vanishX + i * 40, groundY);
    ctx.lineTo(vanishX + i * 160, h);
    ctx.stroke();
  }
  for (let i = 0; i < 12; i++) {
    const y = groundY + i * i * 2.5;
    if (y > h) break;
    ctx.globalAlpha = 0.08 - i * 0.005;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const hlGrd = ctx.createLinearGradient(0, 0, w, 0);
  hlGrd.addColorStop(0, "transparent");
  hlGrd.addColorStop(0.3, "#bf00ff33");
  hlGrd.addColorStop(0.5, "#00f0ff44");
  hlGrd.addColorStop(0.7, "#bf00ff33");
  hlGrd.addColorStop(1, "transparent");
  ctx.strokeStyle = hlGrd;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();

  const glowGrd = ctx.createLinearGradient(0, groundY - 20, 0, groundY + 20);
  glowGrd.addColorStop(0, "transparent");
  glowGrd.addColorStop(0.5, "#00f0ff08");
  glowGrd.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrd;
  ctx.fillRect(0, groundY - 20, w, 40);
}

// Main entry point for themed background
export function drawThemedBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  groundY: number,
  time: number,
  themeId: string,
  stars: ReturnType<typeof getStarField>
) {
  const theme = THEMES[themeId] || THEMES["bg-default"];

  // Sky
  const skyGrd = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGrd.addColorStop(0, theme.skyGradient[0]);
  skyGrd.addColorStop(0.5, theme.skyGradient[1]);
  skyGrd.addColorStop(1, theme.skyGradient[2]);
  ctx.fillStyle = skyGrd;
  ctx.fillRect(0, 0, w, groundY);

  // Ambient glow orbs
  for (const orb of theme.ambientOrbs) {
    const ox = orb.x * w + Math.sin(time * 0.0005 + orb.x * 10) * 50;
    const oy = orb.y * h + Math.cos(time * 0.0007 + orb.y * 10) * 30;
    const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
    grad.addColorStop(0, `rgba(${orb.color}, 0.06)`);
    grad.addColorStop(1, `rgba(${orb.color}, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(ox - orb.r, oy - orb.r, orb.r * 2, orb.r * 2);
  }

  // Particles (stars / bubbles / embers / rain)
  theme.drawParticles(ctx, w, h, time, stars);
  // Silhouettes (buildings / coral / rocks)
  theme.drawSilhouettes(ctx, w, groundY, time);
  // Terrain (mountains / seaweed)
  theme.drawTerrain(ctx, w, groundY, time);
  // Floor + grid
  theme.drawFloor(ctx, w, h, groundY, time);
}

// ============================================================
// CHARACTER CUSTOMIZATIONS
// ============================================================

// --- SKINS ---
export function getSkinnedColor(skinId: string | null, baseColor: string, time: number): string {
  if (!skinId || skinId === "skin-default") return baseColor;
  switch (skinId) {
    case "skin-gold":
      return "#ffd700";
    case "skin-holographic": {
      const hue = (time * 0.05) % 360;
      return `hsl(${hue}, 80%, 60%)`;
    }
    case "skin-glitch": {
      const glitch = Math.sin(time * 0.01) > 0.3;
      if (glitch) {
        // Invert-ish color
        const r = 255 - parseInt(baseColor.slice(1, 3), 16);
        const g = 255 - parseInt(baseColor.slice(3, 5), 16);
        const b = 255 - parseInt(baseColor.slice(5, 7), 16);
        return `rgb(${r},${g},${b})`;
      }
      return baseColor;
    }
    case "skin-diamond": {
      const shimmer = 0.7 + Math.sin(time * 0.008) * 0.3;
      return `hsl(200, 60%, ${50 + shimmer * 30}%)`;
    }
    default:
      return baseColor;
  }
}

// --- HATS ---
export function drawHat(
  ctx: CanvasRenderingContext2D,
  hatId: string | null,
  x: number,
  y: number,
  scale: number,
  time: number
) {
  if (!hatId) return;
  ctx.save();
  const ps = 4 * scale; // pixel size

  switch (hatId) {
    case "hat-crown": {
      const cw = 7 * ps;
      const ch = 3 * ps;
      const cx = x - cw / 2;
      const cy = y - ch;
      ctx.fillStyle = "#ffd700";
      ctx.shadowColor = "#ffd700";
      ctx.shadowBlur = 6;
      // Base
      ctx.fillRect(cx, cy + 2 * ps, cw, ps);
      // Points
      ctx.fillRect(cx, cy, ps, 2 * ps);
      ctx.fillRect(cx + 3 * ps, cy, ps, 2 * ps);
      ctx.fillRect(cx + 6 * ps, cy, ps, 2 * ps);
      // Gems
      ctx.fillStyle = "#ff0044";
      ctx.fillRect(cx + ps, cy + ps, ps, ps);
      ctx.fillStyle = "#00f0ff";
      ctx.fillRect(cx + 4 * ps, cy + ps, ps, ps);
      break;
    }
    case "hat-halo": {
      ctx.strokeStyle = "#ffee44";
      ctx.shadowColor = "#ffee44";
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.ellipse(x, y - 4 * ps, 5 * ps, 2 * ps, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "hat-horns": {
      ctx.fillStyle = "#ff2222";
      ctx.shadowColor = "#ff2222";
      ctx.shadowBlur = 4;
      // Left horn
      ctx.beginPath();
      ctx.moveTo(x - 4 * ps, y);
      ctx.lineTo(x - 3 * ps, y - 4 * ps);
      ctx.lineTo(x - 2 * ps, y);
      ctx.fill();
      // Right horn
      ctx.beginPath();
      ctx.moveTo(x + 2 * ps, y);
      ctx.lineTo(x + 3 * ps, y - 4 * ps);
      ctx.lineTo(x + 4 * ps, y);
      ctx.fill();
      break;
    }
    case "hat-antenna": {
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 6 * ps);
      ctx.stroke();
      // Glowing ball
      const pulse = 0.6 + Math.sin(time * 0.006) * 0.4;
      ctx.fillStyle = `rgba(0, 240, 255, ${pulse})`;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, y - 6 * ps, 2 * ps, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "hat-tophat": {
      ctx.fillStyle = "#111";
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      // Brim
      ctx.fillRect(x - 5 * ps, y - ps, 10 * ps, ps);
      // Top
      ctx.fillRect(x - 3 * ps, y - 5 * ps, 6 * ps, 4 * ps);
      ctx.strokeRect(x - 3 * ps, y - 5 * ps, 6 * ps, 4 * ps);
      // Band
      ctx.fillStyle = "#bf00ff";
      ctx.fillRect(x - 3 * ps, y - 2 * ps, 6 * ps, ps);
      break;
    }
    case "hat-wizard": {
      ctx.fillStyle = "#2200aa";
      ctx.beginPath();
      ctx.moveTo(x - 5 * ps, y);
      ctx.lineTo(x, y - 8 * ps);
      ctx.lineTo(x + 5 * ps, y);
      ctx.closePath();
      ctx.fill();
      // Stars on hat
      ctx.fillStyle = "#ffee44";
      ctx.shadowColor = "#ffee44";
      ctx.shadowBlur = 4;
      ctx.fillRect(x - ps, y - 4 * ps, ps * 0.8, ps * 0.8);
      ctx.fillRect(x + 2 * ps, y - 2 * ps, ps * 0.6, ps * 0.6);
      // Brim
      ctx.fillStyle = "#2200aa";
      ctx.shadowBlur = 0;
      ctx.fillRect(x - 6 * ps, y - ps, 12 * ps, ps);
      break;
    }
  }
  ctx.shadowBlur = 0;
  ctx.restore();
}

// --- TRAILS ---
export function drawTrail(
  ctx: CanvasRenderingContext2D,
  trailId: string | null,
  positions: Array<{ x: number; y: number }>,
  color: string,
  time: number
) {
  if (!trailId || positions.length < 2) return;
  ctx.save();

  switch (trailId) {
    case "trail-sparkle": {
      for (let i = 0; i < positions.length; i++) {
        const p = positions[i];
        const alpha = (1 - i / positions.length) * 0.6;
        ctx.fillStyle = `${color}`;
        ctx.globalAlpha = alpha;
        const size = 2 + Math.sin(time * 0.01 + i) * 1;
        ctx.fillRect(
          p.x + Math.sin(time * 0.005 + i * 2) * 6 - size / 2,
          p.y + Math.cos(time * 0.005 + i * 2) * 4 - size / 2,
          size, size
        );
      }
      break;
    }
    case "trail-fire": {
      for (let i = 0; i < positions.length; i++) {
        const p = positions[i];
        const alpha = (1 - i / positions.length) * 0.5;
        const red = i % 2 === 0 ? "255, 100, 20" : "255, 200, 50";
        ctx.fillStyle = `rgba(${red}, ${alpha})`;
        ctx.globalAlpha = 1;
        const size = 3 + Math.sin(time * 0.008 + i * 3) * 2;
        ctx.fillRect(
          p.x + Math.sin(time * 0.01 + i) * 4 - size / 2,
          p.y - i * 1.5 + Math.sin(time * 0.01 + i) * 3 - size / 2,
          size, size
        );
      }
      break;
    }
    case "trail-rainbow": {
      for (let i = 0; i < positions.length; i++) {
        const p = positions[i];
        const alpha = (1 - i / positions.length) * 0.7;
        const hue = (time * 0.1 + i * 30) % 360;
        ctx.fillStyle = `hsla(${hue}, 90%, 60%, ${alpha})`;
        ctx.globalAlpha = 1;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      }
      break;
    }
    case "trail-ghost": {
      for (let i = 0; i < positions.length; i++) {
        const p = positions[i];
        const alpha = (1 - i / positions.length) * 0.25;
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 - i * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "trail-money": {
      ctx.font = "8px monospace";
      for (let i = 0; i < positions.length; i++) {
        const p = positions[i];
        const alpha = (1 - i / positions.length) * 0.6;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#39ff14";
        ctx.fillText("$", p.x + Math.sin(time * 0.005 + i * 2) * 5, p.y - i * 2);
      }
      break;
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

// --- AURAS ---
export function drawAura(
  ctx: CanvasRenderingContext2D,
  auraId: string | null,
  x: number,
  y: number,
  scale: number,
  color: string,
  time: number
) {
  if (!auraId || auraId === "aura-none") return;
  ctx.save();
  const radius = scale * 30;

  switch (auraId) {
    case "aura-flame": {
      const flicker = 0.4 + Math.sin(time * 0.008) * 0.15;
      const grad = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius);
      grad.addColorStop(0, `rgba(255, 100, 0, ${flicker})`);
      grad.addColorStop(0.6, `rgba(255, 50, 0, ${flicker * 0.4})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      break;
    }
    case "aura-ice": {
      const pulse = 0.3 + Math.sin(time * 0.005) * 0.15;
      const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
      grad.addColorStop(0, `rgba(100, 200, 255, ${pulse})`);
      grad.addColorStop(0.5, `rgba(50, 150, 255, ${pulse * 0.5})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      // Ice sparkle pixels
      for (let i = 0; i < 4; i++) {
        const angle = time * 0.003 + i * Math.PI / 2;
        const px = x + Math.cos(angle) * radius * 0.7;
        const py = y + Math.sin(angle) * radius * 0.5;
        ctx.fillStyle = `rgba(200, 230, 255, ${0.5 + Math.sin(time * 0.01 + i) * 0.3})`;
        ctx.fillRect(px - 1, py - 1, 2, 2);
      }
      break;
    }
    case "aura-electric": {
      const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
      grad.addColorStop(0, "rgba(255, 255, 100, 0.15)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      // Random spark lines
      ctx.strokeStyle = `rgba(255, 255, 100, ${0.3 + Math.random() * 0.4})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const len = radius * (0.4 + Math.random() * 0.5);
        ctx.beginPath();
        ctx.moveTo(x, y);
        const mx = x + Math.cos(angle) * len * 0.5 + (Math.random() - 0.5) * 10;
        const my = y + Math.sin(angle) * len * 0.5 + (Math.random() - 0.5) * 10;
        ctx.lineTo(mx, my);
        ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
        ctx.stroke();
      }
      break;
    }
    case "aura-shadow": {
      const expand = 0.7 + Math.sin(time * 0.004) * 0.3;
      const r = radius * expand;
      const grad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r);
      grad.addColorStop(0, "rgba(80, 0, 120, 0.3)");
      grad.addColorStop(0.7, "rgba(40, 0, 80, 0.15)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      break;
    }
    case "aura-holy": {
      const pulse = 0.25 + Math.sin(time * 0.004) * 0.1;
      const grad = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius * 1.2);
      grad.addColorStop(0, `rgba(255, 255, 200, ${pulse})`);
      grad.addColorStop(0.4, `rgba(255, 220, 100, ${pulse * 0.5})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(x - radius * 1.2, y - radius * 1.2, radius * 2.4, radius * 2.4);
      // Light rays
      ctx.strokeStyle = `rgba(255, 255, 200, ${pulse * 0.4})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const angle = time * 0.001 + i * Math.PI / 3;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * radius * 0.4, y + Math.sin(angle) * radius * 0.3);
        ctx.lineTo(x + Math.cos(angle) * radius * 1.1, y + Math.sin(angle) * radius * 0.8);
        ctx.stroke();
      }
      break;
    }
  }

  ctx.restore();
}
