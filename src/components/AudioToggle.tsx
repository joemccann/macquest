"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface AudioToggleProps {
  muted: boolean;
  onToggle: () => void;
  className?: string;
}

export function AudioToggle({
  muted,
  onToggle,
  className = "",
}: AudioToggleProps) {
  const Icon = muted ? VolumeX : Volume2;

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={muted}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white ${className}`.trim()}
      style={{
        background: muted
          ? "rgba(255,255,255,0.05)"
          : "linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(139, 92, 246, 0.16))",
        border: muted
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(96, 165, 250, 0.26)",
        boxShadow: muted
          ? "inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 0 18px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
    >
      <span className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{
            background: muted
              ? "rgba(255,255,255,0.06)"
              : "linear-gradient(135deg, rgba(34, 211, 238, 0.22), rgba(59, 130, 246, 0.28))",
          }}
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <span className="text-xs font-semibold tracking-[0.24em] uppercase">
          {muted ? "Muted" : "Sound On"}
        </span>
      </span>
    </motion.button>
  );
}
