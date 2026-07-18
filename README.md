<![CDATA[<div align="center">

# 🔤 Tokenbench

### A field guide to how language models read

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Tokenbench-brass?style=for-the-badge&labelColor=1a1a1a&color=c8a55a)](https://019f73a2-7f67-7326-a78f-f3c632305e91.arena.site/)
[![Built with React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> *Before a language model reasons, it slices your sentence into numbered fragments called **tokens** — the atoms it actually sees.*

</div>

---

## ✨ What is Tokenbench?

**Tokenbench** is an interactive, educational web application that visualizes how large language models (LLMs) tokenize text using **Byte Pair Encoding (BPE)**. It uses the same tokenizer that powers GPT-4o — running entirely in your browser with zero API calls.

Type any text and instantly see:
- How it gets split into tokens
- The numeric token IDs assigned to each fragment
- How different models tokenize the same text differently
- Surprising edge cases in tokenization

## 🖼️ Live Demo

🔗 **[Try Tokenbench Live →](https://019f73a2-7f67-7326-a78f-f3c632305e91.arena.site/)**

---

## 🎯 Key Features

### 🧪 Interactive Playground
Type any text and watch it get tokenized in real-time. See the token count, character count, and compression ratio (characters per token) update live.

### ⚔️ Conflict Comparison
Compare how the **same text** is tokenized differently by two major encodings:
- **`o200k_base`** — Used by GPT-4o, GPT-4o-mini
- **`cl100k_base`** — Used by GPT-3.5 Turbo, GPT-4

See side-by-side token splits with color-coded chips.

### 🔬 Specimen Gallery
A curated collection of ~25 fascinating tokenization cases across categories:
- **Emoji** — Flag emoji, skin tones, ZWJ sequences
- **Multilingual** — CJK characters, Arabic, Devanagari
- **Code** — Programming syntax, whitespace sensitivity
- **Edge Cases** — Repeated characters, special symbols
- **Numbers** — How models handle numeric strings

Each specimen includes annotations explaining *why* the tokenization is noteworthy.

### 🎨 Premium Design
- Dark editorial aesthetic with custom color palette
- Smooth scroll-triggered animations (Framer Motion)
- Custom typography (Bricolage Grotesque, Hanken Grotesk, JetBrains Mono)
- Animated token chips with layout transitions

---

## 🏗️ Architecture

```
src/
├── App.tsx                  # Main app: Masthead, Hero, HowItWorks, Footer
├── main.tsx                 # React entry point
├── index.css                # Global styles, Tailwind v4 theme, custom properties
├── components/
│   ├── Chips.tsx            # Token chip & chip row components
│   ├── Conflict.tsx         # Side-by-side encoding comparison
│   ├── Playground.tsx       # Interactive tokenization playground
│   ├── Specimens.tsx        # Curated tokenization specimen gallery
│   └── ui.tsx               # Shared UI primitives (Reveal animation)
├── lib/
│   └── tokenizer.ts         # Tokenizer abstraction (gpt-tokenizer wrapper)
└── utils/
    └── cn.ts                # Tailwind class merging utility (clsx + tailwind-merge)
```

### How It Works

1. **No API calls** — The `gpt-tokenizer` library runs BPE tokenization entirely in the browser
2. **Dual encoding support** — Switches between `o200k_base` and `cl100k_base` encodings
3. **Single-file build** — `vite-plugin-singlefile` bundles everything into one HTML file for easy deployment
4. **Warm-up phase** — Tokenizer vocabularies are preloaded on app mount for instant responses

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19.2 |
| **Language** | TypeScript 5.9 |
| **Build Tool** | Vite 7.3 |
| **Styling** | Tailwind CSS 4.1 |
| **Animations** | Framer Motion (motion/react) |
| **Tokenizer** | [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) — JavaScript port of OpenAI's tiktoken |
| **Deployment** | Single HTML file (vite-plugin-singlefile) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Ajay127955/Tokenzation-Evalutor.git
cd Tokenzation-Evalutor

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

This generates a single self-contained HTML file in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📖 The Tokenization Process (BPE)

Tokenbench teaches the three core steps of Byte Pair Encoding:

| Step | Name | Description |
|------|------|-------------|
| **01** | Carve into chunks | Text is split by regex into word-like pieces — runs of letters, numbers, spaces, and punctuation |
| **02** | Map to raw bytes | Each chunk is converted to its UTF-8 bytes (0–255) |
| **03** | Merge frequent pairs | The most common adjacent byte pair is repeatedly merged until no more merges are possible — the remaining pieces are your tokens |

---

## 🎨 Design System

The app uses a carefully crafted dark theme with custom CSS properties:

- **Ink** (`#141414`) — Primary background
- **Bone** (`#e8e2d6`) — Primary text
- **Brass** (`#c8a55a`) — Accent/highlight color
- **10 Token Colors** — A vibrant palette for color-coding individual tokens

Typography features three Google Fonts:
- **Bricolage Grotesque** — Display headings
- **Hanken Grotesk** — Body text
- **JetBrains Mono** — Code and technical elements

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for license details.

---

<div align="center">

**[🌐 Live Demo](https://019f73a2-7f67-7326-a78f-f3c632305e91.arena.site/)** · **[⭐ Star this repo](https://github.com/Ajay127955/Tokenzation-Evalutor)**

*Built for the curious* · `o200k_base · cl100k_base`

</div>
]]>
