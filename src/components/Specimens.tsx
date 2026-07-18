import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChipStrip } from "./Chips";
import { SectionHeading, Reveal } from "./ui";
import {
  colorForToken,
  tokenize,
  utf8Bytes,
  type TokenPiece,
} from "../lib/tokenizer";

/* ------------------------------------------------------------------ */
/*  Specimen 1 — Shatter: one glyph, many tokens                       */
/* ------------------------------------------------------------------ */

const SHATTER_SPECIMENS = [
  { g: "a", kind: "frequent letter" },
  { g: "love", kind: "common word" },
  { g: "🦄", kind: "emoji" },
  { g: "🎉", kind: "emoji" },
  { g: "父", kind: "CJK ideograph" },
  { g: "🇧🇷", kind: "flag (2 code points)" },
] as const;

export function ShatterCard({ ready }: { ready: boolean }) {
  const [sel, setSel] = useState<number>(3);
  const [burst, setBurst] = useState(1);
  const glyph = SHATTER_SPECIMENS[sel].g;

  const tokens = useMemo<TokenPiece[]>(
    () => (ready ? tokenize(glyph, "o200k_base") : []),
    [glyph, ready, burst],
  );
  const count = tokens.length;
  const codePoints = Array.from(glyph).length;

  const pick = (i: number) => {
    setSel(i);
    setBurst((b) => b + 1);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl bg-ink-2 p-5 ring-1 ring-rule sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">One glyph, many tokens</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
          shatter
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-bone-dim">
        A single character you read as one thing can cost a model several tokens.
        Pick a specimen and watch it break apart.
      </p>

      {/* specimen picker */}
      <div className="mt-4 flex flex-wrap gap-2">
        {SHATTER_SPECIMENS.map((s, i) => {
          const active = i === sel;
          return (
            <button
              key={s.g}
              onClick={() => pick(i)}
              aria-pressed={active}
              className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-xl ring-1 transition ${
                active
                  ? "bg-brass/15 ring-brass"
                  : "bg-ink ring-rule hover:ring-bone-faint"
              }`}
            >
              {s.g}
            </button>
          );
        })}
      </div>

      {/* the shatter stage */}
      <div className="relative mt-5 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl bg-ink/60 p-6 ring-1 ring-rule grid-lines">
        <div className="flex items-baseline gap-2">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={glyph + burst}
              initial={{ scale: 1.35, opacity: 0, filter: "blur(8px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.5, opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-6xl leading-none text-bone sm:text-7xl"
            >
              {glyph}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="mt-2 font-mono text-[11px] text-bone-faint">
          {SHATTER_SPECIMENS[sel].kind} · {codePoints} char
          {codePoints === 1 ? "" : "s"} · {utf8Bytes(glyph)} bytes
        </div>

        {/* burst chips */}
        <div className="mt-5 flex min-h-[44px] flex-wrap items-center justify-center gap-1.5">
          <AnimatePresence mode="popLayout">
            {tokens.map((t) => (
              <motion.span
                layout
                key={t.key + burst}
                initial={{ scale: 0, y: 18, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 560, damping: 18 }}
                className="select-none rounded-md px-2 py-1.5 font-mono text-sm font-medium text-ink shadow"
                style={{ backgroundColor: colorForToken(t.text, t.id) }}
              >
                {t.text === " " ? "·" : t.text || "∅"}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-5 font-mono text-sm">
          <span className="text-2xl font-semibold tabular-nums text-brass">
            {count}
          </span>
          <span className="text-bone-dim"> token{count === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Specimen 2 — Space & case change everything                        */
/* ------------------------------------------------------------------ */

export function SpaceCaseCard({ ready }: { ready: boolean }) {
  const [word, setWord] = useState("strawberry");
  const [lead, setLead] = useState(false);
  const [cap, setCap] = useState(false);
  const [upper, setUpper] = useState(false);
  const [slice, setSlice] = useState(1);

  const text = useMemo(() => {
    let w = word.trim() || "strawberry";
    if (upper) w = w.toUpperCase();
    else if (cap) w = w.charAt(0).toUpperCase() + w.slice(1);
    return (lead ? " " : "") + w;
  }, [word, lead, cap, upper]);

  const tokens = useMemo(
    () => (ready ? tokenize(text, "o200k_base") : []),
    [text, ready, slice],
  );

  const toggle = (fn: () => void) => {
    fn();
    setSlice((s) => s + 1);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl bg-ink-2 p-5 ring-1 ring-rule sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">Space &amp; case matter</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
          sensitivity
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-bone-dim">
        A leading space and a capital letter change the token count. The space
        usually glues onto the next word.
      </p>

      <input
        value={word}
        onChange={(e) => {
          setWord(e.target.value);
          setSlice((s) => s + 1);
        }}
        spellCheck={false}
        aria-label="Word to tokenize"
        className="mt-4 w-full rounded-lg bg-ink px-3 py-2 font-mono text-base text-bone ring-1 ring-rule focus:ring-brass"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <Toggle on={lead} onClick={() => toggle(() => setLead((v) => !v))}>
          leading space
        </Toggle>
        <Toggle on={cap} onClick={() => toggle(() => setCap((v) => !v))}>
          Capitalize
        </Toggle>
        <Toggle on={upper} onClick={() => toggle(() => setUpper((v) => !v))}>
          UPPERCASE
        </Toggle>
      </div>

      <div className="mt-5 flex flex-1 items-center overflow-hidden rounded-xl bg-ink/50 p-4 ring-1 ring-rule">
        <ChipStrip tokens={tokens} sliceSignal={slice} size="lg" />
      </div>

      <div className="mt-4 font-mono text-sm text-bone-dim">
        <span className="text-2xl font-semibold tabular-nums text-brass">
          {tokens.length}
        </span>{" "}
        tokens for “<span className="text-bone">{text.replace(/ /g, "·")}</span>”
      </div>
    </div>
  );
}

function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] ring-1 transition ${
        on ? "bg-brass text-ink ring-brass" : "bg-ink text-bone-dim ring-rule hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Specimen 3 — Frequency: familiar is cheap, rare is expensive        */
/* ------------------------------------------------------------------ */

const FREQ_ROWS = [
  { text: "because", note: "common English word" },
  { text: "antidisestablishmentarianism", note: "long but real" },
  { text: "認識", note: "Japanese" },
  { text: "ㅋㅋㅋ", note: "Korean laughter" },
];

export function FrequencyCard({ ready }: { ready: boolean }) {
  return (
    <div className="rounded-2xl bg-ink-2 p-5 ring-1 ring-rule sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">Familiar is cheap</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
          frequency
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-bone-dim">
        BPE merges the most common byte pairs first. Patterns a model saw often
        collapse into a single token; rare or foreign ones shatter.
      </p>

      <div className="mt-5 space-y-3">
        {FREQ_ROWS.map((row) => {
          const toks = ready ? tokenize(row.text, "o200k_base") : [];
          return (
            <div
              key={row.text}
              className="rounded-xl bg-ink/50 p-3 ring-1 ring-rule"
            >
              <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-bone-faint">
                <span>{row.note}</span>
                <span className="tabular-nums text-bone-dim">{toks.length} tokens</span>
              </div>
              {ready ? (
                <ChipStrip tokens={toks} size="md" showId={false} />
              ) : (
                <div className="flex h-8 items-center gap-2">
                  <span className="h-6 w-12 rounded shimmer" />
                  <span className="h-6 w-10 rounded shimmer" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

export function Specimens({ ready }: { ready: boolean }) {
  return (
    <section
      id="specimens"
      className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:py-28"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Specimens — the quirks"
          title="The strange edges of tokenization."
          lede="Most of the time it looks like words. The interesting cases are where it doesn't — where one character explodes, a space doubles the count, or a foreign script comes apart."
        />
      </Reveal>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <ShatterCard ready={ready} />
        </Reveal>
        <Reveal delay={0.05}>
          <SpaceCaseCard ready={ready} />
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-2">
          <FrequencyCard ready={ready} />
        </Reveal>
      </div>
    </section>
  );
}
