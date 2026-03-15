"use client";

import { m } from "framer-motion";
import { ALL_ROWS, type KeyData } from "@/lib/keyboard-layout";

interface StarshipKeyboardProps {
  targetLetter: string;
  pressedKey: string | null;
}

function KeyCap({
  keyData,
  isTarget,
  isPressed,
}: {
  keyData: KeyData;
  isTarget: boolean;
  isPressed: boolean;
}) {
  const isMagic = keyData.isMagic;
  const r = 10;

  // Key styling tiers
  let fillMain = "rgba(255,255,255,0.05)";
  let fillTop = "rgba(255,255,255,0.08)";
  let strokeColor = "rgba(255,255,255,0.07)";
  let textColor = "rgba(255,255,255,0.35)";

  if (isTarget) {
    fillMain = "url(#targetGradient)";
    fillTop = "url(#targetGradientTop)";
    strokeColor = "rgba(255,255,255,0.6)";
    textColor = "#ffffff";
  } else if (isMagic) {
    fillMain = "rgba(139, 92, 246, 0.18)";
    fillTop = "rgba(139, 92, 246, 0.24)";
    strokeColor = "rgba(139, 92, 246, 0.4)";
    textColor = "rgba(196, 181, 253, 1)";
  }

  const depth = 4;

  return (
    <m.g
      animate={
        isPressed && isTarget
          ? { y: depth }
          : isTarget
          ? { y: [0, -3, 0] }
          : { y: 0 }
      }
      transition={
        isTarget && !isPressed
          ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
          : { duration: 0.1 }
      }
    >
      {/* Target key: pulsing radial glow behind the key */}
      {isTarget && (
        <>
          <ellipse
            cx={keyData.x + keyData.width / 2}
            cy={keyData.y + keyData.height / 2}
            rx={keyData.width * 0.9}
            ry={keyData.height * 0.9}
            fill="url(#beaconGlow)"
            opacity={0.7}
          >
            <animate
              attributeName="rx"
              values={`${keyData.width * 0.7};${keyData.width * 1.0};${keyData.width * 0.7}`}
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="ry"
              values={`${keyData.height * 0.7};${keyData.height * 1.0};${keyData.height * 0.7}`}
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.8;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </ellipse>
        </>
      )}

      {/* Key shadow (3D depth) */}
      <rect
        x={keyData.x}
        y={keyData.y + depth}
        width={keyData.width}
        height={keyData.height}
        rx={r}
        fill={isTarget ? "rgba(139, 92, 246, 0.4)" : isMagic ? "rgba(88, 28, 135, 0.3)" : "rgba(0,0,0,0.25)"}
      />

      {/* Key body */}
      <rect
        x={keyData.x}
        y={keyData.y}
        width={keyData.width}
        height={keyData.height}
        rx={r}
        fill={fillMain}
        stroke={strokeColor}
        strokeWidth={isTarget ? 2 : isMagic ? 1 : 0.5}
      />

      {/* Key top highlight (3D bevel) */}
      <rect
        x={keyData.x + 2}
        y={keyData.y + 1}
        width={keyData.width - 4}
        height={keyData.height * 0.45}
        rx={r - 2}
        fill={fillTop}
      />

      {/* Target key inner shimmer */}
      {isTarget && (
        <rect
          x={keyData.x + 1}
          y={keyData.y + 1}
          width={keyData.width - 2}
          height={keyData.height - 2}
          rx={r - 1}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={1}
        />
      )}

      {/* Magic key bump indicator */}
      {isMagic && (
        <rect
          x={keyData.x + keyData.width / 2 - 8}
          y={keyData.y + keyData.height - 9}
          width={16}
          height={2.5}
          rx={1.25}
          fill={isTarget ? "rgba(255,255,255,0.5)" : "rgba(196, 181, 253, 0.5)"}
        />
      )}

      {/* Key label */}
      <text
        x={keyData.x + keyData.width / 2}
        y={keyData.y + keyData.height / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontSize={keyData.width > 60 ? 11 : 15}
        fontWeight={isTarget ? 700 : isMagic ? 600 : 500}
        fontFamily="var(--font-fredoka), system-ui, sans-serif"
        style={
          isTarget
            ? { filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))" }
            : undefined
        }
      >
        {keyData.label}
      </text>
    </m.g>
  );
}

export function StarshipKeyboard({ targetLetter, pressedKey }: StarshipKeyboardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="keyboard-body p-3">
        <svg viewBox="0 0 900 260" className="w-full h-auto">
          <defs>
            {/* Target key fill gradient */}
            <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(236, 72, 153, 0.55)" />
              <stop offset="30%" stopColor="rgba(139, 92, 246, 0.55)" />
              <stop offset="60%" stopColor="rgba(59, 130, 246, 0.45)" />
              <stop offset="100%" stopColor="rgba(52, 211, 153, 0.4)" />
            </linearGradient>
            <linearGradient id="targetGradientTop" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(244, 114, 182, 0.35)" />
              <stop offset="50%" stopColor="rgba(167, 139, 250, 0.3)" />
              <stop offset="100%" stopColor="rgba(96, 165, 250, 0.25)" />
            </linearGradient>

            {/* Pulsing beacon glow behind target key */}
            <radialGradient id="beaconGlow">
              <stop offset="0%" stopColor="rgba(167, 139, 250, 0.5)" />
              <stop offset="40%" stopColor="rgba(139, 92, 246, 0.2)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
            </radialGradient>
          </defs>

          {ALL_ROWS.map((row, ri) =>
            row.map((keyData, ki) => {
              const isTarget =
                keyData.label.toUpperCase() === targetLetter.toUpperCase();
              const isPressed =
                pressedKey !== null &&
                keyData.label.toUpperCase() === pressedKey.toUpperCase();
              return (
                <KeyCap
                  key={`${ri}-${ki}`}
                  keyData={keyData}
                  isTarget={isTarget}
                  isPressed={isPressed}
                />
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}
