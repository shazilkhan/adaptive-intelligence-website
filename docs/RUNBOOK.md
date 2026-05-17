# Site Runbook

Alert response guide for the Adaptive Intelligence downtime detector.
Every Slack/email alert from the detector links to a section below via
`RUNBOOK_BASE_URL` (set this env var on the Lambda to point at this file
on GitHub/Bitbucket).

**General principles before opening any specific section:**

1. **Don't panic on a single LOW alert.** The state machine requires 2
   consecutive failures before flipping to DOWN. If you see one alert
   followed by a recovery alert within ~5 minutes, that's usually a transient
   network blip — log it but no action needed.
2. **Check the [public status JSON](https://adaptiveintelligence.online/api/monitor/status)
   first.** It shows current state of ALL checks. If multiple checks are
   DOWN simultaneously, the underlying problem is probably bigger than any
   single check (e.g. AWS region outage, DNS issue, expired cert).
3. **Form-failure alerts (real-time)** vs. **detector alerts (state machine)**
   are different paths. Real-time alerts fire from the Next.js handler the
   instant a real user's submission fails — they happen at unpredictable
   times and don't have a 2-failure threshold. Detector alerts come from
   the Lambda on a schedule.
4. **Pause the detector during planned maintenance** to avoid noise. See
   "Pause the detector" in [infra/detector/README.md](../infra/detector/README.md#operating).

---

## Severity meanings

| Severity | What it means | Response window |
|---|---|---|
| CRITICAL | User-facing breakage (site, lead capture). Revenue impact. | Investigate immediately. |
| HIGH | Significant degradation (CMS down, images broken). User-noticeable. | Investigate within the hour. |
| MEDIUM | Upstream dependency degraded. Site still functions. | Acknowledge same-day. |
| LOW | Informational (recoveries, single transient failures). | No action required. |

---

## Detector checks

### `site.frontend` DOWN
**Severity:** CRITICAL
**Means:** `https://adaptiveintelligence.online/api/health` did not return HTTP 200 with `{status:"ok"}` for 2 consecutive minutes.

**First action:**
1. Open the URL in a browser. If it loads with status ok → transient. Wait for the recovery alert.
2. If it doesn't load, open `https://adaptiveintelligence.online/` — does the marketing site itself render?
3. Check AWS Amplify console → App → recent deployments. Is there a deploy in progress or recently failed?

**Common causes:**
- Recent bad Amplify deploy (build succeeded but SSR is broken)
- Amplify Hosting compute issue in the region
- DNS / TLS cert problem
- The health check itself broke (Strapi reachable but `/api/setting` returns non-200 → see `strapi.api` below; the health endpoint returns 503 in that case)

**Escalation:** if down >10 min:
1. Roll back the last Amplify deployment from the console.
2. If the rollback doesn't fix it, check AWS Health Dashboard for regional issues.

---

### `strapi.api` DOWN
**Severity:** HIGH
**Means:** `https://admin.adaptiveintelligence.online/api/setting` did not return HTTP 200 for 2 consecutive minutes.

**First action:**
1. Open the URL in a browser. Does it return JSON?
2. Open the Strapi admin (`/admin`). Can you log in?
3. AWS App Runner console → `adaptive-strapi` service → recent deployments + CloudWatch logs.
4. RDS console → Strapi database → CPU/connection metrics.

**Common causes:**
- App Runner cold-start failure after a long idle period
- Recent bad Strapi deploy (model changes, plugin install)
- RDS connection pool exhaustion
- App Runner scaled to zero and a request never woke it back up (check minimum instance count)

**Escalation:** if down >15 min:
1. Roll back to the previous App Runner image (App Runner console → Deployments → previous → Redeploy).
2. If the issue is database-related, check RDS for stuck queries / failover events.

**Knock-on effects to expect:** `strapi.images` will probably also alert if Strapi is fully down (the image-list API call fails). The marketing site itself continues to serve from ISR cache, so `site.frontend` may stay OK — but new content can't be edited or fetched.

---

### `strapi.images` DOWN
**Severity:** HIGH
**Means:** HEAD requests to the 5 most-recent Strapi-uploaded media URLs returned non-2xx. Could be 1 of 5 or 5 of 5 — the alert body shows which.

**First action:**
1. Open one of the failed URLs in a browser (alert body includes them).
2. If 404: file may have been deleted in Strapi but Strapi's API still lists it (rare — usually means S3/Strapi out of sync).
3. If 403: S3 bucket policy or CloudFront access control changed.
4. If timeout: S3 region issue or CloudFront distribution problem.

**Common causes:**
- S3 bucket policy edited (lost public read on `GetObject`)
- IAM role for Strapi → S3 upload broken (new uploads fail; existing files still readable, so this usually shows up as Strapi-side write errors first)
- CloudFront distribution disabled / origin changed
- S3 lifecycle policy expired old files

**Escalation:** if down >30 min:
1. Check S3 bucket `your-strapi-uploads-prod` (see [STRAPI-UPLOADS-TO-S3.md](../STRAPI-UPLOADS-TO-S3.md)) bucket policy.
2. Verify the bucket's `Block public access` settings haven't changed.
3. If files are genuinely missing, restore from S3 versioning (if enabled).

---

### `forms.synthetic.contact` DOWN
**Severity:** CRITICAL
**Means:** Lambda POSTed a synthetic payload to `/api/submit-contact-form` and got non-200 (or 200 without `synthetic:true` in the response).

**First action:**
1. Reproduce locally:
   ```bash
   curl -X POST https://adaptiveintelligence.online/api/submit-contact-form \
     -H "Content-Type: application/json" \
     -H "x-monitor-secret: $MONITOR_SECRET" \
     -d '{"synthetic":true,"firstName":"Monitor","lastName":"Synthetic","email":"monitor@adaptiveintelligence.online","phone":"+10000000000","companyName":"Adaptive Intelligence","message":"test"}'
   ```
2. If response is 401/missing `synthetic:true`: `MONITOR_SECRET` is misconfigured in Amplify or Lambda. Compare the two values.
3. If response is 500: check Amplify SSR logs for the route.

**Common causes:**
- `MONITOR_SECRET` mismatch between Amplify env and Lambda env (most common after rotation)
- Recent Next.js deploy broke `isSyntheticRequest()` or a form handler
- `APOLLO_API_KEY` env var missing in Amplify (handler bails early in synthetic mode, returns 500)

**Escalation:** if persistent:
1. Roll back the last Next.js deploy on Amplify.
2. Check `MONITOR_SECRET` is set in both Amplify env vars AND Lambda env vars (via SAM parameter `MonitorSecret`).

---

### `forms.synthetic.letstalk` DOWN
**Severity:** CRITICAL
**Means:** Same as `forms.synthetic.contact`, but for `/api/submit-lets-talk`.

**First action:** identical to `forms.synthetic.contact` above, substituting the URL and payload (uses `company` not `companyName`).

---

### `forms.synthetic.newsletter` DOWN
**Severity:** CRITICAL
**Means:** Synthetic POST to `/api/subscribe-newsletter` returned non-200.

**First action:**
1. Reproduce:
   ```bash
   curl -X POST https://adaptiveintelligence.online/api/subscribe-newsletter \
     -H "Content-Type: application/json" \
     -H "x-monitor-secret: $MONITOR_SECRET" \
     -d '{"synthetic":true,"email":"monitor@adaptiveintelligence.online"}'
   ```
2. Newsletter handler validates Strapi URL — if response is `500 Backend not configured`, `NEXT_PUBLIC_STRAPI_API_URL` / `NEXT_PUBLIC_STRAPI_AWS_URL` is missing.

**Common causes:** same as contact form, plus Strapi URL env var missing.

---

### `forms.synthetic.download` DOWN
**Severity:** HIGH (one level lower than other forms — downloads are less revenue-critical and recoverable from a refresh)
**Means:** Synthetic POST to `/api/track-download` returned non-200.

**First action:** download tracking only validates `email` + `slug`. If this is failing in synthetic mode, the route itself is broken (deploy regression or import error in `track-download.js`).

---

### `forms.end_to_end` DOWN
**Severity:** CRITICAL
**Means:** The daily 06:00 UTC direct POST to `https://api.apollo.io/v1/contacts` returned non-2xx. Apollo is rejecting writes.

**Critical context:** this is the only check that confirms real lead capture works. If this is DOWN but `forms.synthetic.*` are OK, the handler logic is fine but Apollo is the problem (rotated key, account suspended, billing issue, rate limited).

**First action:**
1. Log in to [Apollo](https://app.apollo.io/) and verify the account is active.
2. Settings → Integrations → API → check the API key is still listed and active.
3. Try `curl https://api.apollo.io/v1/auth/health -H "Authorization: Bearer $APOLLO_API_KEY"` (or whatever Apollo's current health endpoint is).
4. Check the Apollo monitor list (`APOLLO_LIST_ID_MONITOR`) — did the test entry from earlier today get created? When was the last one?

**Common causes:**
- Apollo API key rotated or revoked (someone regenerated it on the dashboard)
- Apollo account hit usage limit
- Apollo billing lapsed
- Apollo rate limit (if a load spike or runaway script consumed quota)

**Escalation:**
1. If key issue: rotate via Apollo dashboard, update `APOLLO_API_KEY` in BOTH Amplify env (for real form handlers) AND Lambda env (`sam deploy --parameter-overrides ApolloApiKey=<new>`).
2. If billing: someone with payment access needs to act.
3. While this is broken, real form submissions are losing leads. Consider adding a temporary banner on the site or routing through Strapi-only.

---

### `dep.apollo` DOWN
**Severity:** MEDIUM
**Means:** `HEAD https://api.apollo.io/` did not return any HTTP response (network-level failure).

**First action:**
1. Check [Apollo status](https://status.apollo.io/) if they have a public status page.
2. Try the same HEAD from another network (e.g. your laptop): `curl -I https://api.apollo.io/`
3. If reachable from elsewhere, the issue is between AWS (Lambda region) and Apollo — likely transient.

**Common causes:**
- Apollo infra outage
- DNS issue between AWS and Apollo
- AWS region-level networking event

**Escalation:** usually self-resolves within minutes. If persistent >30 min:
- The synthetic form checks will also start failing once real handlers can't reach Apollo. At that point, the contact form Strapi-backup path still records leads.

---

### `dep.turnstile` DOWN
**Severity:** MEDIUM
**Means:** `HEAD https://challenges.cloudflare.com/turnstile/v0/api.js` returned non-2xx.

**First action:**
1. Check [Cloudflare status](https://www.cloudflarestatus.com/).
2. Confirm the API.js endpoint loads in a browser.

**Common causes:**
- Cloudflare Turnstile service degraded (rare)
- Cloudflare regional outage

**Important:** the form handlers **fail open** on Turnstile errors (see comments in each handler) — the CAPTCHA verification is skipped, the submission goes through. So this alert does not block lead capture. It does mean we're temporarily not protected from bot submissions.

**Escalation:** usually transient. If persistent, monitor Apollo for an uptick in low-quality submissions and consider temporarily adding a different anti-bot signal (honeypot field, etc.).

---

## Watchdog alerts

### CloudWatch alarm: `adaptive-detector-detector-missing`
**Sent to:** `AlertSinkEmail` (set in SAM parameters). This is the **only** alert that does NOT come through the detector's own Slack/email path.

**Means:** the detector Lambda has invoked fewer than 5 times in the last 15 minutes (it should invoke ~15 times).

**First action:**
1. EventBridge console → Schedules → `adaptive-detector-every-minute` → is it ENABLED? Did someone disable it for planned maintenance and forget to re-enable?
2. Lambda console → `adaptive-detector-detector` → Monitor tab → are recent invocations throwing? Check logs.
3. IAM console → role `adaptive-detector-DetectorScheduleRole-*` → verify the role still exists and has the `lambda:InvokeFunction` policy attached.

**Common causes:**
- Schedule disabled (planned maintenance)
- Lambda code has a syntax error from a recent deploy — fails immediately, doesn't even log
- IAM role for the schedule was deleted or its trust policy was modified
- AWS Scheduler service issue in the region (rare)

**Recovery:**
1. If schedule is disabled: re-enable via console or `aws scheduler update-schedule --state ENABLED ...`
2. If Lambda is broken: rebuild and redeploy: `cd infra/detector && sam build && sam deploy`
3. If IAM role broken: redeploy the stack — SAM will recreate it.

**While this is down, you have no automated alerting.** Spot-check the site, Strapi, and forms manually until you fix the detector.

---

## Real-time form-failure alerts (no detector involved)

These come from the Next.js handlers (`src/utils/alerts.js → dispatchAlert()`) the moment a real user's form submission fails. They have their own checkKeys but no state machine — they fire once per `(checkKey, 5-minute window)`.

| checkKey | Meaning | First action |
|---|---|---|
| `forms.contact.apollo` | Apollo rejected a real contact form submission | Check alert body for Apollo response. If 422, payload shape may be wrong (check recent commits to handler). If 401/403, API key issue. |
| `forms.contact.apollo_unreachable` | fetch() to Apollo threw from contact handler | Likely network or DNS — same as `dep.apollo`. |
| `forms.contact.strapi_backup` | Strapi rejected backup write (Apollo succeeded) | Lead is safe in Apollo. Investigate Strapi at leisure. |
| `forms.contact.strapi_unreachable` | fetch() to Strapi threw (Apollo succeeded) | Same as above. |
| `forms.contact.config` | `APOLLO_API_KEY` missing | Set the env var in Amplify and redeploy. |
| `forms.contact.handler_crash` | Unhandled exception in contact handler | Check Amplify SSR logs for stack trace. Roll back if recent deploy. |
| `forms.letstalk.*` | Same as contact.* but for Let's Talk form | Same actions. |
| `forms.newsletter.apollo` | Apollo rejected newsletter signup | Check API key / list ID. Strapi may have still saved the subscriber. |
| `forms.newsletter.apollo_unreachable` | Network error to Apollo from newsletter | Same as above. |
| `forms.newsletter.config` | Strapi URL not set | Set `NEXT_PUBLIC_STRAPI_API_URL` and redeploy. |
| `forms.newsletter.strapi` | Strapi rejected newsletter create | User saw 500. Investigate Strapi `newsletters` content type. |
| `forms.newsletter.handler_crash` | Unhandled exception | Check logs. |
| `forms.download.apollo` | Apollo rejected download tracking | Lower-stakes — download still works. |
| `forms.download.apollo_unreachable` | Network error | Same. |
| `forms.download.strapi` | Strapi rejected download tracking record | Lower-stakes — download still works, just not tracked. |
| `forms.download.handler_crash` | Unhandled exception | Check logs. |

**If you see a burst of multiple form-failure alerts at once**, the underlying cause is usually:
- Apollo outage (multiple `*.apollo*` checks across different forms)
- Strapi outage (multiple `*.strapi*` checks)
- Bad Next.js deploy (mixed handler errors)
- Env var missing in Amplify after a config rotation (multiple `*.config` checks)

In that case, address the root cause; don't try to triage each alert individually.

---

## After resolving an alert

The detector will automatically dispatch a recovery alert (LOW severity)
once the underlying check passes again. You don't need to manually mark
anything resolved.

If a check is "stuck" DOWN after you've fixed the underlying issue (e.g.
the state row in DynamoDB has stale state), reset it:

```bash
aws dynamodb delete-item --table-name adaptive-detector-state \
  --key '{"checkKey": {"S": "<checkKey>"}}'
```

The next detector tick will re-evaluate from a clean slate.

---

## Related docs

- [DOWNTIME-DETECTOR-DESIGN.md](DOWNTIME-DETECTOR-DESIGN.md) — architecture and rationale
- [../infra/detector/README.md](../infra/detector/README.md) — deployment and operations
- [../STRAPI-AWS-MIGRATION.md](../STRAPI-AWS-MIGRATION.md) — Strapi infrastructure context
- [../STRAPI-UPLOADS-TO-S3.md](../STRAPI-UPLOADS-TO-S3.md) — S3 / media context
