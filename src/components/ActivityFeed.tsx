"use client";

import { useStore } from "@/lib/store";

export function ActivityFeed() {
  const log = useStore((s) => s.activityLog);

  return (
    <div className="glass p-4 w-72 max-h-[60vh] flex flex-col gap-2">
      <h2
        className="text-sm font-bold uppercase tracking-widest mb-1"
        style={{ color: "#00f0ff", textShadow: "0 0 10px #00f0ff" }}
      >
        activity feed
      </h2>
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {log.length === 0 && (
          <p className="text-white/20 text-xs italic">waiting for something to happen...</p>
        )}
        {log.map((entry) => (
          <div
            key={entry.id}
            className="text-xs leading-relaxed opacity-90 animate-[float-up_0.3s_ease-out]"
          >
            <span className="font-bold" style={{ color: entry.color }}>
              {entry.character}
            </span>{" "}
            <span className="text-white/60">
              {entry.message.replace(`${entry.character} `, "")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
