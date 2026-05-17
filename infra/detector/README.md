# Adaptive Intelligence Downtime Detector

A scheduled Lambda that polls the site, Strapi, form endpoints, and external
dependencies once a minute. Tracks per-check state in DynamoDB, publishes a
public status JSON to S3, and dispatches Slack + email alerts on state
transitions.

See `../../docs/DOWNTIME-DETECTOR-DESIGN.md` for the full design and rationale.

## What gets deployed

| Resource | Purpose |
|---|---|
| Lambda function (`*-detector`) | Runs checks, manages state, dispatches alerts |
| DynamoDB table (`*-state`) | Per-check state machine (OK/DOWN, cooldowns) |
| S3 bucket (`*-status-<accountid>`) | Hosts public `status.json` |
| EventBridge schedule | Invokes the Lambda every minute |
| CloudWatch alarm + SNS topic | Pages a fallback address if the Lambda stops invoking |

Total monthly cost: **under $1** at the default cadence (Lambda free tier
covers all invocations; DynamoDB on-demand is pennies; S3 PUTs are pennies).

## Prerequisites

- AWS CLI configured with credentials that can create IAM roles, Lambda,
  DynamoDB, S3, EventBridge schedules, and CloudWatch alarms in your account
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
  installed and on PATH
- Node 20+ locally (for `sam build` to bundle Lambda deps correctly)
- Verified sender domain in [Resend](https://resend.com/) if you want email
  alerts (free tier covers ~3k emails/month — generous for this use case)
- Slack incoming webhook URL pointed at the channel you want ops alerts in
  (recommend a dedicated `#site-alerts` channel, **separate** from any
  existing form-submission notification channel)

## First-time setup

1. **Set `MONITOR_SECRET` in the Next.js Amplify environment first.** Pick a
   random 32-character string (`openssl rand -hex 16` works). The Lambda
   must use the same value, so save it — you'll pass it as a SAM parameter
   in step 3.

   Until this env var is set in Amplify AND the Phase 2 code is deployed,
   the synthetic form checks (`forms.synthetic.*`) will all alert as DOWN.
   So: deploy the Next.js side first, then this Lambda.

2. **Generate a read-only Strapi API token** for the image health check:
   Strapi admin → Settings → API Tokens → Create new API token →
   - Name: `monitor-readonly`
   - Token duration: Unlimited
   - Token type: Custom
   - Permissions: `Upload` → `find` only (no write perms)

   Copy the token; you'll pass it as a SAM parameter.

3. **First deploy:**

   ```bash
   cd infra/detector

   # One-time: bundles AWS SDK + your code into a Lambda artifact.
   sam build

   # Walks you through stack name, region, and all parameters interactively.
   # Save the answers to samconfig.toml when prompted.
   sam deploy --guided
   ```

   Suggested values during `--guided`:
   - Stack Name: `adaptive-detector`
   - AWS Region: same region as Strapi / Amplify (likely `us-east-1`)
   - `SiteBaseUrl`: `https://adaptiveintelligence.online`
   - `StrapiBaseUrl`: `https://admin.adaptiveintelligence.online`
   - `StrapiApiToken`: paste from step 2 (echoes as `*****`)
   - `MonitorSecret`: paste from step 1
   - `SlackWebhookUrl`: paste your `#site-alerts` webhook
   - `ResendApiKey`: paste your Resend API key (or leave empty to skip email)
   - `AlertEmailFrom`: e.g. `alerts@adaptiveintelligence.online` (must be
     a Resend-verified sender)
   - `AlertEmailTo`: comma-separated recipients
   - `RunbookBaseUrl`: e.g. `https://github.com/<org>/<repo>/blob/main/docs/RUNBOOK.md`
     (or leave empty for now)
   - `AlertSinkEmail`: where the "Lambda stopped invoking" SNS alarm goes.
     Use a personal address — this is the fallback when everything else
     is broken. (You'll get a one-time SNS confirmation email — click it
     to activate.)

4. **Copy the stack outputs:** after `sam deploy` finishes, note the
   `StatusJsonUrl` output. Set it as **`MONITOR_STATUS_URL`** in Amplify
   environment variables, then redeploy Amplify so
   `/api/monitor/status` picks it up.

5. **Confirm the SNS subscription:** check `AlertSinkEmail` inbox and
   confirm the "AWS Notification — Subscription Confirmation" email.
   Without confirming, the watchdog-of-the-watchdog won't be able to page
   you if the Lambda dies.

6. **Verify end-to-end** (see "Smoke test" below).

## Subsequent deploys

After the initial `sam deploy --guided`, parameters are saved to
`samconfig.toml`. Subsequent updates are one command:

```bash
sam build && sam deploy
```

To change a parameter (e.g., rotate `MonitorSecret`):

```bash
sam deploy --parameter-overrides MonitorSecret=<new-value>
```

Don't commit `samconfig.toml` if it ends up containing secrets — check
before adding it to git. The current `.gitignore` does not exclude it.

## Smoke test

Run these after the first deploy and after any significant change.

```bash
# 1. Lambda invokes successfully (look for "detector.tick" log line):
aws logs tail /aws/lambda/adaptive-detector-detector --follow --since 5m

# 2. Status JSON is publishing (replace with your StatusJsonUrl output):
curl https://adaptive-detector-status-<account>.s3.us-east-1.amazonaws.com/status.json | jq

# 3. Next.js status endpoint is serving the JSON:
curl https://adaptiveintelligence.online/api/monitor/status | jq

# 4. Synthetic form checks actually run end-to-end (look for HTTP 200 in
#    Amplify SSR logs for /api/submit-contact-form etc. with x-monitor-secret
#    header):
aws logs tail /aws/lambda/<your-amplify-ssr-function> --follow
```

To force an alert (verify the Slack + email path works), temporarily edit
the SAM template to set `StrapiBaseUrl` to a bogus URL and redeploy. After
2 minutes you should see a CRITICAL alert. Revert and redeploy.

## Operating

- **Logs**: `aws logs tail /aws/lambda/adaptive-detector-detector --follow`
- **Current state of any check**:
  ```bash
  aws dynamodb get-item --table-name adaptive-detector-state \
    --key '{"checkKey": {"S": "strapi.api"}}'
  ```
- **Pause the detector** (planned maintenance, expected outage):
  ```bash
  aws scheduler update-schedule --name adaptive-detector-every-minute \
    --state DISABLED --schedule-expression "cron(0/1 * * * ? *)" \
    --flexible-time-window '{"Mode": "OFF"}' \
    --target '{"Arn": "<lambda-arn>", "RoleArn": "<role-arn>"}'
  ```
  Re-enable by passing `--state ENABLED`.
- **Reset a check's state** (after fixing the root cause and you want
  fresh state, not the lingering `DOWN`):
  ```bash
  aws dynamodb delete-item --table-name adaptive-detector-state \
    --key '{"checkKey": {"S": "<checkKey>"}}'
  ```

## Architecture quick reference

```
EventBridge (every minute)
        │
        ▼
    Lambda ──► checks (parallel) ──► DynamoDB (per-check state machine)
        │                                  │
        │                                  ▼
        │                          dispatchAlert ──► Slack
        │                                       └─► Resend (email)
        ▼
    S3 status.json ◄── Next.js /api/monitor/status

CloudWatch alarm watches Lambda invocations.
If <5 invocations in 15 min, SNS → AlertSinkEmail.
```

## Adding a new check

1. Edit `src/checks.js`:
   - Add an entry to `CHECKS`
   - Add the key to one of the `CHECK_BUCKETS` arrays (`every1min`,
     `every5min`, `every15min`)
   - Add the key to `SEVERITY_BY_CHECK`
2. Edit `src/status.js`:
   - The `ALL_CHECK_KEYS` list builds from `CHECK_BUCKETS`, so it picks
     up the new check automatically
3. Edit `../../src/pages/api/monitor/status.js`:
   - Add the new key to `PLACEHOLDER_KEYS` so the fallback shape matches
4. `sam build && sam deploy`

That's the whole loop — no state migration, DynamoDB picks up the new key
on first run.
