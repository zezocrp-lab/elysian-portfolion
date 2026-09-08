import type { Lang } from "./content";

const STORAGE_KEY = "elysian:lang";
const PARAM = "lang";

const isLang = (value: string | null | undefined): value is Lang => value === "en" || value === "ar";

/**
 * Where the visitor's language comes from, in order of authority:
 * the link they followed, then what they chose here last time, then what
 * their browser says it would rather read.
 */
export function readInitialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get(PARAM);
  if (isLang(fromUrl)) return fromUrl;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    /* Safari in private mode throws on storage access. Fall through. */
  }

  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  return preferred.some((tag) => tag?.toLowerCase().startsWith("ar")) ? "ar" : "en";
}

/**
 * Called only when the visitor picks a language themselves, never on load —
 * so ?lang= appears in the address bar as the result of a choice, and the page
 * can then be sent to someone else in the language they were reading.
 */
export function rememberLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* Storage unavailable; the URL below still carries the choice. */
  }

  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, lang);
  window.history.replaceState(null, "", url);
}
