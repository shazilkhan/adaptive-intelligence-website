# Monitor scheduler (EventBridge + Lambda)

Production runs on **AWS Amplify**, which has no built-in cron. This stack is the
cron: an **EventBridge Scheduler** rule invokes a small **Lambda** every 5 minutes,
which POSTs to `https://adaptiveintelligence.online/api/monitor/run` with the
shared secret so the uptime monitor performs its sweep.

The Lambda is also a **dead-man's switch**: if the whole site is down, the
endpoint is unreachable and the in-app Slack alerter can't run (it lives in the
dead site). The Lambda detects that and posts to Slack directly.

## Prerequisites

1. AWS CLI installed and configured for the **same account/region** as the app
   (`aws sts get-caller-identity` to confirm).
2. The app's env vars already set in **Amplify Console → App settings → Environment
   variables**, then redeployed:
   - `MONITOR_RUN_SECRET` — the secret this Lambda will send as `Authorization: Bearer …`
   - `MONITOR_BASE_URL=https://adaptiveintelligence.online`
   - `MONITOR_DASHBOARD_TOKEN`, `MONITOR_SLACK_WEBHOOK_URL`
   - `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (from the Upstash console)

## Deploy

One command — the Lambda code is inlined in the template, so there's nothing to
package or upload:

```bash
aws cloudformation deploy \
  --template-file infra/monitor-scheduler/template.yaml \
  --stack-name adaptive-monitor-scheduler \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
      MonitorRunSecret='<same value as Amplify MONITOR_RUN_SECRET>' \
      AlertWebhookUrl='<your Slack #alerts incoming webhook>'
```

`MonitorUrl` defaults to the production endpoint and `ScheduleExpression` to
`rate(5 minutes)`; override either via `--parameter-overrides` if needed.

## Test it

```bash
# Invoke the trigger Lambda once and see the result:
aws lambda invoke --function-name adaptive-monitor-poke /dev/stdout

# Then confirm a fresh run landed (needs the dashboard token):
curl "https://adaptiveintelligence.online/api/monitor/status?token=<MONITOR_DASHBOARD_TOKEN>"
```

A successful invoke returns `{"ok":true,"statusCode":200,...}`. To verify the
dead-man's switch, temporarily set `MonitorRunSecret` to a wrong value and
redeploy — the next tick should post the `:rotating_light: Monitor trigger
failed` message to Slack. (Revert afterward.)

## Editing the Lambda

`index.js` in this folder is the readable source of truth. The CloudFormation
template embeds a copy in its `Code.ZipFile` block — **if you edit `index.js`,
update the inline copy too**, or switch to a packaged deploy:

```bash
cd infra/monitor-scheduler && zip function.zip index.js
aws lambda update-function-code --function-name adaptive-monitor-poke --zip-file fileb://function.zip
```

## Teardown

```bash
aws cloudformation delete-stack --stack-name adaptive-monitor-scheduler
```

## Note on `vercel.json`

`vercel.json` at the repo root defines a Vercel cron — it is a **no-op on
Amplify** and exists only because the feature was scaffolded assuming Vercel.
This stack replaces it. The `vercel.json` / `.vercel/` files can be removed.
