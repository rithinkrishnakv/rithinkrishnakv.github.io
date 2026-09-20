import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://rithinkrishnakv.github.io",
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
