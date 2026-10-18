"use client";

import * as React from "react";
import { useTheme } from "next-themes";

interface SeriesDef {
  id: number;
  name: string;
  isPrimary?: boolean;
  isDashed?: boolean;
  colorDark: string;
  colorLight: string;
  lineWidth: number;
  beta: number; // sensitivity to overarching macro cycle
  volatility: number;
  bias: number; // vertical equilibrium center track (wide gaps)
  phase: number; // harmonic wave phase shift
}

const seriesDefs: SeriesDef[] = [
  {
    id: 1,
    name: "Financial Intermediation",
    colorDark: "rgba(225, 232, 245, 0.30)",
    colorLight: "rgba(45, 55, 75, 0.26)",
    lineWidth: 0.95,
    beta: 0.92,
    volatility: 0.35,
    bias: 28, // Highest track
    phase: 1.1,
  },
  {
    id: 3,
    name: "External Trade",
    colorDark: "rgba(135, 190, 225, 0.30)",
    colorLight: "rgba(40, 105, 160, 0.26)",
    lineWidth: 0.95,
    beta: 1.05,
    volatility: 0.38,
    bias: 19, // Upper track
    phase: 3.4,
  },
  {
    id: 0,
    name: "Composite Index",
    isPrimary: true,
    colorDark: "rgba(255, 79, 0, 0.72)",
    colorLight: "rgba(255, 79, 0, 0.58)",
    lineWidth: 1.45,
    beta: 1.18,
    volatility: 0.42,
    bias: 10, // Primary focal track
    phase: 0,
  },
  {
    id: 6,
    name: "Systemic Trend (EMA)",
    isDashed: true,
    colorDark: "rgba(195, 210, 230, 0.24)",
    colorLight: "rgba(65, 85, 110, 0.20)",
    lineWidth: 0.85,
    beta: 0.65,
    volatility: 0.12,
    bias: 0, // Central reference baseline
    phase: 2.2,
  },
  {
    id: 2,
    name: "Agricultural Yield",
    colorDark: "rgba(255, 145, 60, 0.30)",
    colorLight: "rgba(215, 95, 25, 0.26)",
    lineWidth: 0.95,
    beta: 1.25,
    volatility: 0.45,
    bias: -9, // Lower-middle track
    phase: 2.8,
  },
  {
    id: 4,
    name: "Industrial Output",
    colorDark: "rgba(185, 170, 210, 0.28)",
    colorLight: "rgba(95, 75, 135, 0.24)",
    lineWidth: 0.9,
    beta: 0.88,
    volatility: 0.34,
    bias: -19, // Lower track
    phase: 4.9,
  },
  {
    id: 5,
    name: "Household Consumption",
    colorDark: "rgba(155, 210, 175, 0.30)",
    colorLight: "rgba(35, 115, 70, 0.26)",
    lineWidth: 0.9,
    beta: 0.78,
    volatility: 0.30,
    bias: -28, // Bottom track
    phase: 0.9,
  },
];

// Generate 7 synchronized realistic macroeconomic time series with pronounced up-down cycles and curves
function generateMultiMarketSeries(length: number) {
  const allSeries: number[][] = seriesDefs.map(() => []);
  const volumes: number[] = [];

  // Deterministic seeded random for consistent realistic curvature
  let seed = 20261018;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const currentPrices = seriesDefs.map((def) => 100.0 + def.bias);

  for (let i = 0; i < length; i++) {
    // Multi-frequency macroeconomic business cycle:
    // cycle1 (~3-4 waves across screen width) gives clear economic rises, peaks, and dips
    const cycle1 = Math.sin(i * 0.046) * 13.5;
    const cycle2 = Math.cos(i * 0.092) * 5.8;
    const cycle3 = Math.sin(i * 0.016) * 4.2;
    const macroTide = cycle1 + cycle2 + cycle3;

    let aggregateShock = 0;

    seriesDefs.forEach((def, sIdx) => {
      // Harmonic wave per line giving rich individual curvature and flowing peaks
      const harmonicWave =
        Math.sin(i * 0.042 + def.phase) * 7.5 +
        Math.cos(i * 0.084 - def.phase * 0.5) * 3.8;

      // Mean-reverting stochastic shock (Ornstein-Uhlenbeck)
      const target = 100.0 + def.bias + macroTide * def.beta + harmonicWave;
      const meanReversion = (target - currentPrices[sIdx]) * 0.048;
      const shock = (rng() - 0.492) * def.volatility * 0.85;

      currentPrices[sIdx] = Math.max(50, Math.min(150, currentPrices[sIdx] + meanReversion + shock));
      allSeries[sIdx].push(currentPrices[sIdx]);

      if (def.isPrimary) {
        aggregateShock = shock;
      }
    });

    const vol = Math.min(1.0, 0.12 + Math.abs(aggregateShock) * 1.5 + rng() * 0.08);
    volumes.push(vol);
  }

  return { allSeries, volumes };
}

// Helper to draw silk-smooth quadratic Bézier curves through points
function drawSmoothCurve(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) {
  if (points.length < 2) return;
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    const midY = (p0.y + p1.y) / 2;
    ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
}

export function HeroStockBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Continuous market dataset (1200 data points across 7 lines)
    const totalDataPoints = 1200;
    const dataset = generateMultiMarketSeries(totalDataPoints);

    // Number of points visible across the screen
    const visiblePointsCount = 135;

    // Sub-pixel floating offset for buttery smooth, ultra-slow gliding
    let scrollPos = 0;
    const scrollSpeed = 0.038; // Ultra slow, meditative pace

    let time = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 300);
      height = Math.max(rect.height, 200);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const isDark = resolvedTheme === "dark";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.035)" : "rgba(22, 24, 29, 0.035)";
    const baseLineColor = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(22, 24, 29, 0.07)";
    const textColor = isDark ? "rgba(255, 255, 255, 0.22)" : "rgba(22, 24, 29, 0.24)";
    const volumeColor = isDark ? "rgba(255, 79, 0, 0.025)" : "rgba(255, 79, 0, 0.02)";

    // Fixed price vertical scale (from 48 to 152) accommodating expressive curvature and wide gaps
    const minPrice = 46;
    const maxPrice = 154;
    const priceRange = maxPrice - minPrice;

    const priceToY = (price: number) => {
      const normalized = (price - minPrice) / priceRange;
      // Anchor all lines in the bottom ~38% region of the hero section
      const chartHeight = height * 0.38;
      const bottomOffset = 20;
      return height - bottomOffset - normalized * chartHeight;
    };

    // Sub-pixel linear interpolation between points
    const getInterpolatedValue = (arr: number[], index: number) => {
      const i0 = Math.floor(index) % totalDataPoints;
      const i1 = (i0 + 1) % totalDataPoints;
      const frac = index - Math.floor(index);
      return arr[i0] * (1 - frac) + arr[i1] * frac;
    };

    const render = () => {
      time += 0.016;
      scrollPos += scrollSpeed;

      // Wrap around seamlessly
      if (scrollPos >= totalDataPoints - visiblePointsCount - 2) {
        scrollPos = 0;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Financial Grid Lines & Reference Prices
      const gridPriceLevels = [75, 100, 125];
      ctx.lineWidth = 0.6;
      ctx.font = "9px 'JetBrains Mono', ui-monospace, monospace";

      gridPriceLevels.forEach((level) => {
        const y = priceToY(level);
        const isBase = level === 100;

        ctx.beginPath();
        ctx.strokeStyle = isBase ? baseLineColor : gridColor;
        ctx.setLineDash(isBase ? [4, 4] : [2, 6]);
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // Right edge price label
        ctx.fillStyle = textColor;
        ctx.textAlign = "right";
        const percent = (level - 100).toFixed(0);
        const sign = level > 100 ? "+" : "";
        ctx.fillText(
          isBase ? "100.00 BASE" : `${level}.00 (${sign}${percent}%)`,
          width - 14,
          y - 3.5
        );
      });
      ctx.setLineDash([]);

      // 2. Timeline Months at bottom of chart
      const months = ["OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY"];
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      const monthSpacing = width / (months.length - 1);
      months.forEach((m, idx) => {
        const x = idx * monthSpacing;
        ctx.fillText(m, Math.max(20, Math.min(width - 20, x)), height - 10);
      });

      // 3. Draw Volume Histogram at Bottom
      const maxVolHeight = height * 0.11;
      const barWidth = width / visiblePointsCount;

      for (let i = 0; i < visiblePointsCount; i += 2) {
        const dataIdx = scrollPos + i;
        const vol = getInterpolatedValue(dataset.volumes, dataIdx);
        const x = i * barWidth;
        const vH = vol * maxVolHeight;
        const y = height - 24 - vH;

        ctx.fillStyle = volumeColor;
        ctx.fillRect(x, y, barWidth * 1.5, vH);
      }

      // 4. Sample visible window for all 7 lines
      const sampleSteps = visiblePointsCount * 2;
      const screenStepX = width / sampleSteps;

      const screenLines: { x: number; y: number }[][] = seriesDefs.map(() => []);

      for (let s = 0; s <= sampleSteps; s++) {
        const frac = s / sampleSteps;
        const currentDataIndex = scrollPos + frac * visiblePointsCount;
        const x = s * screenStepX;

        seriesDefs.forEach((def, idx) => {
          const val = getInterpolatedValue(dataset.allSeries[idx], currentDataIndex);
          screenLines[idx].push({ x, y: priceToY(val) });
        });
      }

      // Find the primary line index in seriesDefs
      const primaryIndex = seriesDefs.findIndex((d) => d.isPrimary);
      const primaryPoints = screenLines[primaryIndex];

      // 5. Draw Subtle Gradient Area under the Primary Line
      const grad = ctx.createLinearGradient(0, height * 0.58, 0, height);
      if (isDark) {
        grad.addColorStop(0, "rgba(255, 79, 0, 0.045)");
        grad.addColorStop(0.5, "rgba(255, 79, 0, 0.012)");
        grad.addColorStop(1, "rgba(255, 79, 0, 0.0)");
      } else {
        grad.addColorStop(0, "rgba(255, 79, 0, 0.035)");
        grad.addColorStop(0.5, "rgba(255, 79, 0, 0.008)");
        grad.addColorStop(1, "rgba(255, 79, 0, 0.0)");
      }

      ctx.beginPath();
      drawSmoothCurve(ctx, primaryPoints);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // 6. Draw All 7 Market Lines with Silk-Smooth Quadratic Curvature
      seriesDefs.forEach((def, idx) => {
        if (def.isPrimary) return; // Draw primary line last

        const points = screenLines[idx];
        const strokeCol = isDark ? def.colorDark : def.colorLight;

        ctx.beginPath();
        drawSmoothCurve(ctx, points);

        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = def.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (def.isDashed) {
          ctx.setLineDash([3, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          ctx.stroke();
        }

        // Faint tip bead on the right edge for each line
        const lastPt = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(lastPt.x - 2, lastPt.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = strokeCol;
        ctx.fill();
      });

      // 7. Primary Line Focus: Render on top with glowing pulse bead & Live ticker tag
      const primaryDef = seriesDefs[primaryIndex];
      const strokeCol = isDark ? primaryDef.colorDark : primaryDef.colorLight;

      ctx.beginPath();
      drawSmoothCurve(ctx, primaryPoints);

      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = primaryDef.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      const primaryLastPt = primaryPoints[primaryPoints.length - 1];
      const latestPrice = getInterpolatedValue(dataset.allSeries[primaryIndex], scrollPos + visiblePointsCount);

      // Faint horizontal crosshair
      ctx.beginPath();
      ctx.setLineDash([2, 5]);
      ctx.moveTo(0, primaryLastPt.y);
      ctx.lineTo(width, primaryLastPt.y);
      ctx.strokeStyle = "rgba(255, 79, 0, 0.14)";
      ctx.lineWidth = 0.65;
      ctx.stroke();
      ctx.setLineDash([]);

      // Subtle slow breathing pulse
      const pulse = 1 + Math.sin(time * 2.2) * 0.18;
      ctx.beginPath();
      ctx.arc(primaryLastPt.x - 2, primaryLastPt.y, 5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 79, 0, 0.11)";
      ctx.fill();

      // Core price bead
      ctx.beginPath();
      ctx.arc(primaryLastPt.x - 2, primaryLastPt.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = strokeCol;
      ctx.fill();

      // Current Price pill badge on the right
      const pctDiff = (latestPrice - 100).toFixed(1);
      const sign = latestPrice >= 100 ? "+" : "";
      ctx.font = "bold 9px 'JetBrains Mono', ui-monospace, monospace";
      ctx.fillStyle = strokeCol;
      ctx.textAlign = "right";
      ctx.fillText(`${latestPrice.toFixed(1)} (${sign}${pctDiff}%)`, width - 18, primaryLastPt.y - 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{
        // Smoothly fades in down toward the bottom horizon
        maskImage:
          "linear-gradient(to bottom, transparent 15%, rgba(0, 0, 0, 0.35) 45%, black 75%, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 15%, rgba(0, 0, 0, 0.35) 45%, black 75%, black 100%)",
        opacity: 0.46,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
