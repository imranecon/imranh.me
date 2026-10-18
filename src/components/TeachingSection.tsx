"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useSectionHeaderSync } from "@/lib/useSectionHeaderSync";
import { usePortfolio } from "@/context/PortfolioContext";

export function TeachingSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { opacity: headingOpacity, scale: headingScale, dotScale, dotOpacity } = useSectionHeaderSync(sectionRef);
  const { data } = usePortfolio();
  const teachingItems = data.teaching;

  return (
    <section ref={sectionRef} id="outreach" className="border-b border-border py-6 sm:py-9 md:py-18 relative">
      <span id="teaching" className="sr-only" aria-hidden="true" />
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
                  Outreach
                </h2>
              </motion.div>
            </div>
          </div>

          {/* Entries */}
          <div className="md:col-span-8 space-y-6 sm:space-y-8 md:space-y-10">
            {teachingItems.map((item, idx) => (
              <motion.article 
                key={item.id || item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={idx !== teachingItems.length - 1 ? "border-b border-border/70 pb-6 sm:pb-8" : ""}
              >
                {item.badge && (
                  <div className="mb-2">
                    <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/70 inline-block">
                      {item.badge}
                    </span>
                  </div>
                )}
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-foreground leading-snug mb-2">
                  {item.title}
                </h3>
                <div className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed max-w-2xl space-y-2.5">
                  {item.description.split(/\n\s*\n/).map((para, pIdx) => (
                    <p key={pIdx} className="whitespace-pre-line">{para.trim()}</p>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
