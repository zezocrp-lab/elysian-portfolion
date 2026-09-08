/**
 * Rebuilds public/og.png — the 1200x630 card shown when the site is shared on
 * WhatsApp, LinkedIn, X, Slack. Re-run it whenever the hero copy changes, since
 * HEADLINE below is quoted from it.
 *
 *   npm i -D opentype.js sharp
 *   node scripts/make-og.mjs
 *
 * The two packages are deliberately not kept in package.json: they are only
 * needed to regenerate this one file, and sharp is a large native dependency
 * to carry around for something that changes twice a year.
 */
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const W = 1200;
const H = 630;

/* An ancient UA is what makes the API answer with ttf, which opentype reads;
   the woff2 files in public/fonts are compressed and it cannot. */
const UA = "Mozilla/4.0";
const TTF = {
  display:
    "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_qE6KnTOjw.ttf",
  body: "https://fonts.gstatic.com/s/jost/v20/92zPtBhPNqw79Ij1E865zBUv7mz9JTVBNI0.ttf",
};

async function loadFont(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`font fetch: HTTP ${res.status}`);
  return opentype.parse(await res.arrayBuffer());
}

const display = await loadFont(TTF.display);
const body = await loadFont(TTF.body);

/**
 * Text is baked to outlines rather than left as <text>, so rasterising never
 * depends on which fonts happen to be installed on the machine doing it.
 * opentype's getPath handles kerning; the tracked variant places each glyph
 * itself, which is what the letterspaced labels need.
 */
const outline = (font, text, x, y, size) => font.getPath(text, x, y, size).toPathData(2);

function tracked(font, text, x, y, size, tracking) {
  const scale = size / font.unitsPerEm;
  let cursor = x;
  const parts = [];
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    parts.push(glyph.getPath(cursor, y, size).toPathData(2));
    cursor += glyph.advanceWidth * scale + tracking;
  }
  return parts.join(" ");
}

// The mark, taken from the component so the card cannot drift from the site.
const markPaths = [
  ...readFileSync(`${ROOT}/Mark.tsx`, "utf8").matchAll(/<path d="([^"]+)"\s*\/>/g),
].map((m) => m[1]);
if (markPaths.length !== 4) throw new Error(`expected 4 mark paths, found ${markPaths.length}`);

/* Sit the whole mark inside the frame with margin to spare. The hero bleeds it
   off the edge, but preview cards get re-cropped by every platform that shows
   them, so anything touching an edge here reads as damage rather than design. */
const MARK_H = 520;
const markScale = MARK_H / 1491;
const markW = 1299 * markScale;
const markX = 1150 - markW;
const markY = (H - MARK_H) / 2;

// Quoted from the hero in content.ts, so the card and the page agree.
const HEADLINE = ["Websites built", "with the same care", "as the work inside."];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F7E6AE"/>
      <stop offset="38%" stop-color="#D8AE52"/>
      <stop offset="70%" stop-color="#C08D24"/>
      <stop offset="100%" stop-color="#8A6218"/>
    </linearGradient>
    <radialGradient id="aureole" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#C9962E" stop-opacity="0.26"/>
      <stop offset="35%" stop-color="#C9962E" stop-opacity="0.10"/>
      <stop offset="68%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#000000"/>
  <circle cx="${(markX + markW / 2).toFixed(1)}" cy="${H / 2}" r="400" fill="url(#aureole)"/>

  <g transform="translate(${markX.toFixed(1)}, ${markY.toFixed(1)}) scale(${markScale.toFixed(5)})" opacity="0.92">
    <g transform="translate(0,1491) scale(0.1,-0.1)" fill="url(#gold)" stroke="none">
${markPaths.map((d) => `      <path d="${d}"/>`).join("\n")}
    </g>
  </g>

  <path d="${tracked(body, "ELYSIAN", 92, 232, 23, 9.2)}" fill="#C9962E"/>

${HEADLINE.map((line, i) => `  <path d="${outline(display, line, 88, 320 + i * 74, 68)}" fill="#EDE7DA"/>`).join("\n")}

  <rect x="92" y="524" width="54" height="1" fill="#C9962E" opacity="0.55"/>
  <path d="${tracked(body, "CAIRO", 92, 566, 15, 6)}" fill="#8B8272"/>
</svg>
`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(`${ROOT}/public/og.png`);
console.log(`wrote public/og.png — ${W}x${H}, ${(statSync(`${ROOT}/public/og.png`).size / 1024).toFixed(0)} KB`);
