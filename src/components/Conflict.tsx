import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChipStrip } from "./Chips";
import { SectionHeading, Reveal } from "./ui";
import {
  ENCODINGS,
  type EncodingId,
  tokenize,
} from "../lib/tokenizer";

// Phrases chosen to split differently across the two encodings.
const CONFLICTS: { label: string; text: string }[] = [
  { label: "self-attention", text: "self-attention mechanisms" },
  { label: "long coinage", text: "Don't misunderestimate recontextualization." },
  { label: "code + symbols", text: "arr.sort((x, y) => x - y)" },
  { label: "emoji run", text: "🎉🦄✨🌊🌈" },
];

export function Conflict({ ready }: { ready: boolean }) {
  const [index, setIndex] = useState(0);
  const [slice, setSlice] = useState(1);
  const text = CONFLICTS[index].text;

  const a = useMemo(() => (ready ? tokenize(text, "o200k_base") : []), [text, ready]);
  const b = useMemo(() => (ready ? tokenize(text, "cl100k_base") : []), [text, ready]);

  const aTexts = useMemo(() => new Set(a.map((t) => t.text)), [a]);
  const bTexts = useMemo(() => new Set(b.map((t) => t.text)), [b]);

  const accentA = a.reduce<number[]>((acc, t, i) => {
    if (!bTexts.has(t.text)) acc.push(i);
    return acc;
  }, []);
  const accentB = b.reduce<number[]>((acc, t, i) => {
    if (!aTexts.has(t.text)) acc.push(i);
    return acc;
  }, []);

  const max = Math.max(a.length, b.length, 1);
  const delta = Math.abs(a.length - b.length);
  const cheaper = a.length <= b.length ? "o200k_base" : "cl100k_base";

  const pick = (i: number) => {
    setIndex(i);
    setSlice((s) => s + 1);
  };

  return (
    <section
      id="conflict"
      className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:py-28"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Specimen — disagreement"
          title={
            <>
              Two tokenizers read the
              <span className="text-brass"> same </span>
              text differently.
            </>
          }
          lede="There is no single correct way to chop a sentence. GPT-4o and GPT-4 use different vocabularies, so the boundaries — and the count — can disagree. These gold-ringed tiles are the contested cuts."
        />
      </Reveal>

      {/* presets */}
      <div className="mt-8 flex flex-wrap gap-2">
        {CONFLICTS.map((c, i) => {
          const active = i === index;
          return (
            <button
              key={c.label}
              onClick={() => pick(i)}
              className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ring-1 transition ${
                active
                  ? "bg-brass text-ink ring-brass"
                  : "bg-ink text-bone-dim ring-rule hover:text-bone hover:ring-bone-faint"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* the two rows */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Side
          id="o200k_base"
          count={a.length}
          accent={accentA}
          tokens={a}
          slice={slice}
          ready={ready}
          highlight={cheaper === "o200k_base"}
        />
        <Side
          id="cl100k_base"
          count={b.length}
          accent={accentB}
          tokens={b}
          slice={slice}
          ready={ready}
          highlight={cheaper === "cl100k_base"}
        />
      </div>

      {/* comparison */}
      <Reveal delay={0.05}>
        <div className="mt-6 rounded-2xl bg-ink-2 p-5 ring-1 ring-rule sm:p-6">
          <div className="space-y-3">
            <BarRow
              label={ENCODINGS.o200k_base.label}
              count={a.length}
              max={max}
              highlight={cheaper === "o200k_base"}
            />
            <BarRow
              label={ENCODINGS.cl100k_base.label}
              count={b.length}
              max={max}
              highlight={cheaper === "cl100k_base"}
            />
          </div>

          <p className="mt-5 border-t border-rule pt-4 font-mono text-xs leading-relaxed text-bone-dim">
            {delta === 0 ? (
              <>They agree here: both spend {a.length} tokens.</>
            ) : (
              <>
                <span className="text-brass">{ENCODINGS[cheaper].label}</span> is
                cheaper by <span className="text-bone">{delta}</span> token
                {delta === 1 ? "" : "s"}. At scale, that gap is real money and real
                context.
              </>
            )}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function Side({
  id,
  count,
  accent,
  tokens,
  slice,
  ready,
  highlight,
}: {
  id: EncodingId;
  count: number;
  accent: number[];
  tokens: ReturnType<typeof tokenize>;
  slice: number;
  ready: boolean;
  highlight: boolean;
}) {
  return (
    <div className="relative rounded-2xl bg-ink-2 p-5 ring-1 ring-rule">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-mono text-sm font-semibold text-bone">
            {ENCODINGS[id].label}
          </p>
          <p className="font-mono text-[11px] text-bone-faint">
            {ENCODINGS[id].blurb}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`font-mono text-2xl font-semibold tabular-nums ${
              highlight ? "text-brass" : "text-bone"
            }`}
          >
            {count}
          </span>
          <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
            tokens
          </span>
        </div>
      </div>

      <div className="mt-4 min-h-[84px] rounded-xl bg-ink/50 p-3 ring-1 ring-rule">
        {ready ? (
          <ChipStrip tokens={tokens} sliceSignal={slice} accent={accent} size="md" />
        ) : (
          <div className="flex h-12 items-center gap-2">
            <span className="h-7 w-16 rounded shimmer" />
            <span className="h-7 w-10 rounded shimmer" />
            <span className="h-7 w-20 rounded shimmer" />
          </div>
        )}
      </div>
    </div>
  );
}

function BarRow({
  label,
  count,
  max,
  highlight,
}: {
  label: string;
  count: number;
  max: number;
  highlight: boolean;
}) {
  const pct = Math.max(6, (count / max) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between font-mono text-[11px]">
        <span className={highlight ? "text-brass" : "text-bone-dim"}>{label}</span>
        <span className="tabular-nums text-bone-dim">{count}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-ink">
        <motion.div
          className={`h-full rounded-full ${highlight ? "bg-brass" : "bg-ink-4"}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
