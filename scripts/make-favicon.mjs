/**
 * Rebuilds public/favicon.svg from the brand mark in Mark.tsx, so the tab icon
 * can never drift from the mark used on the page.
 *
 *   node scripts/make-favicon.mjs
 *
 * No dependencies.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(`${ROOT}/Mark.tsx`, "utf8");

// Two feathers plus the two lights held at the centre.
const paths = [...src.matchAll(/<path d="([^"]+)"\s*\/>/g)].map((m) => m[1]);
if (paths.length !== 4) throw new Error(`expected 4 paths in Mark.tsx, found ${paths.length}`);

// Mark.tsx draws in a 1299x1491 box; centre that in a square so browsers that
// assume a 1:1 icon do not squash it.
const W = 1299;
const H = 1491;
const pad = (H - W) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} 0 ${H} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F7E6AE"/>
      <stop offset="38%" stop-color="#D8AE52"/>
      <stop offset="70%" stop-color="#C08D24"/>
      <stop offset="100%" stop-color="#8A6218"/>
    </linearGradient>
  </defs>
  <rect x="${-pad}" y="0" width="${H}" height="${H}" fill="#000000"/>
  <g transform="translate(0,${H}) scale(0.1,-0.1)" fill="url(#g)" stroke="none">
${paths.map((d) => `    <path d="${d}"/>`).join("\n")}
  </g>
</svg>
`;

writeFileSync(`${ROOT}/public/favicon.svg`, svg, "utf8");
console.log(`wrote public/favicon.svg — ${paths.length} paths, ${(svg.length / 1024).toFixed(1)} KB`);
