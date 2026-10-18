"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";

function WavyNavLink({ href, label }: { href: string; label: string }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative text-foreground/80 hover:text-primary transition-colors py-1.5 font-sans text-[15px] block overflow-visible group"
    >
      <span>{label}</span>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute -bottom-0.5 left-0 w-full h-[5px] overflow-hidden origin-left pointer-events-none"
          >
            <motion.svg
              viewBox="0 0 120 6"
              className="w-[180%] h-full"
              preserveAspectRatio="none"
              animate={{ x: [0, -32] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1.1 }}
            >
              <path
                d="M 0,3 Q 4,0.5 8,3 T 16,3 T 24,3 T 32,3 T 40,3 T 48,3 T 56,3 T 64,3 T 72,3 T 80,3 T 88,3 T 96,3 T 104,3 T 112,3 T 120,3"
                fill="none"
                stroke="#FF4F00"
                strokeWidth="1.6"
              />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
    </a>
  );
}

import { usePortfolio } from "@/context/PortfolioContext";

const emptySubscribe = () => () => {};

function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function SiteHeader() {
  const { setTheme, resolvedTheme } = useTheme();
  const { data } = usePortfolio();
  const cvUrl = data.hero.cvUrl || "/imranh_cv.pdf";
  const mounted = useMounted();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [cvHovered, setCvHovered] = React.useState(false);

  const navLinks = [
    { label: "Education", href: "#education" },
    { label: "Academic Papers", href: "#academic-papers" },
    { label: "Research Experience", href: "#research-experience" },
    { label: "Outreach", href: "#outreach" },
    { label: "Writing", href: "#writing" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md transition-colors duration-200"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo: Enlarged font size for bolder presence */}
        <Link
          href="#"
          className="group flex items-center transition-transform hover:opacity-90"
          aria-label="imranh."
        >
          <span className="font-serif text-3xl sm:text-[34px] font-medium tracking-tight text-foreground select-none leading-none">
            imranh<span className="text-[#FF4F00] font-bold">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          <ul className="flex items-center gap-7 text-sm">
            {navLinks.map((item) => (
              <li key={item.href}>
                <WavyNavLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>

          <div className="h-4 w-px bg-border mx-1" />

          {/* CV Button: Opens PDF in new tab */}
          <motion.a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setCvHovered(true)}
            onMouseLeave={() => setCvHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-1.5 px-4.5 py-1.5 text-xs font-mono font-medium text-white bg-primary border border-primary rounded-full transition-all duration-300 shadow-[0_0_0px_rgba(255,79,0,0)] hover:shadow-[0_0_22px_rgba(255,79,0,0.65)] hover:border-white/60 cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1">
              <span>CV</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>

            {/* Wavy animated underline inside CV button on hover */}
            <AnimatePresence>
              {cvHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-0 left-0 w-full h-[3.5px] overflow-hidden pointer-events-none"
                >
                  <motion.svg
                    viewBox="0 0 100 6"
                    className="w-[180%] h-full"
                    preserveAspectRatio="none"
                    animate={{ x: [0, -24] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 0.9 }}
                  >
                    <path
                      d="M 0,3 Q 3,0.5 6,3 T 12,3 T 18,3 T 24,3 T 30,3 T 36,3 T 42,3 T 48,3 T 54,3 T 60,3 T 66,3 T 72,3 T 78,3 T 84,3 T 90,3 T 96,3 T 100,3"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </motion.svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.a>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary/50 hover:bg-muted cursor-pointer"
            aria-label="Toggle theme"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0" />
              ) : (
                <Moon className="h-4 w-4 text-foreground transition-transform duration-300 rotate-0" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </button>
        </nav>

        {/* Mobile Nav Trigger */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Glowing CV button: opens in new tab */}
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3.5 py-1 text-xs font-mono font-medium text-white bg-primary border border-primary rounded-full shadow-[0_0_12px_rgba(255,79,0,0.4)]"
          >
            <span>CV</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>

          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border bg-card text-foreground"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-foreground" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border bg-card text-foreground"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-border bg-background px-4 py-4 space-y-3"
          >
            <ul className="space-y-2 text-sm">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-foreground/90 border-b border-border/50 text-[15px]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
