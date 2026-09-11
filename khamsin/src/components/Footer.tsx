const COLUMNS = [
  {
    title: "Shop",
    links: ["Outerwear", "Shirting", "Trousers", "Knitwear", "Second Wind"],
  },
  {
    title: "Help",
    links: ["Sizing", "Shipping", "Returns", "Repairs", "Contact"],
  },
  {
    title: "House",
    links: ["Our position", "Fabric index", "The Fayoum mill", "Stockists", "Careers"],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-bone">
      <div className="mx-auto max-w-[100rem] px-6 pt-20 md:px-10 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display max-w-sm text-2xl leading-snug text-bone/90">
              Small-run essentials for hot, dry places. Cut in Cairo, woven in the Fayoum, repaired
              for as long as you wear them.
            </p>
            <address className="mt-8 not-italic text-sm leading-relaxed text-bone/60">
              14 Sharia Falaki, Bab al-Louq
              <br />
              Cairo, Egypt
              <br />
              <a href="mailto:studio@khamsin.example" className="link-underline mt-3 inline-block">
                studio@khamsin.example
              </a>
            </address>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} className="md:col-span-2" aria-label={column.title}>
              <h2 className="label text-bone/40">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#collection"
                      className="link-underline text-sm text-bone/75 transition-colors hover:text-bone"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Oversized wordmark, cropped by the viewport on purpose. */}
        <p
          aria-hidden="true"
          className="display mt-20 select-none text-center text-[clamp(4rem,17vw,15rem)] leading-none tracking-[0.02em] text-bone/10"
        >
          KHAMSIN
        </p>

        <div className="flex flex-col gap-4 border-t hairline-inverse py-7 text-xs text-bone/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} KHAMSIN. A fictional house, built as a design exercise.</p>
          <ul className="flex flex-wrap gap-6">
            {["Privacy", "Terms", "Accessibility", "Instagram"].map((item) => (
              <li key={item}>
                <a href="#top" className="link-underline transition-colors hover:text-bone">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
