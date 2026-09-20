// 1. Import utilities from `astro:content`
import { defineCollection } from "astro:content";
// 2. Import Astro's built-in loaders
import { glob } from "astro/loaders";
// 3. Import Zod
import { z } from "astro/zod";
import { commonsFilesLoader } from "@/lib/commons-loader";

// ---------------------------------------------------------------------------
// notes/  — the actual writing. Zero entries right now, on purpose.
// Add a note by dropping a new markdown file in src/content/notes/, e.g.
// src/content/notes/some-slug.md — the filename becomes the entry id.
// ---------------------------------------------------------------------------
const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // short line shown in note listings / social previews
    summary: z.string().optional(),
  }),
});

// ---------------------------------------------------------------------------
// commons/ — a shared reference collection of security tools, bookmarklets,
// browser addons, and proxy addons assembled from public projects.
//
// Structured as a handful of data files (one per source section) rather
// than one file per entry, since the full dataset runs into the hundreds
// of items. Each file is a JSON array validated against `entrySchema`.
// Field names/cardinality reflect the collection's data model:
// every entry has at most one `language` (never multiple), so it's a
// scalar, not an array; `platforms` genuinely is a list per entry.
//
// The custom `commonsFilesLoader` (src/lib/commons-loader.ts) preserves
// the one-entry-per-file shape the legacy `type: "data"` collection had —
// `getCommonsEntries()` in src/lib/commons.ts depends on it.
// ---------------------------------------------------------------------------
const entrySchema = z.object({
  name: z.string(),
  link: z.string().url(),
  description: z.string().optional(),
  // Recon, Scanner, Fuzzer, Proxy, Army-Knife, Exploit, Env, Utils, Etc.
  // Free text rather than an enum to preserve the existing data model.
  type: z.string(),
  tags: z.array(z.string()).default([]),
  language: z.string().optional(),
  platforms: z.array(z.string()).default([]),
  // Which collection table this came from — e.g. "Tools",
  // "Bookmarklets", "Browser Addons", "Burpsuite, Caido and ZAP Addons".
  sourceSection: z.string(),
});

const commons = defineCollection({
  loader: commonsFilesLoader("./src/content/commons"),
  schema: z.array(entrySchema),
});

// ---------------------------------------------------------------------------
// builds/ — official projects only. One file per project.
// ---------------------------------------------------------------------------
const builds = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/builds" }),
  schema: z.object({
    name: z.string(),
    status: z.enum(["active", "shipped", "paused", "archived"]),
    visibility: z.enum(["public", "private"]).default("public"),
    type: z.string().optional(),
    tagline: z.string().optional(),
    tech: z.array(z.string()).default([]),
    summary: z.string().optional(),
    link: z.string().url().optional(),
    repo: z.string().url().optional(),
    // higher = shown first
    weight: z.number().default(0),
  }),
});

export const collections = { notes, commons, builds };
