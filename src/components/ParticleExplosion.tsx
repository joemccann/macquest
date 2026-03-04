"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

interface ParticleExplosionProps {
  active: boolean;
  id: number;
}

const PARTICLE_COLORS = [
  "#f472b6", "#ec4899", // pinks
  "#a78bfa", "#c084fc", // purples
  "#60a5fa", "#38bdf8", // blues
  "#34d399", "#4ade80", // greens
  "#fbbf24", "#facc15", // golds
  "#fb923c", "#f97316", // oranges
];

const SHAPES = ["circle", "star", "diamond"] as const;

interface Particle {
  angle: number;
  distance: number;
  color: string;
  size: number;
  duration: number;
  shape: typeof SHAPES[number];
  delay: number;
  spin: number;
}

// Seeded random for initial values, re-randomized per explosion via id
function sr(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
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
        shape: SHAPES[Math.floor(sr(seed * 6 + 6) * SHAPES.length)],
        delay: sr(seed * 6 + 7) * 0.1,
        spin: (sr(seed * 6 + 8) - 0.5) * 720,
      };
    });
  }, [id]);

  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {particles.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.distance;
            const ty = Math.sin(rad) * p.distance;

            return (
              <motion.div
                key={`${id}-${i}`}
                className="absolute"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.shape === "circle" ? p.color : "transparent",
                  borderRadius: p.shape === "circle" ? "50%" : p.shape === "diamond" ? "2px" : 0,
                  transform: p.shape === "diamond" ? "rotate(45deg)" : undefined,
                  border: p.shape !== "circle" ? `2px solid ${p.color}` : undefined,
                  boxShadow: `0 0 ${p.size}px ${p.color}60`,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                animate={{
                  x: tx,
                  y: ty,
                  opacity: 0,
                  scale: 0.1,
                  rotate: p.spin,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeOut",
                }}
              />
            );
          })}

          {/* Central flash */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 100,
              height: 100,
              background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(251,191,36,0.2) 40%, transparent 70%)",
            }}
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
