"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "@/context/PortfolioContext";

export function EducationSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { data } = usePortfolio();
  const education = data.education || [];

  return (
    <section ref={sectionRef} id="education" className="border-b border-border py-6 sm:py-9 md:py-18">
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
                  Education
                </h2>
              </motion.div>
            </div>
          </div>

          {/* Education List */}
          <div className="md:col-span-8">
            <ul className="divide-y divide-border/60">
              {education.map((item, idx) => (
                <motion.li
                  key={item.id || `${item.degree}-${idx}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 ${
                    idx === 0
                      ? "pb-4 sm:pb-5"
                      : idx === education.length - 1
                        ? "pt-4 sm:pt-5"
                        : "py-4 sm:py-5"
                  }`}
                >
                  <div className="font-sans text-base sm:text-lg text-foreground/90">
                    <strong className="font-serif font-medium text-foreground">
                      {item.degree}
                    </strong>
                    , {item.institution}
                  </div>
                  <span className="font-mono text-xs sm:text-sm text-muted-foreground shrink-0">
                    {item.period}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
