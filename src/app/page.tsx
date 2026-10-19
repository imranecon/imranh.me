import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { EducationSection } from "@/components/EducationSection";
import { ResearchSection } from "@/components/ResearchSection";
import { PolicySection } from "@/components/PolicySection";
import { TeachingSection } from "@/components/TeachingSection";
import { WritingSection } from "@/components/WritingSection";
import { SiteFooter } from "@/components/SiteFooter";
import { getPortfolioData } from "@/lib/portfolioData";
import { PortfolioProvider } from "@/context/PortfolioContext";

export const instant = false;

export default async function Home() {
  const portfolioData = await getPortfolioData();

  return (
    <PortfolioProvider initialData={portfolioData}>
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
        <SiteHeader />
        <main className="flex-1">
          <HeroSection />
          <EducationSection />
          <ResearchSection />
          <PolicySection />
          <TeachingSection />
          <WritingSection />
        </main>
        <SiteFooter />
      </div>
    </PortfolioProvider>
  );
}
