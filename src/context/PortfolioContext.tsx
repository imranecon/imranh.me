"use client";

import * as React from "react";
import { PortfolioData } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/defaultPortfolioData";

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: PortfolioData) => Promise<boolean>;
  resetToDefault: () => Promise<boolean>;
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
}

const PortfolioContext = React.createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: PortfolioData;
}) {
  const [data, setData] = React.useState<PortfolioData>(initialData || defaultPortfolioData);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(!initialData);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  // Always fetch latest data from API on mount to ensure fresh state
  React.useEffect(() => {
    let active = true;
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((fetchedData) => {
        if (active && fetchedData && !fetchedData.error) {
          setData(fetchedData);
        }
      })
      .catch((err) => console.error("Failed to fetch portfolio data:", err))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Listen for updates from other tabs or windows
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("portfolio_updates");
      channel.onmessage = (event) => {
        if (event.data?.type === "PORTFOLIO_UPDATED" && event.data?.data) {
          setData(event.data.data);
          setLastSaved(new Date());
        }
      };
    } catch {
      // BroadcastChannel not supported in some older environments
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "portfolio_last_updated" && e.newValue) {
        try {
          const freshData = JSON.parse(e.newValue);
          setData(freshData);
          setLastSaved(new Date());
        } catch {
          fetch("/api/portfolio")
            .then((r) => r.json())
            .then((d) => {
              if (d && !d.error) setData(d);
            });
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const updateData = async (newData: PortfolioData): Promise<boolean> => {
    setIsSaving(true);
    // Optimistic UI update
    setData(newData);

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (!res.ok) throw new Error("Server responded with error");
      const result = await res.json();
      if (result.success) {
        setLastSaved(new Date());
        // Broadcast to other open tabs / windows
        try {
          const channel = new BroadcastChannel("portfolio_updates");
          channel.postMessage({ type: "PORTFOLIO_UPDATED", data: newData });
          channel.close();
        } catch {
          // Ignore
        }
        try {
          localStorage.setItem("portfolio_last_updated", JSON.stringify(newData));
        } catch {
          // Ignore
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error saving portfolio data:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (!res.ok) throw new Error("Failed to reset");
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
        setLastSaved(new Date());
        try {
          const channel = new BroadcastChannel("portfolio_updates");
          channel.postMessage({ type: "PORTFOLIO_UPDATED", data: result.data });
          channel.close();
        } catch {}
        try {
          localStorage.setItem("portfolio_last_updated", JSON.stringify(result.data));
        } catch {}
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error resetting data:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        resetToDefault,
        isSaving,
        isLoading,
        lastSaved,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = React.useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
