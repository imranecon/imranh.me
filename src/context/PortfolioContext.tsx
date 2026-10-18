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

  // Sync with API on mount if not provided with initialData
  React.useEffect(() => {
    if (!initialData) {
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
    }
  }, [initialData]);

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
