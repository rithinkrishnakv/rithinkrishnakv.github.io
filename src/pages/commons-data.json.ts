import type { APIRoute } from "astro";
import { getCommonsEntries } from "@/lib/commons";

// Static generation — this becomes a plain /commons-data.json file at
// build time, no server needed, fully GitHub Pages compatible.
export const prerender = true;

export const GET: APIRoute = async () => {
  const entries = await getCommonsEntries();
  return new Response(JSON.stringify(entries), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
