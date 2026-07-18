import { useEffect, useState } from "react";
import { MotionConfig, motion } from "motion/react";
import { Playground } from "./components/Playground";
import { Conflict } from "./components/Conflict";
import { Specimens } from "./components/Specimens";
import { Reveal } from "./components/ui";
import { isReady, warmup } from "./lib/tokenizer";

export default function App() {
  const [ready, setReady] = useState(isReady());

  useEffect(() => {
    let mounted = true;
    warmup().then(() => mounted && setReady(true));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-vat min-h-screen">
        <Masthead />
        <Hero ready={ready} />
        <HowItWorks />
        <Conflict ready={ready} />
        <Specimens ready={ready} />
        <SiteFooter />
      </div>
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/*  Masthead                                                           */
/* ------------------------------------------------------------------ */

function Masthead() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-lg font-semibold tracking-tight">
            Tokenbench
          </span>
          <span className="hidden font-mono text-[11px] text-bone-faint sm:inline">
            / field guide
          </span>
        </a>
        <nav className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em]">
          <a className="rounded px-2.5 py-1.5 text-bone-dim transition hover:text-bone" href="#how">
            How
          </a>
          <a
            className="rounded px-2.5 py-1.5 text-bone-dim transition hover:text-bone"
            href="#conflict"
          >
            Conflict
          </a>
          <a
            className="rounded px-2.5 py-1.5 text-bone-dim transition hover:text-bone"
            href="#specimens"
          >
            Specimens
          </a>
        </nav>
      </div>
    </header>
  );
}

function LogoMark() {
  // a word being sliced into three coloured tiles
  return (
    <span className="flex items-center gap-[2px]" aria-hidden>
      <span className="h-4 w-2.5 rounded-[3px] bg-tok-3" />
      <span className="h-4 w-3.5 rounded-[3px] bg-tok-1" />
      <span className="h-4 w-2 rounded-[3px] bg-tok-6" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero — the playground is the thesis                                */
/* ------------------------------------------------------------------ */

const DRIFTERS = ["</w>", "▁", "ing", "##", "tok", "481", "GPT", "▁the"];

function Hero({ ready }: { ready: boolean }) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* ambient drifting fragments */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {DRIFTERS.map((d, i) => (
          <span
            key={d + i}
            className="drift absolute font-mono text-bone/[0.05] select-none"
            style={{
              left: `${[8, 22, 70, 84, 40, 60, 14, 90][i]}%`,
              top: `${[18, 60, 30, 70, 12, 80, 45, 8][i]}%`,
              fontSize: `${[44, 28, 60, 36, 24, 40, 30, 22][i]}px`,
              animationDelay: `${i * 1.3}s`,
            }}
          >
            {d}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-10 pt-16 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-faint">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
            A field guide to tokenization
          </span>
          <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[0.98] tracking-tight text-balance sm:text-6xl md:text-7xl">
            Every word a model reads
            <br className="hidden sm:block" /> gets{" "}
            <span className="relative whitespace-nowrap text-brass">
              cut into tokens
              <CutUnderline />
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-dim">
            Before a language model reasons, it slices your sentence into numbered
            fragments called <span className="text-bone">tokens</span> — the atoms it
            actually sees. Type below and watch the cuts happen for real, using the
            same tokenizer GPT-4o uses.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <Playground ready={ready} />
        </motion.div>

        <p className="mt-3 text-center font-mono text-[11px] text-bone-faint">
          {ready
            ? "Live · powered by gpt-tokenizer (real BPE, not a guess)"
            : "Loading the tokenizer vocabulary…"}
        </p>
      </div>
    </section>
  );
}

function CutUnderline() {
  return (
    <svg
      className="absolute -bottom-1 left-0 h-2 w-full text-brass/60"
      viewBox="0 0 300 8"
      preserveAspectRatio="none"
      aria-hidden
    >
      <motion.path
        d="M2 5 C 70 1, 150 7, 298 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  How it works — a real, ordered process (so numbering is honest)    */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    n: "01",
    title: "Carve into chunks",
    body: "The text is first split by a regex into word-ish pieces — runs of letters, numbers, spaces, and punctuation each become their own chunk.",
    glyph: "un·believ·able",
  },
  {
    n: "02",
    title: "Map to raw bytes",
    body: "Each chunk is turned into its UTF-8 bytes. Every emoji, accent, and script ends up as a sequence of numbers from 0 to 255.",
    glyph: "→ [240,159,…]",
  },
  {
    n: "03",
    title: "Merge frequent pairs",
    body: "Again and again, the most common adjacent byte pair is merged into one unit. The pieces left when merging stops are the tokens.",
    glyph: "th + e → the",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-faint">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
              The process
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-4xl">
              Byte Pair Encoding, in three honest steps.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-bone-dim">
              Almost every modern model tokenizes the same way. Once you see the
              steps, the quirks stop being surprising.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl bg-ink-2 p-6 ring-1 ring-rule">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-semibold text-brass/90">
                    {s.n}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
                    step
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-bone-dim">
                  {s.body}
                </p>
                <div className="mt-4 rounded-lg bg-ink px-3 py-2 font-mono text-xs text-bone ring-1 ring-rule">
                  {s.glyph}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-display text-lg font-semibold tracking-tight">
                Tokenbench
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-bone-dim">
              An interactive field guide to tokenization. Every split, id, and count
              here is computed with the real{" "}
              <a
                href="https://github.com/niieani/gpt-tokenizer"
                target="_blank"
                rel="noreferrer"
                className="text-brass underline-offset-2 hover:underline"
              >
                gpt-tokenizer
              </a>{" "}
              — a JavaScript port of OpenAI&apos;s tiktoken.
            </p>
          </div>
          <p className="font-mono text-[11px] leading-relaxed text-bone-faint">
            o200k_base · cl100k_base
            <br />
            built for the curious
          </p>
        </div>
      </div>
    </footer>
  );
}
