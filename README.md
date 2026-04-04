# lite-matter

**The Minimalist, Zero-Bloat YAML Frontmatter Extractor for Modern JavaScript.**

`lite-matter` is a high-performance, single-pass frontmatter extraction engine. It provides the same metadata isolation interface as legacy libraries like `gray-matter` without the inclusion of heavy, non-standard dependencies or legacy string-handling wrappers.

## Technical Specifications

- **Runtime**: Node.js (ESM), Browser (Modern), Deno, Cloudflare Workers.
- **Language**: Core logic written in modern TypeScript.
- **Dependency**: Powered by the modern `yaml` parser for spec-compliant parsing.
- **Distribution**: Pure ES Module (ESM).

## The Problem: The Legacy Complexity Gap

Legacy libraries like `gray-matter` were built for an older era of the JavaScript ecosystem. They often include complex, non-standard frontmatter support (e.g., CoffeeScript, TOML, and CSV delimiters) and heavy string-processing logic that increases CPU and bundle overhead in modern static site generators and CMS engines.

`lite-matter` is a modern, laser-focused alternative. It is built strictly for the **standard triple-dash YAML frontmatter format** (the industry-standard across Markdown, GitHub, and major CMS architectures).

### Technical Limitations & Design Scope

To maintain its minimalism, `lite-matter` purposely restricts its feature set:

1.  **Format Restriction**: Strictly supports YAML triple-dash (`---`) frontmatter. It does not support TOML (`+++`), CoffeeScript, or other legacy metadata formats found in `gray-matter`.
2.  **No Delimiter Customization**: Delimiters are hardcoded to the industry-standard `---` to optimize regex isolation performance.
3.  **Strict ESM**: Built specifically for modern ESM toolchains.
4.  **No In-memory Cache**: For consistency, `lite-matter` performs a fresh parse on every invocation. If high-frequency parsing of the same file is required, results should be cached at the application layer.

*   **Optimal Performance**: Uses a pinpoint regex scan to isolate the YAML block, passing it directly to the performance-optimized `yaml` library.
*   **Reduced Footprint**: Does not bundle unnecessary non-standard parsers for legacy formats.
*   **Secure & Robust**: Provides safe, fault-tolerant YAML parsing with clean error handling and graceful fallbacks.
*   **Modern Support**: Written in TypeScript and exported as native ESM for a superior developer experience in modern toolchains.
*   **Exact Drop-In Compatibility**: Supports the identical `matter(content)` API expected by millions of developers.

## Installation

```bash
npm install lite-matter
```

## Quick Start

```javascript
import matter from 'lite-matter';

const markdown = `---
title: Understanding lite-matter
date: 2026-04-04
status: draft
---
# Content Start
This is the body of the markdown file.`;

const { data, content } = matter(markdown);

console.log(data);
// Output: { title: "Understanding lite-matter", date: "2026-04-04", status: "draft" }

console.log(content.trim());
// Output: "# Content Start\nThis is the body of the markdown file."
```

## Comparisons

| Feature | gray-matter | lite-matter |
| :--- | :--- | :--- |
| **Logic** | Multi-parser | **Pinpoint YAML** |
| **Parsing** | Bulky strings | **Single-pass scan** |
| **Standard** | Triple-dash (+++, TOML, etc.) | **Standard Triple-dash YAML** |
| **Weight (approx)**| ~100KB+ | **<1KB logic** |

## API Reference

### `matter(str)`

**Arguments:**
- `str` (string): The raw source string incorporating the frontmatter block.

**Returns:**
- `data` (object): A parsed JavaScript object from the YAML block.
- `content` (string): The remaining source string (stripped of frontmatter).

## License

MIT - Developed under the docmd ecosystem by [Ghazi](https://mgks.dev).