/* ------------------------------------------------------------------
   SITE SETTINGS — change these values and nothing else.
   ------------------------------------------------------------------ */

export const SITE = {
  /** Where contact messages should arrive. */
  email: "hello@elysian.dev",

  /** WhatsApp number, international format, digits only. Leave "" to hide the row. */
  whatsapp: "201000000000",

  /** Full profile URLs. Leave "" to hide the row. */
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

/** Shown next to WhatsApp / GitHub rows so the visitor sees a readable value. */
export const SITE_DISPLAY = {
  whatsapp: "+20 100 000 0000",
  github: "github.com/elysian",
  linkedin: "linkedin.com/in/elysian",
};
