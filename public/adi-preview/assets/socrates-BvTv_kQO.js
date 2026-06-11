function e(t){return{targetType:"document_section",targetRef:{documentId:"1",anchorId:t}}}const a=[{match:t=>/vs ?code|connector|pair|extension|access/.test(t),answer:{answer_md:`**VS Code connector** pairs your editor with this workspace in read-only mode.

1. Open the **Integrations** page and click *Connect* on the VS Code card.
2. Copy the 8-character pairing code (valid for 10 minutes).
3. In VS Code, run \`Orchestra: Pair Workspace\` from the command palette and paste the code.

Once paired, the extension can **ask Socrates questions against uploaded project memory** — PRD v2, the SRS, and indexed Slack threads — directly from the editor. The connector token is read-only: it can query memory but cannot modify documents, timeline entries, or Product Brain truth.`,citations:[{label:"BloomFast PRD v2 · §1 Overview",refId:"chunk-overview"},{label:"#engineering · Slack",refId:"slack-vscode"}],open_targets:[e("overview"),e("summary")]}},{match:t=>/compare|drift|contradict|conflict|versus|differ/.test(t),answer:{answer_md:`I found **2 places where Slack consensus and source docs disagree**:

1. **OAuth scope drift** — PRD v2 §2.1 says *"v1 ships with magic-link only; OAuth deferred to v2"*, but PR #47 (in review) implements OAuth flows with Google + GitHub providers. Either the PRD needs updating or the PR needs scoping back.
2. **Pro tier conflict** — the #product thread on May 12 agreed to defer the Pro subscription tier to v2, yet PR #38 (merged, \`a3f9c21\`) added Stripe Pro tier logic to main.

Everything else is aligned: Stripe Connect as payment provider, Supabase as database, and the June 15 launch date all match across docs, Slack, and the timeline.`,citations:[{label:"BloomFast PRD v2 · §2.1 Auth",refId:"chunk-auth"},{label:"#product · Slack · May 12",refId:"slack-pro-tier"},{label:"PR #47 · feature/magic-link-auth",refId:"pr-47"}],open_targets:[e("auth-detail"),e("scope-detail")]}},{match:t=>/review next|should .*review|pm |product manager|pending|priorit/.test(t),answer:{answer_md:`Based on pending items across the timeline and suggestions, here is what needs **manager attention first**:

1. **Promo code system scope** — requested by the product team for the launch campaign, still awaiting scope review and an engineering estimate (pending 2 days).
2. **PR #43 is stalled** — Devraj's soft-delete migration has had no activity for 7 days and is blocked on review by Sarah Chen.
3. **Driver Assignment coverage gap** — PRD v2 §3.2 has had no engineering activity in 18 days; it was scoped for sprint 4 and we are now in sprint 5.
4. **OAuth spec drift** — PR #47 implements OAuth despite the PRD scoping v1 to magic-link only.

Items 1 and 4 block the **June 15 launch** decision path, so I'd start there.`,citations:[{label:"Timeline · Promo code system requested",refId:"timeline-t1"},{label:"Suggestions · Stalled work",refId:"suggestion-s4"},{label:"BloomFast PRD v2 · §3.2 Driver Assignment",refId:"chunk-driver"}],open_targets:[e("driver-detail"),e("scope")]}},{match:t=>/requirement|spec|srs|scope of v1|what.*memory/.test(t),answer:{answer_md:`Project memory currently holds **4 indexed documents** covering these requirement groups:

- **Buyer ordering flow** — browse local florists, cart, checkout with Stripe Connect (PRD v2 §2).
- **Authentication** — magic-link only for v1, refresh-token rotation, 5 requests / 15 min rate limit (PRD v2 §2.1, SRS §3).
- **Florist order management** — accept/decline orders, inventory flags, payout dashboard at a 70/30 revenue split (PRD v2 §3.1).
- **Driver assignment** — proximity-based matching with availability windows and ETA calculation (Driver Assignment Spec, PRD v2 §3.2).
- **Payments** — Stripe Connect split payments; promo codes are *requested but not yet scoped*.

Out of scope for v1: OAuth, the Pro subscription tier, and push notifications beyond Firebase basics.`,citations:[{label:"BloomFast PRD v2 · §2 Scope",refId:"chunk-scope"},{label:"BloomFast SRS v1 · §3 Auth",refId:"chunk-srs-auth"},{label:"Driver Assignment Spec",refId:"chunk-driver-spec"}],open_targets:[e("scope-detail"),e("auth-detail"),e("driver-detail")]}},{match:t=>/which.*(document|doc|source)|supports|provenance|where.*from|evidence/.test(t),answer:{answer_md:`The strongest source for that is **BloomFast PRD v2** (uploaded by Sarah Chen, Apr 18). Section §2.1 covers the auth scope decision, §3.2 covers driver assignment, and §4 covers the Stripe Connect payment split.

Two supporting sources:
- **BloomFast SRS v1** — system-level requirements for auth, order flow, and payment integration.
- **OAuth Removal RFC** — Devraj's RFC proposing magic-link as the sole v1 auth mechanism (still indexing).

Click any citation below to open the exact section in the document viewer.`,citations:[{label:"BloomFast PRD v2 · §2.1",refId:"chunk-auth"},{label:"BloomFast SRS v1",refId:"chunk-srs"},{label:"OAuth Removal RFC",refId:"chunk-rfc"}],open_targets:[e("auth"),e("summary"),e("scope")]}},{match:t=>/ci\b|fail|check|pr ?#?\d+|merge|blocking|build/.test(t),answer:{answer_md:'**CI on main is passing** (last commit `a3f9c21`, 2h ago), but there is **1 failing check** in the history: commit `3e4f112` — *"fix: session rotation edge case"* by Devraj — failed on the session-rotation integration suite.\n\nPR health right now:\n- **PR #47** (magic-link auth refactor, Maya) — open, conflicts with **PR #52** in `auth.ts`, `session.ts`, and `middleware/auth.ts`. Whichever merges first forces the other to rebase.\n- **PR #43** (soft-delete migration, Devraj) — **stalled 7 days**, blocked on review by Sarah Chen. No CI failures; it simply needs a reviewer.\n- **PR #49** and **PR #50** — green and ready to merge.\n\nTest coverage is at **78%**, up 2 points this week.',citations:[{label:"Commit 3e4f112 · main",refId:"commit-3e4f112"},{label:"PR #47 · feature/magic-link-auth",refId:"pr-47"},{label:"PR #43 · migration",refId:"pr-43"}],open_targets:[e("auth-detail"),e("overview")]}},{match:t=>/auth|login|magic.?link|token|oauth|session/.test(t),answer:{answer_md:"**Auth in BloomFast v1 is magic-link only** — OAuth was removed from scope on May 27 after a cost and timeline review.\n\n- Magic-link request → email with one-time link → session with **refresh-token rotation** (PR #47, merged May 28, 24 files).\n- Rate limited to **5 magic-link requests per email per 15 minutes** via a BullMQ-backed limiter (commit `8b2e445`).\n- Refresh tokens live in httpOnly cookies; access tokens rotate on every refresh.\n\nThe module is owned by **Devraj** (18 of 23 commits to `src/modules/auth/`), with Sarah Chen reviewing all auth PRs. Watch out: PR #47 and PR #52 both touch `auth.ts`, `session.ts`, and `middleware/auth.ts` — merging either first forces the other to rebase.",citations:[{label:"BloomFast PRD v2 · §2.1 Auth",refId:"chunk-auth"},{label:"PR #47 · main",refId:"pr-47"},{label:"Timeline · OAuth removed from v1",refId:"timeline-t5"}],open_targets:[e("auth-detail"),e("auth")]}},{match:t=>/driver|assignment|delivery|eta/.test(t),answer:{answer_md:`**Driver assignment is the biggest risk area right now.** The spec (PRD v2 §3.2 + the dedicated Driver Assignment Spec) defines proximity-based matching, availability windows, and ETA calculation — but there has been **no engineering activity against it for 18 days**.

It was scoped for sprint 4; we are now in sprint 5, with the June 15 launch six weeks out. No branch, PR, or commit references §3.2 in that window.

Suggested next step: confirm with Sarah whether driver assignment stays in the v1 launch or moves to a fast-follow.`,citations:[{label:"BloomFast PRD v2 · §3.2 Driver Assignment",refId:"chunk-driver"},{label:"Driver Assignment Spec · Apr 22",refId:"chunk-driver-spec"},{label:"Suggestions · Coverage gap",refId:"suggestion-s7"}],open_targets:[e("driver-detail"),e("driver")]}},{match:t=>/stripe|payment|promo|billing|subscription|revenue/.test(t),answer:{answer_md:`**Stripe Connect is the confirmed payment provider** (decision logged May 22 by Sarah Chen, after evaluating Stripe, Braintree, and PayPal). Split payments run at a **70% florist / 30% platform** revenue share.

Current payment workstreams:
- **Promo codes** — PR #51 by Priya adds Stripe-backed promo endpoints; scope review still pending. Note it conflicts with PR #54 (rate limiter) in \`routes/api/index.ts\`.
- **Pro subscription tier** — deferred to v2 by #product consensus, but PR #38 already merged Pro tier logic to main; this needs reconciling.

Monthly tooling spend including Stripe usage pricing sits at **$506/mo** across AWS, Supabase, Firebase, Vercel, and Sentry.`,citations:[{label:"Timeline · Stripe selected",refId:"timeline-t12"},{label:"BloomFast PRD v2 · §4 Payments",refId:"chunk-payments"},{label:"#product · Slack · May 12",refId:"slack-pro-tier"}],open_targets:[e("payments-detail"),e("payments")]}},{match:t=>/launch|deadline|june|ship|release|v1|v2|timeline/.test(t),answer:{answer_md:`**Target launch is June 15, 2026** — revised from June 1 after the auth sprint ran 4 days over on refresh-token edge cases.

v1 scope (confirmed): buyer ordering, florist management, magic-link auth, Stripe Connect payments.
Deferred to v2: OAuth, Pro subscription tier, advanced notifications.

Open risks against the date: the driver assignment coverage gap (18 days idle), the PR #47/#52 auth merge conflict, and the unscoped promo code request. Sprint velocity is healthy at **32 pts/sprint** (up from 24).`,citations:[{label:"Timeline · Launch date revised",refId:"timeline-t18"},{label:"BloomFast PRD v2 · §2 Scope",refId:"chunk-scope"}],open_targets:[e("scope-detail"),e("overview")]}},{match:t=>/summar|overview|digest|catch me up|what.*project|tell me about/.test(t),answer:{answer_md:`**BloomFast** is an on-demand flower delivery marketplace connecting buyers to local florists. Project memory holds 4 docs, 47 commits, and 12 indexed Slack threads. The big picture:

- **Product** — three core flows: buyer ordering, florist order management, driver assignment (PRD v2, 47 pages).
- **Auth** — magic-link only for v1; OAuth deferred to v2. Merged to main in PR #47 with refresh-token rotation.
- **Payments** — Stripe Connect with a 70/30 florist/platform split; promo code system requested but unscoped.
- **Infra** — Supabase (Postgres), BullMQ + Redis workers, Vercel Pro hosting, S3 storage.
- **Launch** — June 15, 2026, revised from June 1. Velocity 32 pts/sprint.

Most urgent: the driver assignment spec has had no engineering activity in 18 days, and two auth PRs (#47, #52) are heading for a merge conflict.`,citations:[{label:"BloomFast PRD v2 · §1 Overview",refId:"chunk-overview"},{label:"BloomFast SRS v1",refId:"chunk-srs"},{label:"Timeline · 21 events",refId:"timeline-all"}],open_targets:[e("overview"),e("summary")]}}],i={answer_md:`From project memory — **BloomFast PRD v2**, the SRS, and recent Slack activity — the team is in the final sprint before the **June 15 launch**, with auth and integrations merged to main.

I can go deeper on any of these:
- *Summarize the uploaded project docs*
- *What requirements are in project memory?*
- *Compare source docs and Slack discussions*
- *What should a PM review next?*`,citations:[{label:"BloomFast PRD v2 · §1 Overview",refId:"chunk-overview"},{label:"#product · Slack",refId:"slack-pro-tier"}],open_targets:[e("overview"),e("summary")]};function s(t){const r=t.toLowerCase();for(const n of a)if(n.match(r))return n.answer;return i}export{s as getMockSocratesAnswer};
