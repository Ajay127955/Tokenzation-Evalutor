import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChipStrip } from "./Chips";
import { Stat } from "./ui";
import {
  ENCODINGS,
  type EncodingId,
  countTokens,
  tokenize,
  utf8Bytes,
} from "../lib/tokenizer";

const PRESETS: { label: string; text: string }[] = [
  { label: "Plain English", text: "Tokenization is how a model turns text into numbers." },
  { label: "Rare words", text: "The qwjibbling smorpel frobbed the zonk." },
  { label: "Code", text: "const sum = (a, b) => a + b;" },
  { label: "Emoji", text: "🎉🦄✨ party time!" },
  { label: "Multilingual", text: "Bonjour 世界 🌍" },
];

export function Playground({ ready }: { ready: boolean }) {
  const [text, setText] = useState(PRESETS[0].text);
  const [encoding, setEncoding] = useState<EncodingId>("o200k_base");
  const [slice, setSlice] = useState(1);

  const tokens = useMemo(
    () => (ready ? tokenize(text, encoding) : []),
    [text, encoding, ready],
  );
  const tokenCount = ready ? tokens.length : 0;

  const reSlice = () => setSlice((s) => s + 1);
  const loadPreset = (t: string) => {
    setText(t);
    reSlice();
  };
  const switchEncoding = (id: EncodingId) => {
    setEncoding(id);
    reSlice();
  };

  return (
    <div className="rounded-2xl bg-ink-2 p-4 ring-1 ring-rule sm:p-6">
      {/* control row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brass" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone-dim">
            Live tokenizer
          </span>
        </div>

        <EncodingSwitch encoding={encoding} onChange={switchEncoding} />
      </div>

      {/* input */}
      <div className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          aria-label="Text to tokenize"
          className="h-24 w-full resize-none rounded-xl bg-ink p-4 font-mono text-base leading-relaxed text-bone ring-1 ring-rule transition placeholder:text-bone-faint focus:ring-brass sm:h-28 sm:text-lg"
          placeholder="Type or paste anything…"
        />
      </div>

      {/* presets */}
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const active = text === p.text;
          return (
            <button
              key={p.label}
              onClick={() => loadPreset(p.text)}
              className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ring-1 transition ${
                active
                  ? "bg-brass text-ink ring-brass"
                  : "bg-ink text-bone-dim ring-rule hover:text-bone hover:ring-bone-faint"
              }`}
            >
              {p.label}
            </button>
          );
        })}
        <button
          onClick={reSlice}
          aria-label="Re-slice the text"
          className="ml-auto rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-bone-faint ring-1 ring-rule transition hover:text-bone hover:ring-bone-faint"
        >
          ↻ re-slice
        </button>
      </div>

      {/* the chip stage */}
      <div className="relative mt-5 min-h-[120px] overflow-hidden rounded-xl bg-ink/60 p-4 ring-1 ring-rule grid-lines sm:p-5">
        {ready ? (
          <ChipStrip tokens={tokens} sliceSignal={slice} size="lg" />
        ) : (
          <div className="flex h-[88px] items-center gap-2">
            <span className="h-9 w-24 rounded-lg shimmer" />
            <span className="h-9 w-12 rounded-lg shimmer" />
            <span className="h-9 w-32 rounded-lg shimmer" />
            <span className="h-9 w-16 rounded-lg shimmer" />
          </div>
        )}
      </div>

      {/* measurements */}
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-rule pt-5 sm:grid-cols-4">
        <Stat value={tokenCount} label="Tokens" accent />
        <Stat value={text.length} label="Characters" />
        <Stat value={utf8Bytes(text)} label="UTF-8 bytes" />
        <Stat
          value={tokenCount ? (text.length / tokenCount).toFixed(1) : "—"}
          label="Chars / token"
        />
      </div>

      <p className="mt-4 font-mono text-[11px] leading-relaxed text-bone-faint">
        {ENCODINGS[encoding].label} · {ENCODINGS[encoding].blurb} · hover a tile
        to read its token id.
      </p>
    </div>
  );
}

function EncodingSwitch({
  encoding,
  onChange,
}: {
  encoding: EncodingId;
  onChange: (id: EncodingId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Tokenizer encoding"
      className="relative flex rounded-full bg-ink p-1 ring-1 ring-rule"
    >
      {(Object.keys(ENCODINGS) as EncodingId[]).map((id) => {
        const active = encoding === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className="relative rounded-full px-3 py-1.5 font-mono text-[11px] tracking-tight"
          >
            {active && (
              <motion.span
                layoutId="encoding-pill"
                className="absolute inset-0 rounded-full bg-ink-3 ring-1 ring-ink-4"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 ${active ? "text-bone" : "text-bone-faint"}`}
            >
              {ENCODINGS[id].label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// re-exported for the quick counter in the hero stats
export function quickCount(text: string, encoding: EncodingId): number {
  return countTokens(text, encoding);
}
