"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function HeroWaveform() {
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
    let time = 0;

    // Mouse spring physics
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let isHovered = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 100);
      height = Math.max(rect.height, 50);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
      isHovered = true;
    };

    const onMouseEnter = () => {
      isHovered = true;
    };

    const onMouseLeave = () => {
      isHovered = false;
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    const isDark = resolvedTheme === "dark";
    const baseColorMuted = isDark
      ? "rgba(220, 220, 225, "
      : "rgba(35, 40, 50, ";

    const render = () => {
      time += 0.012; // Calm, meditative pace

      // Smooth mouse lerp
      if (isHovered) {
        mouseX += (targetMouseX - mouseX) * 0.08;
        mouseY += (targetMouseY - mouseY) * 0.08;
      } else {
        mouseX += (-1000 - mouseX) * 0.05;
        mouseY += (-1000 - mouseY) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      // 4 harmonic econometric series
      const lines = [
        {
          id: 0,
          color: `${baseColorMuted}0.14)`,
          lineWidth: 0.9,
          offsetY: 8,
          w1: 2.8,
          w2: 5.5,
          s1: 0.7,
          s2: 0.35,
          amp1: 6,
          amp2: 4,
          phase: 3.5,
        },
        {
          id: 1,
          color: `${baseColorMuted}0.22)`,
          lineWidth: 1.0,
          offsetY: 3,
          w1: 3.3,
          w2: 6.8,
          s1: 0.9,
          s2: 0.45,
          amp1: 8,
          amp2: 5,
          phase: 1.8,
        },
        {
          id: 2,
          color: `${baseColorMuted}0.34)`,
          lineWidth: 1.15,
          offsetY: -3,
          w1: 3.9,
          w2: 7.4,
          s1: 1.1,
          s2: 0.55,
          amp1: 9,
          amp2: 6,
          phase: 0.8,
        },
        {
          id: 3,
          // Primary vibrant brand line
          color: "#FF4F00",
          lineWidth: 1.85,
          offsetY: -7,
          w1: 4.4,
          w2: 8.2,
          s1: 1.3,
          s2: 0.7,
          amp1: 11,
          amp2: 7,
          phase: 0,
          isHero: true,
        },
      ];

      const steps = Math.min(Math.floor(width / 3.5), 180);
      const stepX = width / steps;

      lines.forEach((cfg) => {
        ctx.beginPath();
        let leadingX = 0;
        let leadingY = 0;

        for (let i = 0; i <= steps; i++) {
          const x = i * stepX;
          const u = x / width;

          // Econometric drift: slight upward baseline trajectory
          const baselineY = height * 0.56 - u * 8 + cfg.offsetY;

          // Dual-frequency harmonic wave
          const wave =
            Math.sin(u * cfg.w1 + time * cfg.s1 + cfg.phase) * cfg.amp1 +
            Math.cos(u * cfg.w2 - time * cfg.s2 + cfg.phase * 0.5) * cfg.amp2;

          // Mouse deflection
          let mouseDeflection = 0;
          if (isHovered && mouseX > -100) {
            const dist = Math.abs(x - mouseX);
            const radius = 90;
            if (dist < radius) {
              const factor = (1 - dist / radius) ** 2;
              mouseDeflection = (mouseY - (baselineY + wave)) * factor * 0.28;
            }
          }

          const y = Math.max(6, Math.min(height - 6, baselineY + wave + mouseDeflection));

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          if (i === Math.floor(steps * 0.84)) {
            leadingX = x;
            leadingY = y;
          }
        }

        ctx.strokeStyle = cfg.color;
        ctx.lineWidth = cfg.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Glowing pulse bead on the primary line
        if (cfg.isHero && leadingX > 0) {
          const pulse = 1 + Math.sin(time * 3.5) * 0.22;
          
          // Outer glow
          ctx.beginPath();
          ctx.arc(leadingX, leadingY, 6.5 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 79, 0, 0.25)";
          ctx.fill();

          // Core bead
          ctx.beginPath();
          ctx.arc(leadingX, leadingY, 3 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = "#FF4F00";
          ctx.fill();

          // Tiny inner highlight
          ctx.beginPath();
          ctx.arc(leadingX, leadingY, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="relative mb-5 h-14 sm:h-16 w-full max-w-xl overflow-hidden cursor-crosshair select-none"
      title="Live Econometric Trend Harmonics"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
