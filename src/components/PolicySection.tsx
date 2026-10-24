"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "@/context/PortfolioContext";

export function PolicySection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { data } = usePortfolio();
  const policyWorks = data.policy || [];

  return (
    <section ref={sectionRef} id="research-experience" className="border-b border-border py-6 sm:py-9 md:py-18 relative">
      <span id="policy" className="sr-only" aria-hidden="true" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-12">
          
          {/* Section Title */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-24">
              <motion.div
                className="flex items-center gap-2.5"
              >
                <motion.span
                  className="h-2 w-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(255,79,0,0.8)]"
                />
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-primary">
                  Research experience
                </h2>
              </motion.div>
            </div>
          </div>

          {/* Research Experience List: Editorial list matching other sections */}
          <div className="md:col-span-8 space-y-6 sm:space-y-8 md:space-y-10">
            {policyWorks.map((work, idx) => (
              <motion.article
                key={work.id || `${work.title}-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={idx !== policyWorks.length - 1 ? "border-b border-border/70 pb-6 sm:pb-8" : ""}
              >
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-foreground leading-snug mb-2">
                  {work.title}
                </h3>

                <div className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed max-w-2xl space-y-2 mb-3.5">
                  {(work.description || "").split(/\n\s*\n/).map((para, pIdx) => (
                    <p key={pIdx} className="whitespace-pre-line">{para.trim()}</p>
                  ))}
                </div>

                {Array.isArray(work.tags) && work.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {work.tags.map((tag, tIdx) => (
                      <span
                        key={`${tag}-${tIdx}`}
                        className="font-mono text-[10px] text-muted-foreground bg-muted/70 px-2.5 py-0.5 rounded-full border border-border/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
