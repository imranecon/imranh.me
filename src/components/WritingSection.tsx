"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export function WritingSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { data } = usePortfolio();
  const writing = data.writing || { intro: "", articles: [] };
  const intro = writing.intro || "";
  const articles = Array.isArray(writing.articles) ? writing.articles : [];

  return (
    <section ref={sectionRef} id="writing" className="border-b border-border py-6 sm:py-9 md:py-18">
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
                  Writing
                </h2>
              </motion.div>
            </div>
          </div>

          {/* Articles List */}
          <div className="md:col-span-8">
            {intro && (
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-sans text-base sm:text-lg text-foreground/80 mb-4 sm:mb-6 md:mb-8 leading-relaxed space-y-3"
              >
                {intro.split(/\n\s*\n/).map((para, pIdx) => (
                  <p key={pIdx} className="whitespace-pre-line">{para.trim()}</p>
                ))}
              </motion.div>
            )}

            <ul className="divide-y divide-border/60 border-t border-b border-border/60">
              {articles.map((item, idx) => (
                <motion.li
                  key={item.id || `${item.title}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3 sm:py-4.5 text-foreground/90 hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="font-sans text-base sm:text-[17px] group-hover:underline underline-offset-4 leading-normal pr-4">
                      {item.title}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
