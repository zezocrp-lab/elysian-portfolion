import { useEffect, useRef, useState, type FormEvent } from "react";
import Mark from "./Mark";
import { SITE, SITE_DISPLAY } from "./config";
import { content, type Content, type Lang, type Project } from "./content";
import { readInitialLang, rememberLang } from "./lang";

const SHELL = "mx-auto w-full max-w-[1180px] px-6 md:px-10";

export default function App() {
  const [lang, setLang] = useState<Lang>(readInitialLang);
  const [lifted, setLifted] = useState(false);
  const t = content[lang];

  /* Only a deliberate switch is written down — see lang.ts. */
  const chooseLang = (next: Lang) => {
    setLang(next);
    rememberLang(next);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = t.dir;
  }, [lang, t.dir]);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-void text-ivory">
      <a href="#main" className="skip-link">
        {t.skipToContent}
      </a>
      <Header lang={lang} onChooseLang={chooseLang} lifted={lifted} />
      <main id="main">
        <Hero t={t} />
        <Work t={t} />
        <Practice t={t} />
        <Tools t={t} />
        <Contact t={t} lang={lang} />
      </main>
      <Footer t={t} />
    </div>
  );
}

/* ---------------------------------------------------------------- header */

function Header({
  lang,
  onChooseLang,
  lifted,
}: {
  lang: Lang;
  onChooseLang: (l: Lang) => void;
  lifted: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const t = content[lang];

  /* The menu sits in the flow rather than over the page, so it is a disclosure
     and not a dialog — Escape closes it and hands focus back to its button,
     but focus is deliberately not trapped inside it. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const items = [
    { href: "#work", label: t.nav.work },
    { href: "#practice", label: t.nav.practice },
    { href: "#tools", label: t.nav.tools },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        lifted || menuOpen ? "bg-void/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className={`${SHELL} flex items-center justify-between py-5`}>
        {/* Hovering the name brings the mark out of the dark. */}
        <a href="#top" className={`brand ${lifted ? "is-revealed" : ""}`} aria-label="ELYSIAN">
          <Mark gradient className="brand-mark" />
          <span className="brand-word font-body text-[0.78rem] tracking-[0.42em] text-ivory">
            ELYSIAN
          </span>
        </a>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-9 md:flex">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-mute transition-colors duration-300 hover:text-gold-light"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => onChooseLang(lang === "en" ? "ar" : "en")}
            aria-label={t.switchLabel}
            className="rounded-full border border-gold/35 px-4 py-1.5 text-xs text-gold-light transition-colors duration-300 hover:border-gold hover:bg-gold/10"
          >
            {t.switchTo}
          </button>

          <button
            type="button"
            ref={toggleRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={t.menu}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-5 bg-gold transition-transform duration-300 ${
                menuOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-gold transition-transform duration-300 ${
                menuOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="detail-open md:hidden">
          <div className="hairline" />
          <ul className={`${SHELL} flex flex-col gap-1 py-4`}>
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-base text-ivory/80"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div
        className={`hairline transition-opacity duration-500 ${lifted && !menuOpen ? "opacity-100" : "opacity-0"}`}
      />
    </header>
  );
}

/* ------------------------------------------------------------------ hero */

function Hero({ t }: { t: Content }) {
  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden pt-32 pb-24">
      <div
        aria-hidden
        className="arrive-slow aureole pointer-events-none absolute top-1/2 h-[min(120vh,900px)] w-[min(120vw,900px)] -translate-y-1/2 end-[-24%] blur-[2px] md:end-[-14%]"
        style={{ animationDelay: "0.2s" }}
      />
      <Mark
        gradient
        className="arrive-mark pointer-events-none absolute top-1/2 h-auto w-[88vw] -translate-y-1/2 end-[-28%] opacity-[0.16] md:w-[44vw] md:max-w-[560px] md:end-[-4%] md:opacity-95"
      />

      <div className={`${SHELL} relative`}>
        <span className="arrive label block" style={{ animationDelay: "0.3s" }}>
          {t.hero.label}
        </span>

        <h1 className="display mt-6 max-w-[15ch] text-[clamp(2.9rem,8vw,5.6rem)] text-ivory">
          {t.hero.lines.map((line, i) => (
            <span key={line} className="arrive block" style={{ animationDelay: `${0.42 + i * 0.12}s` }}>
              {line}
            </span>
          ))}
        </h1>

        <p
          className="arrive mt-9 max-w-[44ch] text-[0.98rem] leading-[1.85] text-mute"
          style={{ animationDelay: "0.8s" }}
        >
          {t.hero.body}
        </p>

        <div className="arrive mt-11 flex flex-wrap gap-4" style={{ animationDelay: "0.95s" }}>
          <a href="#work" className="btn btn-gold">
            {t.hero.primary}
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </a>
          <a href="#contact" className="btn btn-ghost">
            {t.hero.secondary}
          </a>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 start-6 flex items-center gap-3 md:start-10"
      >
        <span className="label">{t.hero.scroll}</span>
        <span className="h-10 w-px overflow-hidden bg-gold/20">
          <span className="scroll-line block h-full w-px bg-gold" />
        </span>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- section head */

function SectionHead({
  label,
  heading,
  lead,
  note,
}: {
  label: string;
  heading: string;
  lead?: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="label block">{label}</span>
        <h2 className="display mt-4 text-[clamp(2.1rem,4.4vw,3.2rem)] text-ivory">{heading}</h2>
        {lead && <p className="mt-4 max-w-[52ch] text-[0.95rem] leading-[1.85] text-mute">{lead}</p>}
      </div>
      {note && <span className="shrink-0 text-sm text-mute">{note}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ work */

function Work({ t }: { t: Content }) {
  const projects = t.work.projects;

  return (
    <section id="work" className="scroll-mt-24 py-24 md:py-32">
      <div className={SHELL}>
        <SectionHead
          label={t.work.label}
          heading={t.work.heading}
          lead={projects.length > 0 ? t.work.lead : undefined}
          note={projects.length > 0 ? t.work.countLabel(projects.length) : undefined}
        />

        {projects.length === 0 ? (
          <div className="mt-14 rounded-2xl border border-gold/15 py-20 text-center">
            <Mark gradient className="mx-auto h-12 w-auto opacity-40" />
            <p className="mx-auto mt-6 max-w-[38ch] text-[0.98rem] leading-[1.9] text-mute">
              {t.work.empty}
            </p>
            <a href="#contact" className="underline-gold mt-6 inline-block pb-1 text-gold-light">
              {t.work.emptyCta}
            </a>
          </div>
        ) : (
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id} project={project} visitLabel={t.work.visit} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Card({ project, visitLabel }: { project: Project; visitLabel: string }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gold/15 bg-ink/60 transition-colors duration-500 hover:border-gold/45">
      <div className="relative aspect-[16/10] overflow-hidden bg-void">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <>
            <span aria-hidden className="aureole absolute inset-0 opacity-70" />
            <Mark
              gradient
              className="absolute left-1/2 top-1/2 h-24 w-auto -translate-x-1/2 -translate-y-1/2 opacity-25 transition-opacity duration-700 group-hover:opacity-45"
            />
          </>
        )}
        <span aria-hidden className="hairline absolute inset-x-0 bottom-0" />
      </div>

      <div className="p-6 md:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-xs text-gold/85">{project.kind}</span>
          <span className="text-xs text-mute">{project.year}</span>
        </div>

        <h3 className="display mt-3 text-[1.85rem] text-ivory transition-colors duration-300 group-hover:text-gold-light">
          {project.title}
        </h3>

        <p className="mt-3 text-[0.93rem] leading-[1.8] text-mute">{project.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li
              key={item}
              className="rounded-full border border-gold/20 px-3 py-1 text-[0.7rem] text-gold-light/75"
            >
              {item}
            </li>
          ))}
        </ul>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="underline-gold mt-6 inline-block pb-0.5 text-sm text-gold-light"
          >
            {visitLabel}
          </a>
        )}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------- practice */

function Practice({ t }: { t: Content }) {
  return (
    <section id="practice" className="scroll-mt-24 py-24 md:py-32">
      <div className={SHELL}>
        <SectionHead label={t.practice.label} heading={t.practice.heading} />

        <div className="mt-14">
          {t.practice.items.map((item) => (
            <div key={item.title}>
              <div className="hairline" />
              <div className="grid gap-x-12 gap-y-3 py-9 md:grid-cols-[minmax(0,17rem)_1fr]">
                <h3 className="display text-[1.6rem] text-gold-light">{item.title}</h3>
                <p className="max-w-[58ch] text-[0.95rem] leading-[1.9] text-ivory/70">{item.body}</p>
              </div>
            </div>
          ))}
          <div className="hairline" />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- tools */

function Tools({ t }: { t: Content }) {
  return (
    <section id="tools" className="scroll-mt-24 py-24 md:py-32">
      <div className={SHELL}>
        <SectionHead label={t.tools.label} heading={t.tools.heading} />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {t.tools.groups.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm text-gold">{group.label}</h3>
              <div className="hairline-start mt-3" />
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-[0.95rem] text-ivory/70">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- contact */

type Draft = { name: string; email: string; phone: string; message: string };
type Errors = Partial<Record<keyof Draft, string>>;

/** The order fields appear in, so a failed submit focuses the first bad one. */
const FIELD_ORDER: (keyof Draft)[] = ["name", "email", "phone", "message"];

const EMPTY_DRAFT: Draft = { name: "", email: "", phone: "", message: "" };

/**
 * idle → sending → either `sent` (the endpoint accepted it) or `handoff`
 * (we could only open the visitor's mail app — they still have to press send).
 */
type SendState = "idle" | "sending" | "sent" | "handoff";

function Contact({ t, lang }: { t: Content; lang: Lang }) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<SendState>("idle");
  const resultRef = useRef<HTMLDivElement>(null);
  const returningToForm = useRef(false);
  const c = t.contact;

  /* Submitting swaps the whole form out for the result, which is silent to
     anyone not watching the screen. Moving focus onto the result announces it
     and puts a keyboard user where the page now is. Focus is used rather than
     aria-live because it delivers reliably and cannot double-announce. */
  useEffect(() => {
    if (state === "sent" || state === "handoff") {
      resultRef.current?.focus();
    } else if (state === "idle" && returningToForm.current) {
      returningToForm.current = false;
      document.getElementById("name")?.focus();
    }
  }, [state]);

  const set = (key: keyof Draft) => (value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!draft.name.trim()) next.name = c.errors.name;
    if (!draft.email.trim()) next.email = c.errors.email;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email.trim())) next.email = c.errors.emailFormat;
    if (draft.message.trim().length < 5) next.message = c.errors.message;
    return next;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      /* Focus by id rather than querying for [data-invalid]: the attribute only
         lands after React re-renders, which has not happened yet. */
      const first = FIELD_ORDER.find((key) => found[key]);
      if (first) document.getElementById(first)?.focus();
      return;
    }

    setState("sending");

    const body = [
      `${c.fields.name}: ${draft.name}`,
      `${c.fields.email}: ${draft.email}`,
      `${c.fields.phone}: ${draft.phone || "-"}`,
      "",
      draft.message,
    ].join("\n");

    /* Only an endpoint that answers 2xx counts as delivered. fetch resolves on
       404s and 500s too, so a bad endpoint would otherwise report success for a
       message nobody received. Anything else falls back to the visitor's mail
       app, which is a handoff rather than a send. */
    let delivered = false;
    if (SITE.formEndpoint) {
      try {
        const response = await fetch(SITE.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...draft, language: lang }),
        });
        delivered = response.ok;
      } catch {
        delivered = false;
      }
    }

    if (delivered) {
      setState("sent");
      setDraft(EMPTY_DRAFT);
      return;
    }

    /* Keep the draft: if no mail app opens, the visitor still has their text. */
    window.location.href = mailtoHref(draft.name, body);
    setState("handoff");
  };

  const rows = [
    { label: c.rows.email, value: SITE.email, href: `mailto:${SITE.email}` },
    {
      label: c.rows.whatsapp,
      value: SITE_DISPLAY.whatsapp,
      href: SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : "",
    },
    { label: c.rows.github, value: SITE_DISPLAY.github, href: SITE.github },
    { label: c.rows.linkedin, value: SITE_DISPLAY.linkedin, href: SITE.linkedin },
  ].filter((row) => row.href);

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="aureole pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 opacity-40"
      />

      <div className={`${SHELL} relative`}>
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
          {/* left column */}
          <div>
            <span className="label block">{c.label}</span>

            <h2 className="display mt-5 text-[clamp(2.4rem,5.4vw,3.9rem)] text-ivory">
              <span className="block">{c.headingTop}</span>
              <span className="tagline block">{c.headingBottom}</span>
            </h2>

            <p className="mt-7 max-w-[42ch] text-[0.98rem] leading-[1.9] text-mute">{c.body}</p>

            <dl className="mt-12 space-y-4">
              {rows.map((row) => (
                <div key={row.label} className="flex flex-wrap items-baseline gap-x-8 gap-y-1">
                  <dt className="label w-28 shrink-0">{row.label}</dt>
                  <dd>
                    <a
                      href={row.href}
                      target={row.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      dir="ltr"
                      className="text-sm text-gold-light transition-colors duration-300 hover:text-gold"
                    >
                      {row.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* right column: the form card */}
          <div className="rounded-2xl border border-gold/18 bg-ink/70 p-7 backdrop-blur-sm md:p-9">
            {state === "sent" || state === "handoff" ? (
              <div ref={resultRef} tabIndex={-1} role="status" className="detail-open py-12 text-center">
                <Mark gradient className="mx-auto h-12 w-auto opacity-80" />
                <p className="display mt-6 text-[1.8rem] text-gold-light">
                  {state === "sent" ? c.successTitle : c.handoffTitle}
                </p>
                <p className="mx-auto mt-3 max-w-[34ch] text-[0.93rem] leading-[1.85] text-mute">
                  {state === "sent" ? c.successBody : c.handoffBody}
                </p>
                {state === "handoff" && (
                  <p className="mt-4 text-[0.93rem] text-mute">
                    {c.handoffFallback}{" "}
                    <a
                      href={`mailto:${SITE.email}`}
                      dir="ltr"
                      className="underline-gold pb-0.5 text-gold-light"
                    >
                      {SITE.email}
                    </a>
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    returningToForm.current = true;
                    setState("idle");
                  }}
                  className="underline-gold mt-8 pb-1 text-sm text-gold-light"
                >
                  {c.again}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6">
                <Field
                  id="name"
                  label={c.fields.name}
                  placeholder={c.placeholders.name}
                  value={draft.name}
                  onChange={set("name")}
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  id="email"
                  type="email"
                  label={c.fields.email}
                  placeholder={c.placeholders.email}
                  value={draft.email}
                  onChange={set("email")}
                  error={errors.email}
                  autoComplete="email"
                  dirOverride="ltr"
                />
                <Field
                  id="phone"
                  type="tel"
                  label={c.fields.phone}
                  hint={c.optional}
                  placeholder={c.placeholders.phone}
                  value={draft.phone}
                  onChange={set("phone")}
                  autoComplete="tel"
                  dirOverride="ltr"
                />
                <Field
                  id="message"
                  textarea
                  label={c.fields.message}
                  placeholder={c.placeholders.message}
                  value={draft.message}
                  onChange={set("message")}
                  error={errors.message}
                />

                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="btn btn-gold w-full disabled:opacity-60"
                >
                  {state === "sending" ? c.sending : c.submit}
                  <span className="btn-arrow" aria-hidden>
                    →
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function mailtoHref(name: string, body: string) {
  const subject = name ? `ELYSIAN - ${name}` : "ELYSIAN";
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  type = "text",
  textarea = false,
  autoComplete,
  dirOverride,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
  dirOverride?: "ltr" | "rtl";
}) {
  const cls = `field ${error ? "field-invalid" : ""}`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline gap-2">
        <span className="label">{label}</span>
        {hint && <span className="text-xs text-mute">{hint}</span>}
      </label>

      {textarea ? (
        <textarea
          id={id}
          rows={5}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          data-invalid={error ? "true" : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${cls} resize-y leading-[1.8]`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          dir={dirOverride}
          onChange={(e) => onChange(e.target.value)}
          data-invalid={error ? "true" : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cls}
        />
      )}

      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-300/85">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- footer */

function Footer({ t }: { t: Content }) {
  return (
    <footer>
      <div className="hairline" />
      <div
        className={`${SHELL} flex flex-col items-center justify-between gap-4 py-8 text-xs text-mute sm:flex-row`}
      >
        <span className="flex items-center gap-3">
          <Mark className="h-5 w-auto text-gold/70" />
          <span className="tracking-[0.42em]">ELYSIAN</span>
        </span>
        <span>{t.footer}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
