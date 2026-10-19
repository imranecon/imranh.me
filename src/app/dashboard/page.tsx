import { Metadata } from "next";
import { getPortfolioData } from "@/lib/portfolioData";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const instant = false;

export const metadata: Metadata = {
  title: "Dashboard | Imran Hossain Portfolio",
  description: "Manage portfolio sections, content, and publications.",
  robots: "noindex, nofollow",
};

export default async function DashboardPage() {
  const portfolioData = await getPortfolioData();

  return (
    <PortfolioProvider initialData={portfolioData}>
      <DashboardClient />
    </PortfolioProvider>
  );
}
