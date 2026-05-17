# Downtime Detector — Design Doc

**Status:** Phases 1–4 implemented. Phase 5 deliberately deferred.
**Owner:** Platform / Web
**Target:** Production go-live with Slack + Email alerting

**Implementation index:**
- Phase 1 code: [src/utils/alerts.js](../src/utils/alerts.js), [src/pages/api/health.js](../src/pages/api/health.js), and `dispatchAlert()` call sites in `src/pages/api/submit-*.js`, `subscribe-newsletter.js`, `track-download.js`
- Phase 2 code: [src/utils/monitor.js](../src/utils/monitor.js), [src/pages/api/monitor/status.js](../src/pages/api/monitor/status.js), synthetic short-circuits in the four form handlers
- Phase 3 code: [infra/detector/](../infra/detector/) — SAM template + Lambda source. Deploy with `cd infra/detector && sam build && sam deploy --guided`. See [infra/detector/README.md](../infra/detector/README.md).
- Phase 4 code: `forms.end_to_end` check in [infra/detector/src/checks.js](../infra/detector/src/checks.js) + [docs/RUNBOOK.md](RUNBOOK.md). Set `ApolloApiKey` and `ApolloListIdMonitor` SAM parameters and `RUNBOOK_BASE_URL` on the Lambda to enable.

---

## 1. Goals & non-goals

### Goals
- Detect when the **Next.js site, Strapi API, S3-hosted images, or contact forms** are broken — within 1–5 minutes of failure.
- Notify the team on **Slack** (primary) and **Email** (fallback) with enough context to act.
- Catch **silent breakage** (form submits but Apollo rejects, image URL returns 403, Strapi is up but returning empty content) — not just hard outages.
- Run **independently of the site itself**, so a full site outage still triggers an alert.
- Industry-grade: dedupe, severity levels, cooldowns, a runbook, and clean extension points for PagerDuty/SMS/Teams later.

### Non-goals (for v1)
- Public status page (`status.adaptiveintelligence.online`) — design accommodates it, not building yet.
- SLO/uptime % history dashboards — out of scope, can layer on later via CloudWatch Logs Insights.
- Per-page render checks (every URL on the site) — out of scope; covered in spirit by the Strapi check.
- Performance / latency budgets — out of scope; this detector cares about *up vs. down*, not *fast vs. slow*.

---

## 2. Current state (what exists)

| Component | File | Status |
|---|---|---|
| Health endpoint | `src/pages/api/health.js` | **Partial** — checks Strapi reachability but always returns HTTP 200 even when Strapi is down. External monitors that look at status codes won't see failures. |
| Slack helper | `src/utils/slack.js` | Works, fires on **successful** form submission only. No alerting on failures. |
| Form pipeline | `src/pages/api/submit-*.js` | Apollo (primary) + Strapi (backup), failures are returned to the user but **no internal alert** is sent. |
| Scheduled checks | — | **Missing.** No cron, no Lambda, nothing periodic. |
| Image / S3 health | — | **Missing.** |
| Synthetic form POST | — | **Missing.** |
| External-dependency probes | — | **Missing.** |
| Alert dedupe / state | — | **Missing.** |

---

## 3. Architecture

```
                          AWS account (us-east-1 assumed)
  ┌──────────────────────────────────────────────────────────────────────┐
  │                                                                      │
  │   ┌────────────────────┐    every 2 min                              │
  │   │ EventBridge        │ ──────────────────┐                         │
  │   │ Scheduler          │                   ▼                         │
  │   └────────────────────┘            ┌──────────────┐                 │
  │                                     │              │                 │
  │                                     │  Detector    │                 │
  │                                     │  Lambda      │                 │
  │                                     │  (Node 20)   │                 │
  │                                     │              │                 │
  │                                     └──────┬───────┘                 │
  │                                            │                         │
  │           ┌────────────────────────────────┼────────────────────┐    │
  │           ▼                ▼               ▼                 ▼  ▼    │
  │   ┌─────────────┐  ┌─────────────┐  ┌────────────┐  ┌──────────────┐ │
  │   │ Next.js     │  │ Strapi      │  │ S3 image   │  │ External:    │ │
  │   │ (Amplify)   │  │ (App Runner)│  │ HEAD       │  │ apollo.io,   │ │
  │   │ /api/health │  │ /api/setting│  │ sample URLs│  │ cf-turnstile │ │
  │   │ /api/monitor│  │             │  │            │  │              │ │
  │   │ /synthetic  │  │             │  │            │  │              │ │
  │   └─────────────┘  └─────────────┘  └────────────┘  └──────────────┘ │
  │                                                                      │
  │           ┌───────────────────────────┐                              │
  │           │  DynamoDB                 │  ← Lambda reads/writes       │
  │           │  monitor-state            │     check state for dedupe   │
  │           │  (PK = checkKey)          │                              │
  │           └───────────────────────────┘                              │
  │                                                                      │
  │           ┌───────────────────────────┐                              │
  │           │  Alert dispatcher         │  ← in Lambda                 │
  │           │  ├── Slack adapter        │                              │
  │           │  ├── SES email adapter    │                              │
  │           │  └── (later) PagerDuty…   │                              │
  │           └───────────────────────────┘                              │
  │                                                                      │
  │           ┌───────────────────────────┐                              │
  │           │  CloudWatch               │  ← Lambda logs go here       │
  │           │  + Alarm if Lambda fails  │     (watches the watcher)    │
  │           │  to invoke for >15 min    │                              │
  │           └───────────────────────────┘                              │
  └──────────────────────────────────────────────────────────────────────┘

  Real-time path (no Lambda involved):

  User form submit ──► Next.js /api/submit-* ──► Apollo / Strapi
                              │
                              └─ on failure ──► sendAlert() ──► Slack + Email
```

### Key decisions & why

| Decision | Why |
|---|---|
| **Detector runs in Lambda, not on Amplify** | Independence. If Amplify itself is down, the detector still runs and alerts you. Putting the cron on the same host that may be failing is the classic "who watches the watcher" mistake. |
| **EventBridge Scheduler (not CloudWatch Events rule)** | Newer service, simpler IAM, dead-letter queue support, one-time and recurring in the same API. |
| **DynamoDB for state** | On-demand pricing → pennies/month. Schema is one row per check key. Alternative (S3 JSON, Redis) is more code or more cost. |
| **Adapter pattern for channels** | `dispatchAlert()` calls each enabled channel. Add PagerDuty by writing one file, no refactor. |
| **2-minute interval** | Cheap (≈22k invocations/month, well within free tier). Mean-time-to-detect of 2–4 min is acceptable for marketing-site SLA. Tunable per check (image sweep can be 15 min). |
| **Real-time form failure alerts via Slack inside the Next.js handler** | Form failures are *events*, not *states*. They happen at unpredictable times and need to alert immediately, not at the next poll. Putting the alert in the handler is the simplest correct design. |
| **Synthetic form check uses a dry-run flag, not a real Apollo submit** | Avoids polluting Apollo with monitoring records every 5 min. Once-a-day full end-to-end check with a real submission to a dedicated `MONITOR` list is added separately. |

---

## 4. Checks (spec)

Each check returns one of: `OK` | `DEGRADED` | `DOWN`. The state machine triggers an alert on transition (OK→DOWN, DOWN→OK), not on every poll.

| Check key | What it does | Frequency | Severity if DOWN |
|---|---|---|---|
| `site.frontend` | `GET https://<site>/api/health`, expect 200 with `status: ok` | 2 min | CRITICAL |
| `strapi.api` | `GET https://admin.adaptiveintelligence.online/api/setting`, expect 200 | 2 min | HIGH |
| `strapi.images` | Pull 5 most-recent media items via Strapi `/api/upload/files?sort=createdAt:desc&pagination[limit]=5`, then `HEAD` each URL, all must return 2xx | 15 min | HIGH |
| `forms.synthetic` | POST to `/api/submit-contact-form` with `synthetic: true` + secret header; handler validates request shape and Apollo/Strapi reachability without writing | 5 min | CRITICAL |
| `forms.end_to_end` | POST a real test submission to a dedicated Apollo list (`APOLLO_LIST_ID_MONITOR`). Verify 200. | Daily (06:00 UTC) | CRITICAL |
| `dep.apollo` | `GET https://api.apollo.io/v1/healthcheck` (or known-public endpoint), expect 2xx | 5 min | MEDIUM |
| `dep.turnstile` | `GET https://challenges.cloudflare.com/turnstile/v0/api.js`, expect 2xx | 5 min | MEDIUM |

### Definitions

- **DOWN** = the last 2 consecutive runs failed. (Single transient blip → don't alert.)
- **DEGRADED** = response is 2xx but suspicious (e.g., Strapi returns 200 with empty body for `/api/setting`, or image HEAD returns 200 with `content-length: 0`). Logged, no alert in v1.
- **OK** = at least one of the last 2 runs succeeded.

---

## 5. Real-time form failure alerting (no Lambda needed)

This is the highest-value change and ships first (Phase 1).

**Where:** every form handler in `src/pages/api/` — `submit-contact-form.js`, `submit-lets-talk.js`, `subscribe-newsletter.js`, `track-download.js`.

**Behavior:**
- When the handler is about to return a 4xx/5xx to the user because Apollo or Strapi rejected, also fire `dispatchAlert()` to Slack + Email.
- Include: which form, which step failed (`apollo` / `strapi` / `turnstile`), the upstream error message, the user's email if present, request ID.
- The alert is **fire-and-forget** (`void dispatchAlert(...)`) — never block the response to the user.
- **Throttle:** at most 1 alert per (form × failure-step) per 5 min. Without this, a sustained outage could spam Slack 100+ times per minute. State stored in the same DynamoDB table the Lambda uses.

**Why this matters:** today, when Apollo silently rejects a real user, the team has zero visibility. The user sees a generic error and bounces. Real-time alerts let you catch broken submission paths within seconds of the first failed user.

---

## 6. Alert dispatcher

### Interface

```js
dispatchAlert({
  checkKey: 'forms.contact.apollo',     // unique identifier for dedupe
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  title: 'Apollo rejected contact form submission',
  body: 'Apollo returned 422: invalid email...',
  context: {                            // appears in alert body
    formType: 'contact',
    userEmail: 'foo@bar.com',
    apolloError: '...',
  },
  channels: ['slack', 'email'],         // defaults from severity table
  dedupe: {
    cooldownSec: 300,                   // don't repeat same alert within 5 min
  },
})
```

### Severity → channel mapping (default)

| Severity | Slack | Email | (later) PagerDuty |
|---|---|---|---|
| CRITICAL | ✅ | ✅ | ✅ |
| HIGH | ✅ | ✅ | — |
| MEDIUM | ✅ | — | — |
| LOW | log only | — | — |

### Slack message format

```
:rotating_light: [CRITICAL] forms.contact.apollo
*Apollo rejected contact form submission*
Apollo returned 422: invalid email format

formType: contact
userEmail: foo@bar.com
apolloError: { "error": "..." }

Runbook: https://github.com/.../docs/RUNBOOK.md#formscontactapollo
At: 2026-05-18T14:23:11Z
```

### Email format
Plain text, same content. Subject: `[CRITICAL] forms.contact.apollo — Apollo rejected contact form submission`.

### Dedupe state (DynamoDB table `monitor-state`)

```
PK: checkKey (string, e.g. "strapi.api")
Attributes:
  currentState: "OK" | "DOWN"
  consecutiveFailures: int
  lastTransitionAt: ISO8601
  lastAlertAt: ISO8601
  lastError: string
```

Alert is fired when:
- `state` transitions OK → DOWN, OR
- `state` transitions DOWN → OK (recovery message, lower-priority), OR
- `state == DOWN` AND `now - lastAlertAt > 30 min` (re-notify on long outages)

---

## 7. New endpoints in Next.js

### `GET /api/monitor/status` (public, no auth)
Returns current state of all checks as JSON. Useful for embedding in a future status page or external monitor.

```json
{
  "timestamp": "2026-05-18T14:23:11Z",
  "overall": "ok",
  "checks": {
    "site.frontend": { "state": "OK", "lastChecked": "..." },
    "strapi.api":   { "state": "OK", "lastChecked": "..." },
    "strapi.images":{ "state": "DOWN", "lastChecked": "...", "since": "..." }
  }
}
```

### `POST /api/submit-contact-form` — extended (synthetic mode)
Adds two new request rules:
- If `req.headers['x-monitor-secret'] === process.env.MONITOR_SECRET` AND `req.body.synthetic === true`:
  - Validate the payload shape, run Turnstile siteverify with a known test token (Cloudflare provides a always-passes test token: `XXXX.DUMMY.TOKEN.XXXX`), build the Apollo payload, but **return before** the actual `fetch('https://api.apollo.io/...')` call.
  - Respond 200 if the dry-run succeeded, 5xx if any preparatory step would have failed.
- Otherwise behave as today.

This catches: missing env vars, regression in field mapping, Strapi reachability for the backup step. It does **not** catch Apollo API key revocation — that's what `forms.end_to_end` (daily) is for.

Same change applied to the other three form handlers.

### `GET /api/monitor/run` — *intentionally not added*
Originally considered, but rejected: if the Lambda calls the frontend to run checks, then when the frontend is down the detector itself is blind. Lambda does all checks directly. The only Next.js endpoint the Lambda hits is the synthetic-form route — that one *should* be tested via the live route, since it's testing the route.

---

## 8. Environment variables

### New (Next.js / Amplify)
| Name | Purpose | Required |
|---|---|---|
| `SLACK_WEBHOOK_URL_ALERTS` | Webhook for ops alerts. Distinct from `SLACK_WEBHOOK_URL` (which is for form-submission notifications, i.e., success). | Yes |
| `ALERT_EMAIL_TO` | Comma-separated list of email recipients for alerts. | Yes |
| `ALERT_EMAIL_FROM` | Verified sender (SES). e.g. `alerts@adaptiveintelligence.online` | Yes |
| `AWS_REGION` | Already set by Amplify. SES adapter uses it. | — |
| `MONITOR_SECRET` | Shared secret. Handlers require this header to enter synthetic mode. | Yes |
| `MONITOR_STATE_TABLE` | DynamoDB table name, e.g. `monitor-state` | Yes |
| `APOLLO_LIST_ID_MONITOR` | Dedicated Apollo list ID for end-to-end test submissions. | Yes |
| `RUNBOOK_BASE_URL` | URL to runbook in repo or wiki. Used in alert footer. | No |

Add Amplify build to write these into `.env.production` — extend the existing `grep -E` in `amplify.yml`.

### New (Lambda)
Same as above, plus:
| Name | Purpose |
|---|---|
| `SITE_BASE_URL` | e.g. `https://adaptiveintelligence.online` |
| `STRAPI_BASE_URL` | e.g. `https://admin.adaptiveintelligence.online` |
| `STRAPI_API_TOKEN` | Read-only token for listing media uploads. Generate in Strapi admin. |

### Existing (already in place)
| Name | Used by |
|---|---|
| `SLACK_WEBHOOK_URL` | Form-submission success notifications (keep as-is). |
| `APOLLO_API_KEY` | Form handlers. |
| `TURNSTILE_SECRET_KEY` | Form handlers. |
| `NEXT_PUBLIC_STRAPI_API_URL` / `_AWS_URL` | Strapi base URL. |

---

## 9. AWS resources to create

1. **DynamoDB table**: `monitor-state`, PK `checkKey` (string), on-demand billing. No GSIs needed.
2. **SES**: verify `alerts@adaptiveintelligence.online` (or domain) for sending. Move out of sandbox if recipients aren't verified.
3. **Lambda**: `adaptive-detector`, Node 20, 256 MB, 30s timeout, env vars from §8.
   - IAM role: `dynamodb:GetItem,PutItem,UpdateItem` on the table; `ses:SendEmail` on the verified identity; CloudWatch Logs.
4. **EventBridge Scheduler**: `adaptive-detector-2min`, rate(2 minutes), target = Lambda.
5. **CloudWatch alarm** (the watchdog-of-the-watchdog): alarm if `Invocations` metric on the Lambda is `< 5` over 15 min. Action: email `ALERT_EMAIL_TO` via SES (separate from the Lambda's own alert path, so it works even if the Lambda is broken).

Cost estimate: **under $1/month** for everything (Lambda free tier covers 1M invocations, DynamoDB on-demand for ~22k writes/month is cents, SES is $0.10/1000 emails).

---

## 10. Phased rollout

### Phase 1 — Foundation ✅ DONE
- Fixed `/api/health.js` to return **503 when Strapi is down** (was always 200).
- Created `src/utils/alerts.js`: `dispatchAlert()` with Slack + Resend email adapters, in-memory throttle.
- Wired `dispatchAlert()` into all 19 failure paths across the four form handlers.
- Added `SLACK_WEBHOOK_URL_ALERTS`, `RESEND_API_KEY`, `ALERT_EMAIL_FROM`, `ALERT_EMAIL_TO`, `RUNBOOK_BASE_URL` env vars; extended `amplify.yml` grep pattern.

### Phase 2 — Synthetic form check ✅ DONE
- Added synthetic-mode short-circuit to all four form handlers (gated by `x-monitor-secret` header + `synthetic: true` body flag, secret compared in constant-time).
- Added `src/utils/monitor.js` with `isSyntheticRequest(req)` and `syntheticOkResponse()`.
- Added placeholder `/api/monitor/status` returning all-PENDING shape; replaced in Phase 3 with S3-backed fetch.
- Added `MONITOR_SECRET` env var to amplify.yml.

### Phase 3 — Detector Lambda ✅ DONE
Implementation in [infra/detector/](../infra/detector/). Chose **AWS SAM** for IaC (per §11 recommendation).

**Deviations from original plan, all minor:**
- **Scheduling:** instead of three EventBridge schedules at different rates, the Lambda runs **every minute** and uses `getUTCMinutes() % N` modulo to decide which check buckets are due. Fewer AWS resources, simpler scheduling, same effective cadence (1-min for site/strapi, 5-min for forms/deps, 15-min for images).
- **Email provider:** went with **Resend** (single fetch call, no AWS SDK dep) instead of SES. Swap is one function in `infra/detector/src/alerts.js` if needed later.
- **Status endpoint backing:** Lambda writes aggregated `status.json` to a new S3 bucket (public read on that one key); `/api/monitor/status` proxies that URL. Avoids adding AWS SDK to the Next.js bundle and avoids IAM complications on the Amplify SSR runtime.
- **Dedupe:** state-machine in DynamoDB makes the Phase 1 in-memory throttle redundant for Lambda-side alerts. The form handlers still use in-memory throttle because they're per-process and don't have DynamoDB access — fine for their use case.
- **Watchdog-of-the-watchdog:** Phase 3 includes the CloudWatch alarm + SNS topic for missed Lambda invocations (was listed under Phase 4). Cheap to add now, no reason to defer.

### Phase 4 — End-to-end test ✅ DONE
- Added `forms.end_to_end` check: Lambda POSTs directly to `https://api.apollo.io/v1/contacts` with `APOLLO_LIST_ID_MONITOR`. Test email is plus-addressed with the date (`monitor+e2e-YYYY-MM-DD@adaptiveintelligence.online`) so duplicates across days are visible.
- Added `daily0600UTC` bucket; handler runs it when `hour === 6 && minute === 0` (UTC). Off-hours in the team's working zones so a failed test isn't mistaken for a real lead.
- Added `ApolloApiKey` + `ApolloListIdMonitor` SAM parameters (both optional — leaving empty disables the check without breaking the stack).
- Published [docs/RUNBOOK.md](RUNBOOK.md) with full response actions for all 10 detector checks, all 16 real-time form-failure checkKeys, and the watchdog alarm. Set `RUNBOOK_BASE_URL` on the Lambda env to enable runbook deep-links in alert footers.

**Deviations from original plan:**
- **CloudWatch watchdog alarm:** built in Phase 3 (was originally scoped here). Already deployed.
- **Apollo test entry cleanup:** still optional, out of scope. One Apollo contact per day in the MONITOR list is manageable for years before becoming a real maintenance burden. Operator deletes the list contents periodically or builds a cleanup Lambda later.

### Phase 5 (later, not v1) — PagerDuty / status page / SLO history
Hooks are in place; adding these is additive.

---

## 11. Open questions to resolve before code

1. **IaC tooling.** No existing Terraform/CDK/SAM in the repo (only `amplify.yml` and `bitbucket-pipelines.yml`). Options:
   - **AWS SAM** — simplest for Lambda + EventBridge + DynamoDB. Single `template.yaml`.
   - **AWS CDK (TypeScript)** — more flexible, fits if you'll add more infra later.
   - **Click-ops** — fastest to ship, hardest to reproduce/audit.
   - **Recommendation:** SAM. Smallest learning curve, fits the scope.

2. **Strapi read-only API token.** Need to generate in Strapi admin → Settings → API Tokens → Custom (read-only on `Upload`). Store as `STRAPI_API_TOKEN` in Lambda env.

3. **Apollo "monitor" list.** Need to create a dedicated list in Apollo and put its ID in `APOLLO_LIST_ID_MONITOR`. Daily test entries pile up there — periodically clean (or auto-delete contacts older than 30 days via a second Lambda, out of scope for v1).

4. **Email recipients.** Who gets alerts? Need final list for `ALERT_EMAIL_TO`. Recommend a shared address (`ops@…` or a Google Group) over individual inboxes.

5. **Slack channels.** Separate channel for ops alerts (`#site-alerts`) vs. existing form-submission channel? Recommend yes — different audiences.

6. **Site base URL the detector polls.** `https://adaptiveintelligence.online` only, or also `www.`, staging? Recommend prod only for v1.

---

## 12. Runbook (skeleton — populate during Phase 4)

For each `checkKey`, document:
- **What it means**
- **First action** (e.g. open Strapi admin URL in browser to verify)
- **Common causes** (e.g. App Runner scaled to zero, RDS at connection limit)
- **Escalation path**

Example entry:

> ### `strapi.api` DOWN
>
> **Means:** Strapi at `admin.adaptiveintelligence.online/api/setting` did not return 200 in the last 2 consecutive checks.
>
> **First action:**
> 1. Open the URL in a browser. If it loads, the issue is intermittent — check again in 2 min.
> 2. If it doesn't load, check App Runner console: is the service running? Any deploy in progress?
> 3. Check RDS console: any CPU/connection spikes?
>
> **Common causes:** App Runner cold-start failures, RDS connection exhaustion, recent bad Strapi deploy.
>
> **Escalation:** if down >15 min, roll back to previous App Runner image.

---

## 13. Out-of-scope follow-ups (track separately)

- Public status page at `status.adaptiveintelligence.online`.
- SLO/uptime % dashboard (CloudWatch Logs Insights query over Lambda logs).
- PagerDuty integration for off-hours paging.
- Synthetic checks for additional user journeys (search, navigation, CTA clicks).
- Auto-recovery actions (e.g. App Runner restart on Strapi 5xx — risky; only add after manual ops experience).

---

## Sign-off

- [ ] Hosting / infra approach (Lambda + EventBridge + DynamoDB) approved
- [ ] IaC tool chosen (recommend SAM)
- [ ] Check list (§4) approved
- [ ] Alert channels and recipients confirmed (§8)
- [ ] Phased rollout order approved (§10)
- [ ] Open questions in §11 resolved

Once signed off, Phase 1 PR can land in ~1 day of work.
