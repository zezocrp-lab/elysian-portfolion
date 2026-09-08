<<<<<<< HEAD
# elysian-portfolion
A modern portfolio website showcasing web applications and digital products
=======
# ELYSIAN

A single-page bilingual site — English and Arabic — for an agency in Cairo that
builds websites and applications. React 19, Vite 7, Tailwind 4, no router and no
backend.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Typechecks, then builds to `dist/` |
| `npm run preview` | Serves the built `dist/` locally |

`build` runs the typecheck first on purpose: Vite strips types with esbuild
without ever checking them, so without that gate a type error would ship.

## Where things live

| File | Holds |
| --- | --- |
| `config.ts` | Email, WhatsApp, social links, optional form endpoint |
| `content.ts` | Every word on the page, English and Arabic |
| `App.tsx` | Layout and behaviour |
| `Mark.tsx` | The brand mark, as SVG |
| `index.css` | Theme tokens, typography, motion |
| `lang.ts` | Which language a visitor gets, and remembering it |
| `fonts.css` | Generated — see below |

To change copy, edit `content.ts` and nothing else. Both languages share one
`Content` type, so leaving a string out of either fails the typecheck rather
than shipping a blank.

## Language

A visitor's language is decided in this order: `?lang=ar` in the URL, then
whatever they last chose here, then what their browser asks for. Switching
languages writes `?lang=` into the address bar, so the page can be sent to
someone else in the language it was being read in.

## Fonts

The four families are served from this origin rather than Google's. Google
Fonts by CSS `@import` costs three serialised round trips before any text
appears — the browser must fetch and parse `index.css` before it even discovers
the font request.

`fonts.css` and everything in `public/fonts/` is generated:

```bash
node scripts/fetch-fonts.mjs
```

Only the `latin`, `latin-ext` and `arabic` subsets are kept. `unicode-range`
means an English visitor downloads about 264 KB and never touches the Arabic
faces; an Arabic visitor downloads about 378 KB and never touches the Latin
ones. All four families are OFL 1.1 — `public/fonts/LICENSE.md` must stay
next to them.

## Generated assets

```bash
node scripts/make-favicon.mjs   # public/favicon.svg, from Mark.tsx

npm i -D opentype.js sharp      # only needed for the next one
node scripts/make-og.mjs        # public/og.png, the 1200x630 share card
```

`make-og.mjs` quotes the hero headline, so re-run it if that copy changes.
Its two dependencies are deliberately not in `package.json`: sharp is a large
native package to carry for a file that changes twice a year.

## Deploying

Static output, no server. Both hosts detect Vite without configuration — the
config files here only exist to set cache headers on `public/` assets, which
never get content-hashed filenames and so never get long caching by default.


## Still to do

      placeholder, and messages currently go to an address that does not exist.
      Practice says "how I work" and Contact says "I reply". One page, two
      speakers. `content.ts`, and the three descriptions in `index.html`.
      has a designed empty state, which beats four cards reading "Project name".
      absolute `og:image`, and `hreflang`. They are commented out with a
      `YOUR-DOMAIN` placeholder because scrapers require absolute URLs.
      than handed to the visitor's mail app.
      or remove the Spec Kit scaffolding.
>>>>>>> fb1196a (Document the project and prepare deployment)
