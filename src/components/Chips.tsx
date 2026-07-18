import { AnimatePresence, motion } from "motion/react";
import type { TokenPiece } from "../lib/tokenizer";
import { colorForToken } from "../lib/tokenizer";

type Size = "sm" | "md" | "lg";

interface ChipStripProps {
  tokens: TokenPiece[];
  /** increment to replay the knife "slice" moment */
  sliceSignal?: number;
  size?: Size;
  /** token positions to ring in brass (used to mark conflicts) */
  accent?: number[];
  /** dim tokens not in this list (focus mode) */
  dimOthers?: boolean;
  className?: string;
  /** show the token id badge on each chip */
  showId?: boolean;
}

const SIZE: Record<Size, string> = {
  sm: "text-[11px] leading-4 px-1.5 py-1 rounded-[5px] gap-1",
  md: "text-sm leading-5 px-2 py-1.5 rounded-md gap-1.5",
  lg: "text-[17px] leading-6 px-2.5 py-2 rounded-lg gap-2",
};

/**
 * A wrapping strip of token tiles. Chips reflow with spring layout animations,
 * so as text changes they visibly *divide* and merge — the central metaphor.
 */
export function ChipStrip({
  tokens,
  sliceSignal = 0,
  size = "md",
  accent = [],
  dimOthers = false,
  className = "",
  showId = true,
}: ChipStripProps) {
  const accentSet = new Set(accent);

  return (
    <div className={`relative ${className}`}>
      {/* the knife sweep — replays whenever sliceSignal changes */}
      {sliceSignal > 0 && (
        <span
          key={sliceSignal}
          aria-hidden
          className="knife pointer-events-none absolute inset-y-0 left-0 z-20 w-24 -translate-x-full bg-gradient-to-r from-transparent via-bone/70 to-transparent blur-[1px]"
        />
      )}

      <motion.ul layout className="flex flex-wrap">
        <AnimatePresence mode="popLayout">
          {tokens.map((t, i) => {
            const isAccent = accentSet.has(i);
            const dimmed = dimOthers && !isAccent;
            return (
              <motion.li
                layout
                key={t.key}
                initial={{ opacity: 0, y: 7, scaleX: 0.5 }}
                animate={{
                  opacity: dimmed ? 0.32 : 1,
                  y: 0,
                  scaleX: 1,
                }}
                exit={{ opacity: 0, scaleX: 0.3, transition: { duration: 0.16 } }}
                transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
                className={`group relative inline-flex select-none font-mono font-medium text-ink shadow-[0_1px_0_rgba(0,0,0,0.18)] ${SIZE[size]}`}
                style={{ backgroundColor: colorForToken(t.text, t.id) }}
              >
                <TokenGlyph text={t.text} />

                {isAccent && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-[2px] rounded-[inherit] ring-2 ring-brass"
                  />
                )}

                {/* id badge on hover */}
                {showId && (
                  <span className="pointer-events-none absolute -top-6 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded bg-ink-3 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-bone-dim opacity-0 shadow-lg ring-1 ring-rule transition-opacity duration-150 group-hover:opacity-100">
                    {t.id}
                  </span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

/**
 * Renders a token's text with its invisible spaces made visible. A leading or
 * interior space is the difference between one token and two, so we draw it as
 * a faint mid-dot glued to the glyph it travels with.
 */
function TokenGlyph({ text }: { text: string }) {
  if (!text) {
    return <span className="opacity-50">∅</span>;
  }
  // only the *leading* whitespace gets the visible-space treatment, since that
  // is the part BPE actually bundles into the token.
  const leading = text.length - text.replace(/^\s+/, "").length;
  if (leading === 0) {
    return <span className="whitespace-pre">{text}</span>;
  }
  return (
    <span className="whitespace-pre">
      <span className="opacity-45">{"·".repeat(leading)}</span>
      {text.slice(leading)}
    </span>
  );
}
