// ============================================================================
// tokenizer.ts
// A thin wrapper around the real `gpt-tokenizer` BPE encoders so the demo shows
// genuine OpenAI token boundaries and token ids — not a heuristic.
//
// Two encodings are loaded lazily (the rank tables are large):
//   - o200k_base  → used by GPT-4o, GPT-4.1, o-series  (the "modern" tokenizer)
//   - cl100k_base → used by GPT-4 / GPT-3.5            (the previous tokenizer)
// Showing both is what makes the "conflict" section real.
// ============================================================================

export type EncodingId = "o200k_base" | "cl100k_base";

export interface TokenPiece {
  /** stable position key for animation */
  key: string;
  /** the token id reported by the encoder */
  id: number;
  /** the decoded text for this single token (may include a leading space) */
  text: string;
}

export interface EncodingMeta {
  id: EncodingId;
  label: string;
  blurb: string;
  /** approximate number of tokens in the vocabulary */
  vocab: string;
}

export const ENCODINGS: Record<EncodingId, EncodingMeta> = {
  o200k_base: {
    id: "o200k_base",
    label: "o200k_base",
    blurb: "GPT-4o · GPT-4.1 · o-series",
    vocab: "~200k",
  },
  cl100k_base: {
    id: "cl100k_base",
    label: "cl100k_base",
    blurb: "GPT-4 · GPT-3.5",
    vocab: "~100k",
  },
};

type Encoder = {
  encode: (text: string) => number[];
  decode: (ids: number[]) => string;
};

const cache: Partial<Record<EncodingId, Encoder>> = {};

let loader: Promise<void> | null = null;

/** Load both encoders once. Safe to call repeatedly. */
export function warmup(): Promise<void> {
  if (loader) return loader;
  loader = (async () => {
    const [modern, legacy] = await Promise.all([
      import("gpt-tokenizer"),
      import("gpt-tokenizer/encoding/cl100k_base"),
    ]);
    cache.o200k_base = {
      encode: (t: string) => modern.encode(t),
      decode: (ids: number[]) => modern.decode(ids),
    };
    cache.cl100k_base = {
      encode: (t: string) => (legacy as { encode: (t: string) => number[] }).encode(t),
      decode: (ids: number[]) =>
        (legacy as { decode: (ids: number[]) => string }).decode(ids),
    };
  })();
  return loader;
}

export function isReady(): boolean {
  return Boolean(cache.o200k_base && cache.cl100k_base);
}

/**
 * Tokenize text with a real encoder. Returns pieces whose `text` is decoded
 * one token at a time, so leading spaces and fragments are visible.
 */
export function tokenize(text: string, id: EncodingId): TokenPiece[] {
  const enc = cache[id];
  if (!enc) return [];
  const safe = text.slice(0, 4000);
  const ids = enc.encode(safe);
  return ids.map((tok, i) => ({
    key: `${i}:${tok}`,
    id: tok,
    text: renderTokenText(enc.decode([tok])),
  }));
}

/** Fast count without materialising the chip data. */
export function countTokens(text: string, id: EncodingId): number {
  const enc = cache[id];
  if (!enc) return 0;
  return enc.encode(text.slice(0, 4000)).length;
}

// Spaces matter in tokenization, so we make the invisible visible: a leading or
// interior space is drawn as a faint mid-dot inside its chip.
function renderTokenText(decoded: string): string {
  if (!decoded) return "";
  return decoded;
}

// --- colouring --------------------------------------------------------------
// The same token text always maps to the same colour, so repetition reads as
// repetition — the single most useful cue for understanding subword merging.
const PALETTE = [
  "var(--color-tok-0)",
  "var(--color-tok-1)",
  "var(--color-tok-2)",
  "var(--color-tok-3)",
  "var(--color-tok-4)",
  "var(--color-tok-5)",
  "var(--color-tok-6)",
  "var(--color-tok-7)",
];

export function colorForToken(text: string, id: number): string {
  let h = 2166136261 ^ id;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  }
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return PALETTE[(h >>> 0) % PALETTE.length];
}

/** rough byte length of a string in UTF-8 — used for the "shatter" framing */
export function utf8Bytes(text: string): number {
  return new TextEncoder().encode(text).length;
}
