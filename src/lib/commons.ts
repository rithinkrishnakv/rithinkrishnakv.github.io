import { getCollection } from "astro:content";

/**
 * Loads every file in the commons collection and merges them into one
 * flat, alphabetically-sorted array with stable per-entry ids.
 *
 * Used by both /commons/ (for build-time facet computation — types,
 * languages, platforms, tags, alphabet index) and /commons-data.json
 * (the prebuilt static index the page fetches client-side for the actual
 * — potentially large — list of rows). Kept in one place so the two never
 * drift out of sync.
 */
export async function getCommonsEntries() {
  const files = await getCollection("commons");
  return files
    .flatMap((file) =>
      file.data.map((item, i) => ({
        id: `${file.id.replace(/\.json$/, "")}-${i}`,
        ...item,
      }))
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}
