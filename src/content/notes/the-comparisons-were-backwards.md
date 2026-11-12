---
title: "The comparisons were backwards"
date: 2026-11-12
tags: ["security-research", "cybersecurity"]
summary: "A small string-comparison bug in Toybox's SUID-enabled umount authorization logic, fixed upstream and acknowledged by its maintainer."
ogImage: "/og/the-comparisons-were-backwards.png"
---

The part I keep thinking about isn't the bug.

It's how small it was.

Toybox's `umount` contains checks for the `user` and `nouser` options in mount-table entries — the checks that decide what an unprivileged user is allowed to do with a mount. The comparisons behind those checks were inverted. The `strncmp()` tests were read the wrong way round, so the options never actually worked.

Never. Not "worked badly." The code had been sitting there not doing the thing it said it did.

I sent it to Rob Landley. He confirmed it, fixed it, and put my name in the commit:

> Rithin krishna noticed that the SUID user/nouser options never worked because the strcmp tests are backwards.

The `mount` half of what I sent is still open. His take is that Toybox's `mount` flag handling should probably just match util-linux — once he works out what those semantics actually are. It never worked in the first place, so it isn't a regression and it isn't urgent.

There's a note in the tree now that `TOYBOX_SUID` is basically pending until the test suite works under mkroot.

No CVE. No advisory. Just a commit with my name in it.

I think that's the part I like.

The bug was in plain sight, in a comparison anyone could have read. It just needed someone to read it slowly.

---

**Fix commit:** [https://landley.net/toybox/git/commit/ad5ff67a84d3](https://landley.net/toybox/git/commit/ad5ff67a84d3)
