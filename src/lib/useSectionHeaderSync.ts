"use client";

import * as React from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

interface SectionSyncOptions {
  isFirst?: boolean;
  isLast?: boolean;
}

export interface SectionHeaderSyncReturn {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  dotScale: MotionValue<number>;
  dotOpacity: MotionValue<number>;
}

export function useSectionHeaderSync(
  targetRef: React.RefObject<HTMLElement | null>,
  options: SectionSyncOptions = {}
): SectionHeaderSyncReturn {
  const { isFirst = false, isLast = false } = options;

  // Track entry: when the top of the section moves from 85% of viewport to 25% of viewport
  const { scrollYProgress: enterProgress } = useScroll({
    target: targetRef,
    offset: ["start 85%", "start 25%"],
  });

  // Track exit: when the bottom of the section moves from 80% of viewport to 20% of viewport
  const { scrollYProgress: exitProgress } = useScroll({
    target: targetRef,
    offset: ["end 80%", "end 20%"],
  });

  // Combined smooth opacity:
  // Starts at 0.28 (dimmed), ramps to 1.0 as enterProgress goes 0 -> 1,
  // stays 1.0 while inside, ramps down to 0.28 as exitProgress goes 0 -> 1.
  const opacity = useTransform([enterProgress, exitProgress], ([enter, exit]: number[]) => {
    const inVal = isFirst ? (enter > 0 ? 0.28 + 0.72 * enter : 0.9) : 0.28 + 0.72 * enter;
    const outVal = isLast ? 1 : 1 - 0.72 * exit;
    return Math.max(0.28, Math.min(inVal, outVal));
  });

  // Subtle scale transition (0.97 to 1.0)
  const scale = useTransform([enterProgress, exitProgress], ([enter, exit]: number[]) => {
    const inVal = isFirst ? (enter > 0 ? 0.97 + 0.03 * enter : 1) : 0.97 + 0.03 * enter;
    const outVal = isLast ? 1 : 1 - 0.03 * exit;
    return Math.max(0.97, Math.min(inVal, outVal));
  });

  // Glowing indicator dot scale (0 to 1)
  const dotScale = useTransform([enterProgress, exitProgress], ([enter, exit]: number[]) => {
    const inVal = isFirst ? (enter > 0 ? enter : 1) : enter;
    const outVal = isLast ? 1 : 1 - exit;
    return Math.max(0, Math.min(inVal, outVal));
  });

  // Glowing dot opacity (0 to 1)
  const dotOpacity = useTransform([enterProgress, exitProgress], ([enter, exit]: number[]) => {
    const inVal = isFirst ? (enter > 0 ? enter : 1) : enter;
    const outVal = isLast ? 1 : 1 - exit;
    return Math.max(0, Math.min(inVal, outVal));
  });

  return { opacity, scale, dotScale, dotOpacity };
}
