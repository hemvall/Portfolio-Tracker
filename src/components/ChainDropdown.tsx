"use client";

import { useEffect, useRef, useState } from "react";
import { Blockchain, BLOCKCHAIN_OPTIONS } from "@/lib/types";
import { ChevronDown, Check } from "lucide-react";

const ACCENT = "#A882FF";

interface Props {
  value: Blockchain;
  onChange: (v: Blockchain) => void;
}

/**
 * Custom blockchain selector — glassy trigger + popup list with real chain
 * logos (served from the Trust Wallet assets CDN via `BLOCKCHAIN_OPTIONS.logoUrl`).
 *
 * Falls back to the `icon` unicode glyph if an image fails to load.
 */
export function ChainDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(() =>
    BLOCKCHAIN_OPTIONS.findIndex((o) => o.value === value),
  );
  const rootRef = useRef<HTMLDivElement>(null);

  const selected =
    BLOCKCHAIN_OPTIONS.find((o) => o.value === value) ?? BLOCKCHAIN_OPTIONS[0];

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // When opening, reset highlight to the current value
  useEffect(() => {
    if (open) {
      const idx = BLOCKCHAIN_OPTIONS.findIndex((o) => o.value === value);
      setHighlight(idx >= 0 ? idx : 0);
    }
  }, [open, value]);

  const commit = (v: Blockchain) => {
    onChange(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (open) {
        e.stopPropagation();
        setOpen(false);
      }
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        commit(BLOCKCHAIN_OPTIONS[highlight].value);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setHighlight((h) => (h + 1) % BLOCKCHAIN_OPTIONS.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setHighlight((h) => (h - 1 + BLOCKCHAIN_OPTIONS.length) % BLOCKCHAIN_OPTIONS.length);
      return;
    }
  };

  return (
    <div ref={rootRef} style={{ position: "relative" }} onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${open ? `${ACCENT}55` : "rgba(255,255,255,0.07)"}`,
          color: "#fff",
          fontSize: 13,
          padding: "11px 14px",
          borderRadius: 10,
          outline: "none",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          cursor: "pointer",
          textAlign: "left",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: open ? `0 0 18px ${ACCENT}18` : "none",
        }}
      >
        <ChainLogo option={selected} size={22} highlighted />
        <span style={{ flex: 1 }}>{selected.label}</span>
        <ChevronDown
          size={15}
          style={{
            color: "rgba(255,255,255,0.45)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="glass-card-sm"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 10,
            padding: 6,
            maxHeight: 280,
            overflowY: "auto",
            animation: "fade-up 0.18s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {BLOCKCHAIN_OPTIONS.map((opt, i) => {
            const isSelected = opt.value === value;
            const isHighlight = i === highlight;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => commit(opt.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  color: isSelected ? "#fff" : "rgba(255,255,255,0.78)",
                  background: isHighlight
                    ? `${ACCENT}15`
                    : isSelected
                      ? "rgba(255,255,255,0.03)"
                      : "transparent",
                  border: `1px solid ${isHighlight ? `${ACCENT}30` : "transparent"}`,
                  transition: "background 0.12s, border-color 0.12s",
                }}
              >
                <ChainLogo option={opt} size={22} highlighted={isHighlight || isSelected} />
                <span style={{ flex: 1 }}>{opt.label}</span>
                {isSelected && <Check size={13} style={{ color: ACCENT }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Logo with unicode fallback ─────────────────── */

interface LogoProps {
  option: (typeof BLOCKCHAIN_OPTIONS)[number];
  size: number;
  highlighted?: boolean;
}

function ChainLogo({ option, size, highlighted }: LogoProps) {
  const [broken, setBroken] = useState(false);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 6,
        background: highlighted ? `${ACCENT}22` : "rgba(255,255,255,0.04)",
        fontSize: Math.round(size * 0.6),
        lineHeight: 1,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {broken ? (
        option.icon
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={option.logoUrl}
          alt={`${option.label} logo`}
          width={size}
          height={size}
          onError={() => setBroken(true)}
          style={{ width: size, height: size, objectFit: "contain" }}
        />
      )}
    </span>
  );
}
