"use client";

import { useSyncExternalStore } from "react";

// Deterministic seeded random for React purity
function sr(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const STARS: Star[] = Array.from({ length: 25 }, (_, i) => ({
  x: Math.round(sr(i * 6 + 1) * 100),
  y: Math.round(sr(i * 6 + 2) * 100),
  size: Math.round(sr(i * 6 + 3) * 25 + 5) / 10,
  delay: Math.round(sr(i * 6 + 4) * 6),
  duration: Math.round(sr(i * 6 + 5) * 4 + 2),
  opacity: Math.round(sr(i * 6 + 6) * 60 + 20) / 100,
}));

// A few "bright" stars with color
const BRIGHT_STARS = [
  { x: 15, y: 12, color: "#a78bfa", size: 4 },
  { x: 72, y: 8, color: "#60a5fa", size: 3.5 },
  { x: 45, y: 85, color: "#f472b6", size: 3 },
];

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function SpaceBackground() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ contain: "strict" }}>
      {/* Deep space base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(88, 28, 135, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(30, 58, 138, 0.2) 0%, transparent 55%),
            radial-gradient(ellipse 90% 40% at 50% 50%, rgba(15, 23, 42, 0.8) 0%, transparent 70%),
            linear-gradient(180deg, #050714 0%, #0a0f2e 30%, #0c0820 60%, #060818 100%)
          `,
        }}
      />

      {/* Aurora / nebula wash — top */}
      <div
        className="absolute animate-aurora"
        style={{
          top: "-10%",
          left: "10%",
          width: "80%",
          height: "40%",
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(139, 92, 246, 0.12) 0%, transparent 70%),
            radial-gradient(ellipse at 70% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)
          `,
          filter: "blur(60px)",
        }}
      />

      {/* Aurora / nebula wash — bottom */}
      <div
        className="absolute animate-aurora"
        style={{
          bottom: "-5%",
          left: "0%",
          width: "100%",
          height: "35%",
          background: `
            radial-gradient(ellipse at 60% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 65%),
            radial-gradient(ellipse at 20% 60%, rgba(139, 92, 246, 0.08) 0%, transparent 55%)
          `,
          filter: "blur(50px)",
          animationDelay: "4s",
        }}
      />

      {/* Star field — rendered client-side only to reduce SSR HTML size */}
      {mounted && STARS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: `rgba(255,255,255,${star.opacity})`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: star.size > 2 ? `0 0 ${Math.round(star.size * 2)}px rgba(255,255,255,.3)` : "none",
          }}
        />
      ))}

      {/* Bright colored stars */}
      {mounted && BRIGHT_STARS.map((star, i) => (
        <div
          key={`bright-${i}`}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 4}px ${star.color}40, 0 0 ${star.size * 8}px ${star.color}20`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: "4s",
          }}
        />
      ))}

      {/* Decorative elements — client-side only */}
      {mounted && (
        <>
          {/* Floating cosmic orb */}
          <div
            className="absolute animate-float opacity-20"
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #a78bfa 0%, #7c3aed 40%, transparent 70%)",
              right: "5%",
              top: "8%",
              filter: "blur(8px)",
            }}
          />

          {/* Ring planet */}
          <div
            className="absolute animate-float"
            style={{
              width: 50,
              height: 50,
              right: "12%",
              top: "55%",
              animationDelay: "2s",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 30,
                height: 30,
                left: 10,
                top: 10,
                background: "radial-gradient(circle at 40% 35%, #fbbf24, #d97706)",
                opacity: 0.25,
              }}
            />
            <div
              className="absolute"
              style={{
                width: 50,
                height: 12,
                left: 0,
                top: 19,
                borderRadius: "50%",
                border: "1.5px solid rgba(251, 191, 36, 0.15)",
                transform: "rotateX(60deg)",
              }}
            />
          </div>
        </>
      )}

    </div>
  );
}
