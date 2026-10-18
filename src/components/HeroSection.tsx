"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check } from "lucide-react";
import portraitImg from "../../public/portrait.webp";

import { HeroEconometricTrend } from "./HeroEconometricTrend";
import { usePortfolio } from "@/context/PortfolioContext";

export function HeroSection() {
  const { data } = usePortfolio();
  const hero = data.hero;
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    const rawEmail = hero.socialLinks.email.replace(/^mailto:/i, "").trim();
    try {
      await navigator.clipboard.writeText(rawEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      window.location.href = `mailto:${rawEmail}`;
    }
  };

  const socialLinks = [
    {
      label: "LinkedIn",
      href: hero.socialLinks.linkedin,
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.35a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
        </svg>
      ),
    },
    {
      label: "GitHub",
      href: hero.socialLinks.github,
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
        </svg>
      ),
    },
    {
      label: "X (Twitter)",
      href: hero.socialLinks.twitter,
      icon: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border pt-5 sm:pt-8 md:pt-10 pb-6 sm:pb-10 md:pb-15">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 md:gap-8 items-center">
          
          {/* Left Column: Text & Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-6 lg:col-span-7 flex flex-col justify-center order-2 md:order-1"
          >
            {/* Name */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.08] mb-2 sm:mb-3"
            >
              {hero.name}
            </motion.h1>

            {/* Affiliation: supports multiple lines */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-sans text-sm sm:text-lg text-primary font-normal mb-3.5 sm:mb-5 leading-snug whitespace-pre-line"
            >
              {hero.affiliation}
            </motion.div>

            {/* Biography: supports multiple paragraphs */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-sans text-sm sm:text-[18px] text-foreground/80 leading-relaxed max-w-xl mb-5 sm:mb-8 space-y-3.5"
            >
              {hero.bio.split(/\n\s*\n/).map((para, i) => (
                <p key={i} className="whitespace-pre-line">{para.trim()}</p>
              ))}
            </motion.div>

            {/* Modern Rounded Social Media Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-3 pt-0.5 sm:pt-1"
            >
              {socialLinks.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label={item.label}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border/80 bg-card/90 text-foreground/80 hover:text-primary hover:border-primary/60 hover:shadow-[0_4px_16px_rgba(255,79,0,0.18)] transition-all cursor-pointer shadow-xs"
                >
                  {item.icon}
                </motion.a>
              ))}

              {/* Email button that copies to clipboard */}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={handleCopyEmail}
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label="Copy email address"
                  title="Click to copy email address"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border/80 bg-card/90 text-foreground/80 hover:text-primary hover:border-primary/60 hover:shadow-[0_4px_16px_rgba(255,79,0,0.18)] transition-all cursor-pointer shadow-xs"
                >
                  {copiedEmail ? <Check className="h-4 w-4 text-emerald-500" /> : <Mail className="h-4 w-4" />}
                </motion.button>
                <AnimatePresence>
                  {copiedEmail && (
                    <motion.span
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.9 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-foreground text-background text-[11px] font-mono shadow-md pointer-events-none z-20"
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Portrait Stage with swapped bar colors and shifted higher */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-6 lg:col-span-5 flex justify-center order-1 md:order-2"
          >
            {/* Enlarged portrait container shifted higher up */}
            <div className="relative w-full max-w-[270px] sm:max-w-[340px] md:max-w-[420px] aspect-[4/5] flex items-end justify-center -mt-3 sm:-mt-6 md:-mt-10">
              
              {/* The 4 Geometric Editorial Bars growing from bottom up */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                
                {/* Bar 1: Center main rectangle behind head & shoulders - SWAPPED TO ORANGE */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    transformOrigin: "bottom",
                    left: "17%",
                    width: "46%",
                    height: "88%",
                  }}
                  className="absolute bottom-0 bg-[#FF4F00] rounded-t-sm"
                />

                {/* Bar 2: Left accent rectangle - SWAPPED TO NEUTRAL/MUTED */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    transformOrigin: "bottom",
                    left: "5%",
                    width: "23%",
                    height: "62%",
                    backgroundColor: "var(--bar-1)",
                  }}
                  className="absolute bottom-0 rounded-t-sm"
                />

                {/* Bar 3: Wireframe 1px text border */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    transformOrigin: "bottom",
                    left: "55%",
                    width: "27%",
                    height: "73%",
                  }}
                  className="absolute bottom-0 border border-foreground/60 dark:border-foreground/80 bg-transparent rounded-t-sm"
                />

                {/* Bar 4: Diagonal hatch pattern */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    transformOrigin: "bottom",
                    left: "72%",
                    width: "24%",
                    height: "36%",
                  }}
                  className="absolute bottom-0 hatch-pattern text-muted-foreground/35 border-t border-border rounded-t-sm"
                />
              </div>

              {/* Portrait Image with subtle spring entrance and grayscale filter */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="relative z-10 w-[88%] h-full flex items-end group"
              >
                <Image
                  src={portraitImg}
                  alt="Portrait of Imran Hossain"
                  priority
                  className="object-contain w-full h-auto filter grayscale contrast-110 group-hover:contrast-100 transition-all duration-500 group-hover:scale-[1.01]"
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Exact Econometric Trend Lines from index (2).html (seeded random walk at bottom) */}
      <HeroEconometricTrend />
    </section>
  );
}
