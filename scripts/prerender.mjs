/**
 * Turns the built SPA into two real HTML pages — English at /, Arabic at /ar/ —
 * each carrying its own copy in the markup rather than an empty <div id="root">.
 *
 * Runs automatically after `vite build`. Without it a crawler that does not
 * execute JavaScript sees nothing, and the Arabic page does not exist at all.
 *
 *   node scripts/prerender.mjs
 */
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import { render } from "preact-render-to-string";
import { h } from "preact";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = `${ROOT}/dist`;
const BUNDLE = `${ROOT}/_prerender-bundle.mjs`;

const PAGES = [
  { lang: "en", dir: "ltr", path: "/", locale: "en_US", out: `${DIST}/index.html` },
  { lang: "ar", dir: "rtl", path: "/ar/", locale: "ar_EG", out: `${DIST}/ar/index.html` },
];

await build({
  stdin: {
    contents: `export { default as App } from "./App"; export { SITE } from "./config";`,
    resolveDir: ROOT,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  jsx: "automatic",
  jsxImportSource: "preact",
  alias: { react: "preact/compat", "react-dom": "preact/compat" },
  external: ["preact", "preact/*"],
  outfile: BUNDLE,
  logLevel: "error",
});

/* App reads the language out of location, so setting one is all it takes to
   render a given page — the same code path the browser takes. */
const location = { pathname: "/", hash: "", search: "" };
globalThis.window = { location, history: { pushState() {}, replaceState() {} } };

const { App, SITE } = await import(pathToFileURL(BUNDLE).href);

const template = readFileSync(`${DIST}/index.html`, "utf8");
if (!template.includes('<div id="root"></div>')) {
  throw new Error("dist/index.html has no empty #root to fill — did vite build run?");
}

/* Absolute URLs need the origin. Without it, emit only the tags that still mean
   something relative, rather than shipping ones search engines will discard. */
const base = SITE.url.replace(/\/+$/, "");
const abs = (path) => (base ? base + path : path);

for (const page of PAGES) {
  location.pathname = page.path;

  const body = render(h(App, {}));
  if (!body.includes("</section>")) throw new Error(`${page.lang}: render produced no sections`);

  const other = PAGES.find((p) => p.lang !== page.lang);
  const tags = [
    `<meta property="og:locale" content="${page.locale}" />`,
    `<meta property="og:locale:alternate" content="${other.locale}" />`,
    `<meta property="og:image" content="${abs("/og.png")}" />`,
    `<meta name="twitter:image" content="${abs("/og.png")}" />`,
    ...(base
      ? [
          `<link rel="canonical" href="${abs(page.path)}" />`,
          `<meta property="og:url" content="${abs(page.path)}" />`,
          ...PAGES.map((p) => `<link rel="alternate" hreflang="${p.lang}" href="${abs(p.path)}" />`),
          `<link rel="alternate" hreflang="x-default" href="${abs("/")}" />`,
        ]
      : []),
  ];

  const html = template
    .replace('<html lang="en">', `<html lang="${page.lang}" dir="${page.dir}">`)
    .replace("</head>", `  ${tags.join("\n    ")}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  mkdirSync(dirname(page.out), { recursive: true });
  writeFileSync(page.out, html, "utf8");

  console.log(`${page.path.padEnd(5)} → ${page.out.replace(ROOT + "/", "")}  ${(html.length / 1024).toFixed(0)} KB`);
}

if (!base) {
  console.log("\nSITE.url is empty — canonical, og:url and hreflang were skipped.");
  console.log("Set it in config.ts once the domain is live and rebuild.");
}

unlinkSync(BUNDLE);
