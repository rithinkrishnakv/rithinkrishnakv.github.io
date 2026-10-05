---
title: "When the attacker is an agent"
date: 2026-10-05
tags: ["security-research", "cybersecurity"]
summary: "DIVD got hit. Two Zammad zero-days, seconds to root, and comments inside the attacker's scripts. The speed isn't the interesting part."
---

The part of the DIVD breach that caught my attention wasn't the root access.

It was the comments.

While investigating the intrusion, DIVD, together with Merlon Security, found two zero-days in Zammad. One allowed session hijacking and remote code execution as the `zammad` user; the other allowed that local user to escalate to root. DIVD says the jump to root took seconds.

What made them suspect an agent wasn't the speed. Their investigation found scripts containing notes where the attacker justified its own actions, and behavior suggesting that the next step was being chosen after seeing the result of the previous one. DIVD is clear that this is an assessment based on what they observed, not a confirmed attribution.

That's why the comments interest me more than the speed. Seconds to root doesn't need AI. A script can chain two working exploits just as fast. The interesting bit is what happens between those exploits. If something is actually reading the result and deciding what to do next, the operator doesn't need to be there choosing every command. A script can branch too, but someone had to think of the branches first. That's the part that feels different. At the same time, DIVD describes the attack as loud, messy and driven by sloppy logic, which is a useful reminder that "agentic" doesn't automatically mean smart.

The humans didn't lose the race outright, either. DIVD says it detected the intrusion on 22 September, the day after first access, blocked access to its datacenter systems, and started incident response with Merlon Security. It also credits network segmentation and the response team with stopping the attackers from going deeper. Some damage had already happened, including volunteer email addresses and possibly contact details. The public case doesn't tell us whether the segmentation actually stopped an attempted move deeper into the network or whether the attackers simply hadn't reached that point.

So I don't think this proves that human incident response is dead. It shows something smaller: if an agent can run the loop, the attacker doesn't need a human operator awake for every step.

Which leaves me with a more annoying question than "do we hand defense over to machines?"

How much of our response should already be able to make the next decision without us?

A service account suddenly becoming root could trigger isolation with a plain rule. No AI required. The catch is that the rule will sometimes isolate something that actually mattered, at 3am, and someone has to have agreed to that trade-off beforehand.

The hard part isn't automating the action.

It's deciding which mistakes we'd rather make.

<p class="note__sources meta">
  Sources · <a href="https://csirt.divd.nl/cases/DIVD-2026-00014/" target="_blank" rel="noopener noreferrer">DIVD case 00014</a> · <a href="https://csirt.divd.nl/cases/DIVD-2026-00015/" target="_blank" rel="noopener noreferrer">DIVD case 00015</a> · <a href="https://zammad.com/en/advisories/cve-2026-102489-cve-2026-102490" target="_blank" rel="noopener noreferrer">Zammad advisory</a> · <a href="https://labs.cloudsecurityalliance.org/research/csa-research-note-agentic-zero-day-chain-zammad-20261003-csa/" target="_blank" rel="noopener noreferrer">CSA research note</a> · <a href="https://www.cve.org/CVERecord?id=CVE-2026-102490" target="_blank" rel="noopener noreferrer">CVE-2026-102490</a> · <a href="https://thehackernews.com/2026/10/threatsday-ai-powered-zero-day-chain.html" target="_blank" rel="noopener noreferrer">The Hacker News</a>
</p>
