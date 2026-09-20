import type { Loader } from "astro/loaders";
import { fileURLToPath } from "node:url";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Custom Content Layer loader for `commons/`.
 *
 * The commons dataset is stored as a handful of JSON files (one per
 * source section — tools, browser addons, etc.), each containing the
 * *entire* array of entries for that section. This loader preserves
 * that exact shape: one collection entry per file, with `data` set to
 * the file's raw JSON array — matching the legacy `type: "data"`
 * collection's behavior.
 *
 * `getCommonsEntries()` in `src/lib/commons.ts` flattens these
 * per-file entries into individual rows and depends on this
 * structure. Don't switch to per-item entries (e.g. via the built-in
 * `file()` loader, which requires each array item to carry its own
 * `id`) without updating that function too.
 */
export function commonsFilesLoader(base: string): Loader {
  return {
    name: "commons-files-loader",
    load: async ({ store, config, parseData, logger, watcher }) => {
      const baseDir = fileURLToPath(new URL(base, config.root));

      async function loadAll() {
        const filenames = (await readdir(baseDir)).filter((f) => f.endsWith(".json"));
        store.clear();

        for (const filename of filenames) {
          const id = filename.replace(/\.json$/, "");
          const raw = await readFile(path.join(baseDir, filename), "utf-8");
          const json = JSON.parse(raw);
          const data = await parseData({ id, data: json });
          store.set({ id, data });
        }
      }

      await loadAll();

      // Keep `astro dev` in sync if one of the source files changes.
      watcher?.on("change", async (changedPath) => {
        if (path.dirname(changedPath) === baseDir && changedPath.endsWith(".json")) {
          logger.info(`Reloading commons data (${path.basename(changedPath)} changed)`);
          await loadAll();
        }
      });
    },
  } satisfies Loader;
}
