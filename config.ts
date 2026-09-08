/* ------------------------------------------------------------------
   SITE SETTINGS — change these values and nothing else.

   ⚠  EVERY VALUE BELOW IS STILL A PLACEHOLDER. The site is not ready to
      go live until they are real: messages sent to the address below go
      nowhere, and the WhatsApp / GitHub / LinkedIn rows link to dead ends.
   ------------------------------------------------------------------ */

export const SITE = {
  /**
   * The deployed origin, no trailing slash — e.g. "https://elysian.dev".
   *
   * Fill this in once the domain is live and the build writes the tags that
   * need an absolute URL: canonical, og:url, og:image and hreflang. Search
   * engines ignore those when they are relative, so while this is empty the
   * build emits only what is useful without it.
   */
  url: "",

  /** Where contact messages should arrive. TODO: real address. */
  email: "hello@elysian.dev",

  /** WhatsApp number, international format, digits only. Leave "" to hide the row. TODO: real number. */
  whatsapp: "201000000000",

  /** Full profile URLs. Leave "" to hide the row. TODO: real profiles. */
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",

  /**
   * Optional. Paste a form endpoint here (Formspree, Web3Forms, Getform…)
   * and the form posts messages straight to it.
   * Leave it empty and the form opens the visitor's mail app with the
   * message already written, addressed to the email above.
   */
  formEndpoint: "",
};

/**
 * The readable text shown next to each contact row.
 *
 * Derived from the values above rather than written out by hand, so the label
 * a visitor reads can never point somewhere different from the link they get.
 */
export const SITE_DISPLAY = {
  whatsapp: formatPhone(SITE.whatsapp),
  github: shortUrl(SITE.github),
  linkedin: shortUrl(SITE.linkedin),
};

/** "https://www.linkedin.com/in/name/" → "linkedin.com/in/name" */
function shortUrl(url: string) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

/** "201001234567" → "+20 100 123 4567" — country code, then groups from the right. */
function formatPhone(digits: string) {
  let rest = digits.replace(/\D/g, "");
  if (!rest) return "";

  const groups: string[] = [];
  if (rest.length > 4) {
    groups.unshift(rest.slice(-4));
    rest = rest.slice(0, -4);
  }
  while (rest.length > 3) {
    groups.unshift(rest.slice(-3));
    rest = rest.slice(0, -3);
  }
  groups.unshift(rest);

  return `+${groups.join(" ")}`;
}
