/**
 * Mounts the real App in jsdom and drives it: language switching, history,
 * form validation, the mail-app handoff, the mobile menu, and hydration of the
 * prerendered Arabic page.
 *
 *   npm run smoke
 *
 * Three things this site does fail at runtime rather than at build time —
 * preact/compat aliasing, prerendering, and hydration — and a green build says
 * nothing about any of them. Run it after touching App.tsx, lang.ts, the
 * aliases in vite.config.ts, or scripts/prerender.mjs.
 *
 * The hydration section needs `npm run build` to have run first; it skips
 * itself otherwise.
 */
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import { JSDOM } from "jsdom";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = `${ROOT}/_smoke-bundle.mjs`;

/* preact stays external so the bundle and this script share one instance —
   otherwise act() would flush a different copy's effect queue. */
await build({
  stdin: { contents: `export { default } from "./App";`, resolveDir: ROOT, loader: "ts" },
  bundle: true,
  format: "esm",
  platform: "node",
  jsx: "automatic",
  jsxImportSource: "preact",
  alias: { react: "preact/compat", "react-dom": "preact/compat" },
  external: ["preact", "preact/*"],
  outfile: OUT,
  logLevel: "error",
});

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "https://elysian.test/",
  pretendToBeVisual: true,
});

for (const key of ["window", "document", "navigator", "localStorage", "history", "HTMLElement", "Event"]) {
  Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true, writable: true });
}
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);

const { render } = await import("preact");
const { act } = await import("preact/test-utils");
const { default: App } = await import(pathToFileURL(OUT).href);
const { h } = await import("preact");

const root = document.getElementById("root");
let failures = 0;
const check = (label, pass, extra = "") => {
  if (!pass) failures++;
  console.log(`  ${pass ? "pass" : "FAIL"}  ${label}${extra ? `  ${extra}` : ""}`);
};

const text = () => root.textContent;
const byLabel = (l) => root.querySelector(`[aria-label="${l}"]`);
const set = (id, value) => {
  const el = document.getElementById(id);
  el.value = value;
  el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
};

await act(async () => render(h(App, {}), root));

console.log("first render");
check("English hero renders", text().includes("Websites built"));
check("skip link present", text().includes("Skip to content"));
check("empty state, not project cards", text().includes("The first projects are being prepared"));
check("no leftover placeholder cards", root.querySelectorAll("article").length === 0);
check("form fields mounted", ["name", "email", "phone", "message"].every((id) => document.getElementById(id)));
check("html lang set by effect", document.documentElement.lang === "en", `→ "${document.documentElement.lang}"`);
check("html dir set by effect", document.documentElement.dir === "ltr", `→ "${document.documentElement.dir}"`);

console.log("\nlanguage switch");
await act(async () => byLabel("Switch to Arabic").click());
check("Arabic copy swapped in", text().includes("مواقع مبنية"));
check("English copy gone", !text().includes("Websites built"));
check("dir flipped to rtl", document.documentElement.dir === "rtl", `→ "${document.documentElement.dir}"`);
check("lang is ar", document.documentElement.lang === "ar");
check("URL is /ar/", dom.window.location.pathname === "/ar/", `→ "${dom.window.location.pathname}"`);

await act(async () => byLabel("التبديل إلى الإنجليزية").click());
check("switches back to English", text().includes("Websites built"));
check("dir back to ltr", document.documentElement.dir === "ltr");
check("URL back to /", dom.window.location.pathname === "/", `→ "${dom.window.location.pathname}"`);

console.log("\nback button (the switch pushes history)");
await act(async () => {
  dom.window.history.back();
  await new Promise((r) => setTimeout(r, 50));
});
check("Back returns to Arabic", text().includes("مواقع مبنية"));
check("URL back at /ar/", dom.window.location.pathname === "/ar/", `→ "${dom.window.location.pathname}"`);
await act(async () => {
  dom.window.history.forward();
  await new Promise((r) => setTimeout(r, 50));
});
check("Forward returns to English", text().includes("Websites built"));

console.log("\nform validation");
await act(async () => document.querySelector("form").dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true })));
check("name error shown", text().includes("Add your name so we know"));
check("email error shown", text().includes("Add an email address so we can reply"));
check("message error shown", text().includes("Write a line or two"));
check("focus moved to first invalid field", document.activeElement?.id === "name", `→ "${document.activeElement?.id}"`);
check("aria-invalid set", document.getElementById("name").getAttribute("aria-invalid") === "true");

console.log("\nvalid submit (no endpoint → mail app handoff)");
await act(async () => {
  set("name", "Nadia Fahmy");
  set("email", "nadia@example.com");
  set("message", "We need a bilingual booking site.");
});
check("typing cleared the name error", !text().includes("Add your name so we know"));

await act(async () => document.querySelector("form").dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true })));
check("handoff screen, not false success", text().includes("Almost there."));
check("does NOT claim message was sent", !text().includes("Message sent."));
check("fallback address offered", text().includes("If nothing opened, write to"));
check("focus moved to the result", document.activeElement?.getAttribute("role") === "status");

console.log("\nreturning to the form");
await act(async () => [...root.querySelectorAll("button")].find((b) => b.textContent.includes("Send another"))?.click());
check("form is back", !!document.getElementById("name"));
check("draft was preserved", document.getElementById("name")?.value === "Nadia Fahmy", `→ "${document.getElementById("name")?.value}"`);
check("focus returned to first field", document.activeElement?.id === "name");

console.log("\nmobile menu");
await act(async () => byLabel("Menu").click());
check("menu opened", byLabel("Menu").getAttribute("aria-expanded") === "true");
await act(async () => dom.window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
check("Escape closed it", byLabel("Menu").getAttribute("aria-expanded") === "false");
check("focus returned to the toggle", document.activeElement === byLabel("Menu"));

console.log("\nlanding straight on /ar/");
{
  dom.window.history.pushState(null, "", "/ar/");
  const fresh = document.createElement("div");
  document.body.appendChild(fresh);
  await act(async () => render(h(App, {}), fresh));
  check("Arabic from the first paint", fresh.textContent.includes("مواقع مبنية"));
  check("no English flash in the markup", !fresh.textContent.includes("Websites built"));
  render(null, fresh);
  fresh.remove();
}

/* Only meaningful once `npm run build` has produced the prerendered pages. */
const prerendered = `${ROOT}/dist/ar/index.html`;
if (existsSync(prerendered)) {
  console.log("\nhydrating the prerendered Arabic page");
  const html = readFileSync(prerendered, "utf8");
  const inner = html.slice(html.indexOf('<div id="root">') + '<div id="root">'.length, html.lastIndexOf("</div>"));

  dom.window.history.pushState(null, "", "/ar/");
  const container = document.createElement("div");
  container.innerHTML = inner;
  document.body.appendChild(container);

  const before = container.querySelectorAll("section").length;
  const { hydrate } = await import("preact");
  await act(async () => hydrate(h(App, {}), container));

  check("prerendered markup had sections", before > 0, `→ ${before}`);
  check("hydration did not duplicate them", container.querySelectorAll("section").length === before, `→ ${container.querySelectorAll("section").length}`);
  check("still Arabic after hydrating", container.textContent.includes("مواقع مبنية"));
  check("form is interactive", !!container.querySelector("#name"));
  container.remove();
} else {
  console.log("\nskipped hydration check — run `npm run build` first");
}

console.log(failures === 0 ? "\nall passed" : `\n${failures} FAILED`);
unlinkSync(OUT);
process.exit(failures === 0 ? 0 : 1);
