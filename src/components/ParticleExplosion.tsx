"use client";

import { useMemo } from "react";

interface ParticleExplosionProps {
  active: boolean;
  id: number;
}

const PARTICLE_COLORS = [
  "#f472b6", "#ec4899",
  "#a78bfa", "#c084fc",
  "#60a5fa", "#38bdf8",
  "#34d399", "#4ade80",
  "#fbbf24", "#facc15",
  "#fb923c", "#f97316",
];

function sr(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

interface Particle {
  angle: number;
  distance: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

export function ParticleExplosion({ active, id }: ParticleExplosionProps) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 32 }, (_, i) => {
      const seed = id * 1000 + i;
      return {
        angle: sr(seed * 6 + 1) * 360,
        distance: sr(seed * 6 + 2) * 180 + 60,
        color: PARTICLE_COLORS[Math.floor(sr(seed * 6 + 3) * PARTICLE_COLORS.length)],
        size: sr(seed * 6 + 4) * 12 + 4,
        duration: sr(seed * 6 + 5) * 0.6 + 0.5,
        delay: sr(seed * 6 + 7) * 0.1,
      };
    });
  }, [id]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      {particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;

        return (
          <div
            key={`${id}-${i}`}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size}px ${p.color}60`,
              animation: `particle-fly ${p.duration}s ease-out ${p.delay}s forwards`,
              // CSS custom properties for unique trajectory
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
            } as React.CSSProperties}
          />
        );
      })}

      {/* Central flash */}
      <div
        className="absolute rounded-full animate-particle-flash"
        style={{
          width: 100,
          height: 100,
          background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(251,191,36,0.2) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
