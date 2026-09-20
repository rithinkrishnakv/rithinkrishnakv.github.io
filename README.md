# Rithin Krishna K V — personal site

A personal notebook for security research, useful tools, and things worth keeping. It is built with Astro and TypeScript.

## Local development

Requires Node.js 22.19.0 or later.

```sh
npm install
npm run dev
```

Useful commands:

```sh
npm run check
npm run build
npm run preview
```

## Routes

- `/` — home
- `/notes/` — notes
- `/builds/` — official projects
- `/commons/` — searchable security-tools index
- `/rss.xml` — RSS feed for published notes

## Content

Notes live in `src/content/notes/` as Markdown files. Add a note with frontmatter matching the collection schema in `src/content.config.ts`; drafts are excluded from the public site.

Builds live in `src/content/builds/`, with one Markdown file per official project. Private builds can be listed without exposing a repository or private details.

The Commons is a public index of security tools, extensions, references, and related resources. Its datasets live in `src/content/commons/` and are loaded as a single searchable collection.

## Deployment

GitHub Pages deploys from `main` through `.github/workflows/deploy.yml`. The workflow uses Astro's GitHub Action and the Pages deployment action.

Third-party notices for material included in the Commons are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
