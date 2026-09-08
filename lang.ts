import type { Lang } from "./content";

/**
 * The path is the language: English at /, Arabic under /ar/.
 *
 * This replaced a ?lang= parameter plus a stored preference when the site
 * started shipping prerendered HTML. Both pages now exist as real files, so
 * whatever a visitor asked for has already been decided by the time the
 * document arrives — reading a preference on the client and re-rendering would
 * only fight the markup that was served, and show the wrong language first.
 */
export function langFromPath(pathname: string): Lang {
  return /^\/ar(\/|$)/.test(pathname) ? "ar" : "en";
}

export function pathForLang(lang: Lang): string {
  return lang === "ar" ? "/ar/" : "/";
}

export function readInitialLang(): Lang {
  return langFromPath(window.location.pathname);
}

/**
 * Switching is a navigation, not just a state change, so the URL stays
 * shareable and Back returns to the previous language. Pushed rather than
 * loaded, so the switch itself is still instant.
 */
export function goToLang(lang: Lang) {
  window.history.pushState(null, "", pathForLang(lang) + window.location.hash);
}
