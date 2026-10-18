import { Metadata } from "next";
import portfolioData from "@/data/portfolio.json";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { PortfolioData } from "@/types/portfolio";

export const metadata: Metadata = {
  title: "Dashboard | Imran Hossain Portfolio",
  description: "Manage portfolio sections, content, and publications.",
  robots: "noindex, nofollow",
};

export default function DashboardPage() {
  return (
    <PortfolioProvider initialData={portfolioData as PortfolioData}>
      <DashboardClient />
    </PortfolioProvider>
  );
}
