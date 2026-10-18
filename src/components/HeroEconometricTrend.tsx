"use client";

import * as React from "react";
import { motion } from "framer-motion";

// Seeded random walk algorithm matching index (2).html (mulberry32, seed: 72)
function seededRandom(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface TrendWalkConfig {
  seed: number;
  lines: number;
  points: number;
  drift: number;
  volatility: number;
  strongLine: number;
}

function makeWalks(cfg: TrendWalkConfig) {
  const rand = seededRandom(cfg.seed);
  const noise = () => (rand() + rand() + rand() - 1.5) * 2;
  const walks = [];

  for (let i = 0; i < cfg.lines; i++) {
    const strong = i === cfg.strongLine;
    const start = strong ? 0 : rand() * 0.35;
    const end = strong ? 1 : 0.7 + rand() * 0.3;
    const drift = cfg.drift * (strong ? 1.25 : 0.4 + rand() * 0.9);
    const steps = Math.max(2, Math.round(cfg.points * (end - start)));

    let value = (rand() - 0.5) * cfg.points * cfg.volatility * 0.5;
    const values = [value];
    for (let k = 0; k < steps; k++) {
      value += drift + noise() * cfg.volatility;
      values.push(value);
    }
    walks.push({ start, end, values, strong });
  }
  return walks;
}

export function HeroEconometricTrend() {
  const { paths, endDot } = React.useMemo(() => {
    // Config exactly from index (2).html: seed 72, 5 lines, 34 points, drift 0.22, volatility 1
    const cfg: TrendWalkConfig = {
      seed: 72,
      lines: 5,
      points: 34,
      drift: 0.22,
      volatility: 1,
      strongLine: 0,
    };

    const W = 1000;
    const H = 220;
    const padY = H * 0.12;
    const usableW = W * 0.985;
    const walks = makeWalks(cfg);

    let min = Infinity;
    let max = -Infinity;
    walks.forEach((w) =>
      w.values.forEach((v) => {
        if (v < min) min = v;
        if (v > max) max = v;
      })
    );
    const span = max - min || 1;
    const toY = (v: number) => H - padY - ((v - min) / span) * (H - 2 * padY);

    const strongWalk = walks.find((w) => w.strong) ?? walks[0];
    const dotCoords = strongWalk && strongWalk.values.length > 0
      ? {
          x: Number((strongWalk.end * usableW).toFixed(1)),
          y: Number(toY(strongWalk.values[strongWalk.values.length - 1]).toFixed(1)),
        }
      : { x: 0, y: 0 };

    const generatedPaths = walks.map((w, idx) => {
      const x0 = w.start * usableW;
      const x1 = w.end * usableW;
      const n = w.values.length - 1;
      let d = "";
      let lastX = 0;
      let lastY = 0;

      w.values.forEach((v, k) => {
        lastX = x0 + (x1 - x0) * (k / n);
        lastY = toY(v);
        d += (k ? " L " : "M ") + lastX.toFixed(1) + " " + lastY.toFixed(1);
      });

      return {
        id: idx,
        strong: w.strong,
        d,
        width: w.strong ? 1.6 : 0.95,
        opacity: w.strong ? 0.92 : 0.26,
      };
    });

    return { paths: generatedPaths, endDot: dotCoords };
  }, []);

  return (
    <div
      className="absolute bottom-4 sm:bottom-7 md:bottom-11 left-0 right-0 w-full pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-[90px] sm:h-[135px] md:h-[185px] relative">
        <motion.svg
          viewBox="0 0 1000 220"
          preserveAspectRatio="none"
          className="w-full h-full block overflow-visible"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {paths.map((p, idx) => (
          <motion.g
            key={p.id}
            animate={{
              y: [0, -3.2 + idx * 0.9, 0, 3.2 - idx * 0.9, 0],
              opacity: p.strong
                ? [p.opacity, 1, 0.9, 1, p.opacity]
                : [p.opacity * 0.85, p.opacity * 1.25, p.opacity * 0.85],
            }}
            transition={{
              duration: 5.5 + idx * 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 0.35,
            }}
          >
            <path
              d={p.d}
              fill="none"
              stroke="#FF4F00"
              strokeWidth={p.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                vectorEffect: "non-scaling-stroke",
              }}
            />

            {/* Glowing end dot on the strong line */}
            {p.strong && endDot.x > 0 && (
              <motion.g
                animate={{
                  scale: [1, 1.22, 1],
                  opacity: [0.85, 1, 0.85],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  transformOrigin: `${endDot.x}px ${endDot.y}px`,
                }}
              >
                {/* Subtle soft aura */}
                <circle
                  cx={endDot.x}
                  cy={endDot.y}
                  r="5.5"
                  fill="rgba(255, 79, 0, 0.25)"
                />
                {/* Core dot */}
                <circle
                  cx={endDot.x}
                  cy={endDot.y}
                  r="3.2"
                  fill="#FF4F00"
                />
              </motion.g>
            )}
          </motion.g>
        ))}
        </motion.svg>
      </div>
    </div>
  );
}

