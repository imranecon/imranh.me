"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";

import { useSectionHeaderSync } from "@/lib/useSectionHeaderSync";
import { usePortfolio } from "@/context/PortfolioContext";
import { ResearchItem } from "@/types/portfolio";

export function ResearchSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { opacity: headingOpacity, scale: headingScale, dotScale, dotOpacity } = useSectionHeaderSync(sectionRef);
  const { data } = usePortfolio();
  const papers: ResearchItem[] = data.research || [];

  // BY DEFAULT ALL ACCORDIONS ARE CLOSED
  const [openId, setOpenId] = React.useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section ref={sectionRef} id="academic-papers" className="border-b border-border py-6 sm:py-9 md:py-18 relative">
      <span id="research" className="sr-only" aria-hidden="true" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-12">
          
          {/* Synchronized Scroll-Activated Section Title */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-24">
              <motion.div
                style={{ opacity: headingOpacity, scale: headingScale, transformOrigin: "left center" }}
                className="flex items-center gap-2.5"
              >
                <motion.span
                  style={{ scale: dotScale, opacity: dotOpacity }}
                  className="h-2 w-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(255,79,0,0.8)]"
                />
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                  Academic Papers
                </h2>
              </motion.div>
            </div>
          </div>

          {/* Research List */}
          <div className="md:col-span-8 space-y-6 sm:space-y-8 md:space-y-10">
            {papers.map((paper, idx) => {
              const isOpen = openId === paper.id;
              return (
                <motion.article
                  key={paper.id || `${paper.title}-${idx}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group border-b border-border/70 pb-6 sm:pb-8 last:border-b-0"
                >
                  <div className="mb-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {paper.year}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline gap-1"
                    >
                      <span>{paper.title}</span>
                      <ArrowUpRight className="h-4 w-4 inline-block opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-primary shrink-0" />
                    </a>
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-foreground/80 mb-1">
                    {paper.authors}
                  </p>

                  <p className="font-sans text-xs sm:text-sm text-muted-foreground italic mb-4">
                    {paper.status}
                  </p>

                  {/* Modern Rounded Buttons */}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/25 hover:bg-primary hover:text-white transition-all font-medium cursor-pointer"
                    >
                      <span>Read paper</span>
                      <span>&rarr;</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => toggleAccordion(paper.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span>{isOpen ? "Hide abstract" : "Abstract"}</span>
                      {isOpen ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Accordion Content (Default Closed) */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 rounded-xl bg-muted/40 border-l-2 border-primary text-sm font-sans text-foreground/85 leading-relaxed space-y-2.5">
                          {paper.abstract.split(/\n\s*\n/).map((para, pIdx) => (
                            <p key={pIdx} className="whitespace-pre-line">{para.trim()}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
