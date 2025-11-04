import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ThoughtEntry } from "../data/thoughts";
import { thoughtEntries } from "../data/thoughts";

export const Thoughts = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="relative h-screen overflow-hidden pt-6 px-6 md:pt-16 md:px-16 text-primary">
      {/* Blog Posts - extends behind title */}
      <div className="absolute inset-0 pt-6 px-6 md:pt-16 md:px-16">
        <div className="h-full overflow-y-auto scrollbar-hide md:pl-8">
          <div className="max-w-3xl space-y-6 pt-32 md:pt-24">
            {thoughtEntries.length > 0 ? (
              thoughtEntries.map((thought) => (
                <ThoughtCard
                  key={thought.id}
                  thought={thought}
                  isExpanded={expandedId === thought.id}
                  onToggle={() => handleToggle(thought.id)}
                  formatDate={formatDate}
                />
              ))
            ) : (
              <div className="flex h-32 w-full items-center justify-center border border-dashed border-secondary/50 rounded-xl">
                <p className="text-sm text-secondary">
                  No thoughts yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top fade overlay - uses CSS variable for theme-aware gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-30 transition-all duration-300"
        style={{
          background: 'linear-gradient(to bottom, var(--color-bg) 0%, var(--color-bg) 40%, color-mix(in srgb, var(--color-bg) 90%, transparent) 60%, color-mix(in srgb, var(--color-bg) 60%, transparent) 80%, transparent 100%)'
        }}
      />

      {/* Page Title - floats on top */}
      <div className="relative pt-16 md:-mt-8 md:pt-0 pb-8 md:pb-12 md:pl-8 z-40 pointer-events-none">
        <h1 className="mb-1 font-serif text-5xl tracking-tight text-primary">
          Thoughts
        </h1>
        <p className="font-serif text-sm text-secondary">
          reflections on spaceflight, engineering, and technology
        </p>
      </div>
    </div>
  );
};

type ThoughtCardProps = {
  thought: ThoughtEntry;
  isExpanded: boolean;
  onToggle: () => void;
  formatDate: (date: string) => string;
};

const ThoughtCard = ({
  thought,
  isExpanded,
  onToggle,
  formatDate,
}: ThoughtCardProps) => {
  return (
    <article className="group">
      <button
        onClick={onToggle}
        className={`relative w-full text-left rounded-xl border p-6 backdrop-blur-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
          isExpanded
            ? // Expanded: Green glass material
              "border-[rgba(157,205,180,0.5)] bg-[rgba(157,205,180,0.25)] shadow-[0_3px_10px_rgba(157,205,180,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]"
            : // Not expanded: Clear glass material with subtle green on hover
              "border-white/20 bg-transparent shadow-[0_2px_6px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-[rgba(157,205,180,0.3)] hover:bg-[rgba(157,205,180,0.1)] hover:shadow-[0_2px_6px_rgba(157,205,180,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] dark:border-white/10 dark:hover:border-[rgba(157,205,180,0.3)]"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h2 className="text-2xl font-serif leading-tight text-primary mb-2">
              {thought.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
              <time dateTime={thought.date}>{formatDate(thought.date)}</time>
              {thought.readTime && (
                <>
                  <span className="text-secondary/50">•</span>
                  <span>{thought.readTime} min read</span>
                </>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <motion.svg
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="h-6 w-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </div>
        </div>

        {/* Tags */}
        {thought.tags && thought.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thought.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs rounded-md bg-accent/20 text-primary border border-accent/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt */}
        <p className="text-sm text-secondary leading-relaxed">
          {thought.excerpt}
        </p>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 px-6 pb-2">
              <div className="prose prose-sm max-w-none text-secondary">
                {thought.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

export default Thoughts;
