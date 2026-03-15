"use client";

function VolumeOnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
      <path d="M16 9a5 5 0 0 1 0 6"/>
      <path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>
    </svg>
  );
}

function VolumeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
      <line x1="22" x2="16" y1="9" y2="15"/>
      <line x1="16" x2="22" y1="9" y2="15"/>
    </svg>
  );
}

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
  const Icon = muted ? VolumeOffIcon : VolumeOnIcon;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={muted}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-white/70 transition-all hover:text-white hover:scale-[1.06] active:scale-[0.94] animate-audio-toggle ${className}`.trim()}
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
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-xs font-semibold tracking-[0.24em] uppercase">
          {muted ? "Muted" : "Sound On"}
        </span>
      </span>
    </button>
  );
}
