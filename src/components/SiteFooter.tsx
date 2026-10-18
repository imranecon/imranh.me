"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { ArrowUp, MousePointerClick } from "lucide-react";

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  alpha: number;
}

export function SiteFooter() {
  const { resolvedTheme } = useTheme();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Fluid spring physics state
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseSpeed = 0;
    let isHovering = false;
    let time = 0;

    const shockwaves: Shockwave[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      const dx = newX - lastMouseX;
      const dy = newY - lastMouseY;
      mouseSpeed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.35, 25);

      lastMouseX = newX;
      lastMouseY = newY;
      targetMouseX = newX;
      targetMouseY = newY;
      isHovering = true;
    };

    const onMouseEnter = () => {
      isHovering = true;
    };

    const onMouseLeave = () => {
      isHovering = false;
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create an expanding economic shockwave ripple
      shockwaves.push({
        x,
        y,
        radius: 0,
        maxRadius: Math.max(width * 0.65, 380),
        strength: 28,
        alpha: 1,
      });
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("click", onClick);

    const isDark = resolvedTheme === "dark";
    const primaryColor = "#FF4F00";
    const faintLineColor = isDark ? "rgba(236, 234, 228, 0.22)" : "rgba(22, 24, 29, 0.16)";
    const highlightLineColor = isDark ? "rgba(255, 79, 0, 0.45)" : "rgba(255, 79, 0, 0.35)";

    const render = () => {
      time += 0.018;

      // Smooth damping interpolation (lerp)
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;
      mouseSpeed += (0 - mouseSpeed) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerY = height * 0.5;
      const numLines = 7;

      // Update and propagate shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 5.5;
        sw.alpha = 1 - sw.radius / sw.maxRadius;
        if (sw.radius >= sw.maxRadius) {
          shockwaves.splice(s, 1);
        } else {
          // Subtle shockwave perimeter ring
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 79, 0, ${sw.alpha * 0.28})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Render 7 interwoven harmonic waves with physics displacement
      for (let l = 0; l < numLines; l++) {
        const isFocal = l === 3; // Main active equilibrium line
        const isAccent = l === 2 || l === 4;
        const lineOffset = (l - 3) * 11;
        const freq = 0.0055 + l * 0.0012;
        const baseAmp = 18 + l * 4.5;
        const phase = time * 0.8 + l * 0.75;

        ctx.beginPath();

        let focalBeadX = 0;
        let focalBeadY = 0;

        for (let x = 0; x <= width; x += 4) {
          // Harmonic wave equation
          let y =
            centerY +
            lineOffset +
            Math.sin(x * freq + phase) * baseAmp +
            Math.cos(x * 0.003 - phase * 0.5) * (baseAmp * 0.4);

          // Dynamic mouse gravitational elastic pull
          if (isHovering && mouseX > -100) {
            const dx = x - mouseX;
            const dist = Math.abs(dx);
            const radius = width * 0.22;
            if (dist < radius) {
              const falloff = Math.cos((dist / radius) * (Math.PI / 2));
              const pull = (mouseY - centerY) * 0.45 * falloff;
              const velocityRipple = Math.sin(dist * 0.04 - time * 6) * (mouseSpeed * 0.5) * falloff;
              y += pull + velocityRipple;
            }
          }

          // Shockwave displacement
          for (let s = 0; s < shockwaves.length; s++) {
            const sw = shockwaves[s];
            const dist = Math.abs(x - sw.x);
            const waveFrontDist = Math.abs(dist - sw.radius);
            if (waveFrontDist < 45) {
              const rippleFactor = Math.sin((waveFrontDist / 45) * Math.PI);
              y += Math.sin(sw.radius * 0.1) * sw.strength * sw.alpha * rippleFactor;
            }
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          if (isFocal && Math.abs(x - mouseX) < 4) {
            focalBeadX = x;
            focalBeadY = y;
          }
        }

        if (isFocal) {
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 2.0;
          ctx.globalAlpha = 0.9;
        } else if (isAccent) {
          ctx.strokeStyle = highlightLineColor;
          ctx.lineWidth = 1.1;
          ctx.globalAlpha = 0.85;
        } else {
          ctx.strokeStyle = faintLineColor;
          ctx.lineWidth = 0.75;
          ctx.globalAlpha = 0.7;
        }

        ctx.stroke();

        // Draw Interactive Equilibrium Tracker Marker on the focal wave
        if (isFocal && isHovering && mouseX > 0) {
          // Pulsing Glow
          ctx.beginPath();
          ctx.arc(focalBeadX, focalBeadY, 8 + Math.sin(time * 4) * 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 79, 0, 0.25)";
          ctx.globalAlpha = 0.8;
          ctx.fill();

          // Core Bead
          ctx.beginPath();
          ctx.arc(focalBeadX, focalBeadY, 4, 0, Math.PI * 2);
          ctx.fillStyle = primaryColor;
          ctx.globalAlpha = 1;
          ctx.fill();

          // Hairline coordinate crosshair to center
          ctx.beginPath();
          ctx.setLineDash([2, 4]);
          ctx.moveTo(focalBeadX, 0);
          ctx.lineTo(focalBeadX, height);
          ctx.strokeStyle = "rgba(255, 79, 0, 0.35)";
          ctx.lineWidth = 0.75;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [resolvedTheme]);

  return (
    <footer className="w-full bg-background pt-6 sm:pt-9 md:pt-12 pb-6 sm:pb-9 transition-colors border-t border-border/70 select-none overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Interactive Economic Waveform Surface (Pure Graphic • No Text Clutter • Clickable) */}
        <div className="relative w-full">
          
          {/* Subtle Interaction Guide Indicator */}
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground/75 mb-2">
            <span className="flex items-center gap-1.5 uppercase tracking-widest text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Equilibrium Wave Field
            </span>
            <span className="text-[10px] hidden sm:flex items-center gap-1 opacity-70">
              <MousePointerClick className="h-3 w-3 text-primary" />
              Move to modulate &bull; Click to propagate shockwave
            </span>
          </div>

          {/* 60fps Hardware-Accelerated Interactive Canvas */}
          <div className="relative w-full h-28 sm:h-36 md:h-48 cursor-crosshair group border-b border-border/60 pb-2">
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Minimal Footer Line */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6 text-xs font-mono text-muted-foreground">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-serif font-medium text-foreground text-sm">
                Imran Hossain <span className="text-[#FF4F00]"></span>
              </span>
              <span className="text-border">&bull;</span>
              <span>2026</span>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border/80 bg-card hover:bg-muted text-foreground/85 hover:text-primary hover:border-primary/50 transition-all cursor-pointer group self-end sm:self-center shadow-xs"
            aria-label="Back to top"
          >
            <span>Top</span>
            <ArrowUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
