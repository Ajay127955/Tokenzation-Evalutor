import type { ReactNode } from "react";
import { motion } from "motion/react";

/** Small mono label that records what a section actually is. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-faint">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
}

export function SectionHeading({ eyebrow, title, lede }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-4xl md:text-[2.7rem]">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 text-base leading-relaxed text-bone-dim sm:text-lg">
          {lede}
        </p>
      )}
    </div>
  );
}

/** A big mono measurement with a small label beneath. */
export function Stat({
  value,
  label,
  accent = false,
}: {
  value: ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span
        className={`font-mono text-3xl font-semibold tabular-nums sm:text-4xl ${
          accent ? "text-brass" : "text-bone"
        }`}
      >
        {value}
      </span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
        {label}
      </span>
    </div>
  );
}

/** Fade-and-rise on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
