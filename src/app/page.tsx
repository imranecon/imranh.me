import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { EducationSection } from "@/components/EducationSection";
import { ResearchSection } from "@/components/ResearchSection";
import { PolicySection } from "@/components/PolicySection";
import { TeachingSection } from "@/components/TeachingSection";
import { WritingSection } from "@/components/WritingSection";
import { SiteFooter } from "@/components/SiteFooter";
import portfolioData from "@/data/portfolio.json";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { PortfolioData } from "@/types/portfolio";

export default function Home() {
  return (
    <PortfolioProvider initialData={portfolioData as PortfolioData}>
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
