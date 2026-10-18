"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sun, Moon, ShieldCheck, AlertCircle } from "lucide-react";

interface AdminLoginProps {
  onSuccess: () => void;
}

const emptySubscribe = () => () => {};

function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const mounted = useMounted();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(data.error || "Incorrect password. Please try again.");
      }
    } catch {
      setError("Unable to authenticate. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary selection:text-white transition-colors p-4 sm:p-6">
      
      {/* Top Bar with Brand & Theme Toggle */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:border-primary/50 text-foreground transition-all bg-card cursor-pointer shadow-xs"
          aria-label="Toggle theme"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </button>
      </header>

      {/* Center Auth Card */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full mx-auto my-auto"
      >
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl relative overflow-hidden">
          
          {/* Subtle top decorative accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-serif font-bold text-xl shadow-md shadow-primary/20 mb-3.5">
              IH
            </div>
            <h1 className="font-serif text-2xl font-medium text-foreground tracking-tight mb-1.5">
              Admin Access Required
            </h1>
            <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Enter your master password to unlock and manage Imran Hossain&apos;s portfolio.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Master Password
              </label>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-primary hover:bg-[#E04500] text-white text-sm font-medium transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Unlock Dashboard</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security badge */}
          <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-center gap-1.5 text-[11px] font-mono text-muted-foreground/75">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Encrypted Session Protected</span>
          </div>

        </div>
      </motion.main>

      {/* Footer copyright */}
      <footer className="text-center text-xs font-mono text-muted-foreground/60 pb-2">
        Imran Hossain Portfolio &bull; 2026
      </footer>

    </div>
  );
}
