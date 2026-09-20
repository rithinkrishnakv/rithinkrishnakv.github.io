import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// ---------------------------------------------------------------------------
// GitHub Pages checklist (see README.md for the full version):
//
// 1. `site` below must be your real Pages URL:
//      - user/org site  (repo named "<username>.github.io"): "https://<username>.github.io"
//      - project site   (any other repo name):                "https://<username>.github.io"
//
// 2. If this is a PROJECT site (not "<username>.github.io"), uncomment and
//    set `base` to "/<repo-name>" so internal links resolve correctly.
//
// 3. The included workflow at .github/workflows/deploy.yml builds and
//    publishes to Pages automatically on every push to `main`. Just enable
//    "GitHub Actions" as the Pages source in the repo settings.
// ---------------------------------------------------------------------------
export default defineConfig({
  site: "https://rithinkrishnakv.github.io",
  // base: "/your-repo-name",
  trailingSlash: "always",
  // Astro 7 changed the default whitespace handling to JSX-style rules,
  // which can drop the space between adjacent inline elements. Pinning
  // this to `true` (the pre-v7 default) keeps existing spacing/output
  // identical after the Astro 5 -> 7 upgrade.
  compressHTML: true,
  integrations: [
    sitemap({
      // The old /field-kit/ path is a noindex redirect stub, not a real page.
      filter: (page) => !page.includes("/field-kit/"),
    }),
  ],
  build: {
    format: "directory",
  },
});
