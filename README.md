# rithin krishna k v — personal site

A personal research notebook, a shared security reference, and a build log.
Built with [Astro](https://astro.build) + TypeScript, zero backend,
deployable as a static site.

```
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to ./dist
npm run preview   # preview the production build locally
npm run check     # type-check the project
```

## Routes

```
/           homepage
/notes/     writing — empty right now, on purpose
/commons/   a shared, searchable index of public security tools & references
/builds/    official projects only
```

`/field-kit/` used to exist under this name and now redirects (static
meta-refresh, since GitHub Pages has no server-side redirects) to
`/commons/`.

## Before you deploy

1. **Set the real site URL.** In `astro.config.mjs`, `site` must match your
   GitHub Pages URL. In `src/lib/site.ts`, `SITE.url` should match too.
   - `<username>.github.io` repo → served at the root.
   - Any other repo name (a "project site") → served at
     `https://<username>.github.io/<repo-name>` — uncomment and set `base`
     in `astro.config.mjs` accordingly.
2. **Fix the placeholder links** in `src/lib/site.ts` — the LinkedIn URL is
   an educated guess and the email is a placeholder. Both are marked `TODO`.
3. **Populate `/commons/`** — see below. It's intentionally empty until you
   add the real dataset; nothing there is invented.
4. **Enable GitHub Pages via Actions.** Settings → Pages → source =
   "GitHub Actions". `.github/workflows/deploy.yml` builds and deploys on
   every push to `main`.

## Content structure

Editorial content lives in `src/content/` as markdown/JSON, validated by
the schemas in `src/content/config.ts`. No CMS, no database.

```
src/content/
  notes/     # the actual writing — one markdown file per note
  commons/   # the shared tool/reference index — a few JSON data files
  builds/    # official projects — one markdown file per project
```

### Adding a note

Create `src/content/notes/your-slug.md`:

```md
---
title: "A title"
subtitle: "Optional subtitle"
date: 2026-10-01
tags: ["web", "recon"]
summary: "One line for listings and RSS."
---

Body content in markdown.
```

It shows up on `/notes/`, gets its own page at `/notes/your-slug/`, wires
into prev/next navigation, and appears in the RSS feed at `/rss.xml`. Set
`draft: true` to hold it back from all of those.

### `/commons/`

This is a shared reference, not personal software — see the page copy for
the framing. It's currently populated with 430 entries sourced from
[WebHackersWeapons](https://github.com/hahwul/WebHackersWeapons) (360
Tools, 19 Browser Addons, 51 Burp/Caido/ZAP Addons; the source's own
Bookmarklets table is empty upstream, hence `bookmarklets.json` is `[]`
— not a gap on this end, that's the real current state of that section).

Content lives in a handful of JSON files under `src/content/commons/`,
one per source section (`tools.json`, `bookmarklets.json`,
`browser-addons.json`, `burp-caido-zap-addons.json`) rather than one file
per entry, since the full dataset runs into the hundreds of items.

Each file is a JSON array. Every entry has this shape (see
`entrySchema` in `src/content/config.ts` for the authoritative version):

```json
{
  "name": "subfinder",
  "link": "https://github.com/projectdiscovery/subfinder",
  "description": "Passive subdomain enumeration.",
  "type": "Recon",
  "tags": ["subdomains"],
  "language": "Go",
  "platforms": ["linux", "macos", "windows"],
  "sourceSection": "Tools"
}
```

`description`, `language`, and `platforms` are omitted rather than
guessed when the source doesn't provide them (28 of the 430 entries have
no description, 20 have no language — that's faithful to the source, not
missing data). `type` is the source's own "Type" column (Recon, Scanner,
Fuzzer, Proxy, Army-Knife, Exploit, Env, Utils) rather than a taxonomy
invented here. `language` is a single value, not an array — every entry
in the source has at most one. `sourceSection` records which of the
source's own tables an entry came from; it's a filter facet, not a
display section — `/commons/` doesn't visually group by it.

To add more entries later — a dataset update, a new section — extend the
relevant JSON file (or add a new one and register it as a new key in
`src/content/config.ts`'s `commons` collection). Nothing else needs to
change: `/commons/` computes its filters, alphabet index, and counts from
whatever's actually in the collection at build time.

**How the page stays fast at this size**: the ~115 KB of entry data is
never inlined into `/commons/`'s own HTML. It's built as a separate
static JSON file at `/commons-data.json` (see
`src/pages/commons-data.json.ts` — a build-time-only endpoint, still 100%
static output, no server) and fetched once, client-side, on page load.
Rows are then rendered in batches of 60 as the person scrolls or filters
— never all ~430 in the DOM at once — using the "show more" control
rather than true virtualization, since at this scale a capped, batched
render is simpler and just as fast. The filter chrome itself (type/source
pills, language/platform dropdowns, tag chips, the alphabet strip) *is*
server-rendered directly from the collection, so it appears instantly
with no flash of empty controls; only the potentially-large row list is
deferred. One tradeoff worth knowing: because the rows are client-rendered,
individual tool names/descriptions aren't in the crawlable HTML of
`/commons/` itself — search engines will index the page and its
filters, but not each entry as text. If that ever matters more than the
performance win, the fix is to prerender all rows server-side (as the
filter chrome already is) and switch the batching to a "reveal more of
what's already there" pattern (e.g. `hidden` attribute toggling) instead
of `fetch`-and-build.

### Adding a build

Create `src/content/builds/project-name.md`:

```md
---
name: "Project Name"
status: "active"        # active | shipped | paused | archived
visibility: "public"    # public | private — omit for public
type: "security tool"   # optional
tagline: "optional short tagline"
tech: ["Go", "SQLite"]  # optional
summary: "One paragraph, optional."
repo: "https://github.com/you/project-name"   # optional
link: "https://project-site.example"          # optional, takes priority over repo
weight: 50               # higher sorts first
---
```

For a private project, set `visibility: "private"` and leave `summary`,
`link`, and `repo` out — the page shows it as private with no link and no
invented description, rather than exposing or guessing at repository
contents.

## Notes on the design

- **Typography**: Fraunces (display serif) for headings, Instrument Sans
  (a contemporary, highly legible variable sans — not Inter) for body
  text, IBM Plex Mono reserved for metadata only. Loaded from Google
  Fonts with `preconnect`.
- **Color**: single dark theme, a muted clay/terracotta accent —
  deliberately not cyan-on-black or neon.
- **Motion**: CSS-driven — staggered entrance on load, `IntersectionObserver`
  reveal on scroll, plus a line-draw variant (`[data-reveal-line]`) used
  above section headings for variety instead of repeating the same
  fade-up everywhere. Fully disabled under `prefers-reduced-motion`.
- **No client-side framework.** The only JavaScript is: the scroll-reveal
  observer in `BaseLayout.astro`, and the search/filter logic on
  `/commons/` (vanilla, no dependencies — plain substring matching over
  the fetched `/commons-data.json` index, batched/progressive rendering,
  filter state mirrored to the URL query string, and a `/` or
  `Cmd`/`Ctrl`+`K` shortcut to focus search).
